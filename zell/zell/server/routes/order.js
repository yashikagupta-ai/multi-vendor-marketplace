const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const CommissionLedger = require('../models/CommissionLedger');
const { protect, authorize } = require('../middleware/auth');
const { vendorScope } = require('../middleware/vendorScope');
const { recordCommission } = require('../services/commission');

// @route POST /api/orders
// @desc Create a new order (Mocking checkout process)
router.post('/', protect, async (req, res) => {
  try {
    const { lineItems, stripePaymentIntentId } = req.body;
    
    // Group line items by vendor
    const vendorSplits = {};
    let totalAmount = 0;

    for (let item of lineItems) {
      const product = await Product.findById(item.productId);
      if (!product) return res.status(404).json({ message: 'Product not found' });

      totalAmount += item.quantity * item.priceAtPurchase;

      if (!vendorSplits[product.vendorId]) {
        vendorSplits[product.vendorId] = { subtotal: 0, vendorId: product.vendorId };
      }
      vendorSplits[product.vendorId].subtotal += item.quantity * item.priceAtPurchase;
    }

    const order = new Order({
      buyerId: req.user._id,
      stripePaymentIntentId: stripePaymentIntentId || 'mock_pi',
      lineItems,
      vendorSplit: Object.values(vendorSplits).map(vs => ({
        vendorId: vs.vendorId,
        subtotal: vs.subtotal,
        commissionAmount: 0, // Will be updated by commission engine
        netAmount: 0 // Will be updated by commission engine
      })),
      totalAmount
    });

    // Set expected delivery to 5 days from now
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 5);
    order.expectedDelivery = deliveryDate;

    if (req.body.shippingAddress) {
      order.shippingAddress = req.body.shippingAddress;
    }

    await order.save();

    // Trigger commission logic
    for (let i=0; i < order.vendorSplit.length; i++) {
      const split = order.vendorSplit[i];
      const { commissionAmount, netAmount } = await recordCommission(order._id, split.vendorId, split.subtotal);
      order.vendorSplit[i].commissionAmount = commissionAmount;
      order.vendorSplit[i].netAmount = netAmount;
    }
    
    order.commissionDeducted = true;
    await order.save();

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route GET /api/orders/vendor/me
// @desc Get orders for vendor
router.get('/vendor/me', protect, authorize('vendor'), vendorScope, async (req, res) => {
  try {
    const orders = await Order.find({ 'vendorSplit.vendorId': req.vendor._id });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route GET /api/orders/me
// @desc Get orders for buyer
router.get('/me', protect, async (req, res) => {
  try {
    const orders = await Order.find({ buyerId: req.user._id });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route PUT /api/orders/:id/fulfill
// @desc Vendor marks their part of the order as fulfilled
router.put('/:id/fulfill', protect, authorize('vendor'), vendorScope, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Find the vendor split
    const splitIndex = order.vendorSplit.findIndex(vs => vs.vendorId.toString() === req.vendor._id.toString());
    if (splitIndex === -1) return res.status(403).json({ message: 'Not authorized for this order' });

    order.vendorSplit[splitIndex].status = 'fulfilled';
    order.vendorSplit[splitIndex].isNew = false;
    await order.save();

    // Update Ledger status to 'cleared'
    const ledger = await CommissionLedger.findOne({ orderId: order._id, vendorId: req.vendor._id });
    if (ledger) {
      ledger.status = 'cleared';
      await ledger.save();
    }

    // Reduce stock for items in this split
    for (let item of order.lineItems) {
      const product = await Product.findById(item.productId);
      if (product && product.vendorId.toString() === req.vendor._id.toString()) {
        product.countInStock = Math.max(0, product.countInStock - item.quantity);
        await product.save();
      }
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
