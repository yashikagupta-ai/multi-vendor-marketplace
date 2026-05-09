const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const { protect } = require('../middleware/auth');

// @route POST /api/reviews
// @desc Submit a review
router.post('/', protect, async (req, res) => {
  try {
    const { productId, rating, title, body } = req.body;
    
    // In a real app, check if user has purchased the product
    
    const review = new Review({
      productId,
      userId: req.user._id,
      userName: req.user.name,
      rating,
      title,
      body,
      verified: true // Mocking verification for now
    });

    await review.save();
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route GET /api/reviews/:productId
// @desc Get reviews for a product
router.get('/:productId', async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.productId }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
