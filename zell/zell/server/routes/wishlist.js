const express = require('express');
const router = express.Router();
const Wishlist = require('../models/Wishlist');
const { protect } = require('../middleware/auth');

// @route GET /api/wishlist
// @desc Get user's wishlist
router.get('/', protect, async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ userId: req.user._id }).populate('productIds');
    if (!wishlist) {
      wishlist = await Wishlist.create({ userId: req.user._id, productIds: [] });
    }
    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route POST /api/wishlist/:productId
// @desc Toggle product in wishlist
router.post('/:productId', protect, async (req, res) => {
  try {
    console.log(`Wishlist Toggle: User ${req.user._id} for Product ${req.params.productId}`);
    let wishlist = await Wishlist.findOne({ userId: req.user._id });
    if (!wishlist) {
      wishlist = await Wishlist.create({ userId: req.user._id, productIds: [] });
    }

    const productId = req.params.productId;
    const index = wishlist.productIds.findIndex(id => id.toString() === productId.toString());
    
    let added = false;
    if (index === -1) {
      wishlist.productIds.push(productId);
      added = true;
    } else {
      wishlist.productIds.splice(index, 1);
    }

    await wishlist.save();
    res.json({ added, productIds: wishlist.productIds.map(id => id.toString()) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
