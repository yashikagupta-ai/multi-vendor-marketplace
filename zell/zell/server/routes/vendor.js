const express = require('express');
const router = express.Router();
const Vendor = require('../models/Vendor');
const { protect, authorize } = require('../middleware/auth');
const { vendorScope } = require('../middleware/vendorScope');

// @route GET /api/vendors/public
// @desc Get all public vendors
router.get('/public', async (req, res) => {
  try {
    const vendors = await Vendor.find().populate('userId', 'name profile');
    res.json(vendors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route GET /api/vendors/public/:slug
// @desc Get a single vendor by slug
router.get('/public/:slug', async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ 'storefront.slug': req.params.slug }).populate('userId', 'name profile');
    if (!vendor) return res.status(404).json({ message: 'Vendor not found' });
    res.json(vendor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route GET /api/vendors/me
// @desc Get current vendor profile
router.get('/me', protect, authorize('vendor'), vendorScope, async (req, res) => {
  res.json(req.vendor);
});

// @route PUT /api/vendors/me
// @desc Update current vendor profile
router.put('/me', protect, authorize('vendor'), vendorScope, async (req, res) => {
  try {
    const { storefront } = req.body;
    if (storefront) {
      req.vendor.storefront = { ...req.vendor.storefront, ...storefront };
    }
    await req.vendor.save();
    res.json(req.vendor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
