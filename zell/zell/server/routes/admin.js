const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const Order = require('../models/Order');
const Dispute = require('../models/Dispute');
const Vendor = require('../models/Vendor');

// @desc Get platform metrics for admin
router.get('/metrics', protect, authorize('admin'), async (req, res) => {
  try {
    const orders = await Order.find();
    const disputes = await Dispute.find({ status: 'open' });
    
    let totalGross = 0;
    let totalZellCommission = 0;
    
    orders.forEach(order => {
      totalGross += order.totalAmount;
      order.vendorSplit.forEach(split => {
        totalZellCommission += split.commissionAmount;
      });
    });

    res.json({
      totalOrders: orders.length,
      totalGross,
      totalZellCommission,
      openDisputes: disputes.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc Get all disputes
router.get('/disputes', protect, authorize('admin'), async (req, res) => {
  try {
    const disputes = await Dispute.find()
      .populate('buyerId', 'name email')
      .populate('vendorId')
      .populate('orderId');
    res.json(disputes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc Resolve a dispute
router.put('/disputes/:id/resolve', protect, authorize('admin'), async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    const dispute = await Dispute.findById(req.params.id);
    
    if (dispute) {
      dispute.status = status;
      dispute.adminNotes = adminNotes;
      dispute.resolutionDate = Date.now();
      await dispute.save();
      res.json(dispute);
    } else {
      res.status(404).json({ message: 'Dispute not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc Get all vendors for approval
router.get('/vendors', protect, authorize('admin'), async (req, res) => {
  try {
    const vendors = await Vendor.find().populate('userId', 'name email');
    res.json(vendors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc Approve a vendor
router.put('/vendors/:id/approve', protect, authorize('admin'), async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    if (vendor) {
      vendor.isApproved = true;
      await vendor.save();
      res.json({ message: 'Vendor approved' });
    } else {
      res.status(404).json({ message: 'Vendor not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc Update vendor tier
router.put('/vendors/:id/tier', protect, authorize('admin'), async (req, res) => {
  try {
    const { tier } = req.body;
    const vendor = await Vendor.findById(req.params.id);
    if (vendor) {
      vendor.tier = tier;
      // Also update commission rate based on tier
      if (tier === 'elite') vendor.commissionRate = 5;
      else if (tier === 'pro') vendor.commissionRate = 8;
      else vendor.commissionRate = 10;
      
      await vendor.save();
      res.json(vendor);
    } else {
      res.status(404).json({ message: 'Vendor not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
