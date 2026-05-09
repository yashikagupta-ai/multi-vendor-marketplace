const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Vendor = require('../models/Vendor');
const { protect, authorize } = require('../middleware/auth');
const { vendorScope } = require('../middleware/vendorScope');

// @route GET /api/products
// @desc Get all products (with filters, search, pagination)
router.get('/', async (req, res) => {
  try {
    const { 
      vendorId, category, q, minPrice, maxPrice, 
      sort, inStock, tags, page = 1, limit = 20 
    } = req.query;

    const filter = { isActive: true };

    if (vendorId) filter.vendorId = vendorId;
    if (category) filter.category = category;
    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ];
    }
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseInt(minPrice);
      if (maxPrice) filter.price.$lte = parseInt(maxPrice);
    }
    if (inStock === 'true') {
      filter.inventory = { $gt: 0 };
    }
    if (tags) {
      filter.tags = { $in: tags.split(',') };
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'price_asc') sortOption = { price: 1 };
    if (sort === 'price_desc') sortOption = { price: -1 };
    if (sort === 'popular') sortOption = { 'metrics.sales': -1 }; // Placeholder for popularity
    if (sort === 'newest') sortOption = { createdAt: -1 };

    const skip = (page - 1) * limit;
    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .populate('vendorId', 'storefront')
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      products,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route GET /api/products/:id
// @desc Get single product details and related products
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('vendorId', 'storefront commissionRate tier');
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const related = await Product.find({ 
      vendorId: product.vendorId._id, 
      _id: { $ne: product._id }, 
      isActive: true 
    }).limit(4);

    res.json({ product, related });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route GET /api/products/vendor/me
// @desc Get all products for the logged in vendor
router.get('/vendor/me', protect, authorize('vendor'), vendorScope, async (req, res) => {
  try {
    const products = await Product.find({ vendorId: req.vendor._id });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route POST /api/products
// @desc Create a product
router.post('/', protect, authorize('vendor'), vendorScope, async (req, res) => {
  try {
    const product = new Product({
      ...req.body,
      vendorId: req.vendor._id
    });
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route PUT /api/products/:id
// @desc Update a product
router.put('/:id', protect, authorize('vendor'), vendorScope, async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (product.vendorId.toString() !== req.vendor._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route DELETE /api/products/:id
// @desc Delete a product
router.delete('/:id', protect, authorize('vendor'), vendorScope, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (product.vendorId.toString() !== req.vendor._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
