const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Dispute = require('../models/Dispute');
const Order = require('../models/Order');

// @desc Create a new dispute
router.post('/', protect, async (req, res) => {
  try {
    const { orderId, vendorId, reason, evidence } = req.body;
    
    // Verify order belongs to user
    const order = await Order.findOne({ _id: orderId, buyerId: req.user._id });
    if (!order) {
      return res.status(403).json({ message: 'Order not found or access denied' });
    }

    const dispute = await Dispute.create({
      orderId,
      buyerId: req.user._id,
      vendorId,
      reason,
      evidence
    });

    res.status(201).json(dispute);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc Get user's disputes
router.get('/my-disputes', protect, async (req, res) => {
  try {
    const disputes = await Dispute.find({ buyerId: req.user._id })
      .populate('orderId')
      .populate('vendorId', 'storefront.name');
    res.json(disputes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
