const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Vendor = require('../models/Vendor');
const { protect } = require('../middleware/auth');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @route POST /api/auth/register
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'buyer'
    });

    if (user.role === 'vendor') {
      // Create initial vendor profile
      await Vendor.create({
        userId: user._id,
        storefront: {
          name: `${user.name}'s Shop`,
          slug: `${user.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`
        }
      });
    }

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      let vendorData = null;
      if (user.role === 'vendor') {
        vendorData = await Vendor.findOne({ userId: user._id });
      }
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        vendorData,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route GET /api/auth/me
router.get('/me', protect, async (req, res) => {
  res.json(req.user);
});

// @route GET /api/auth/me
// @desc Get current user profile
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    let vendorData = null;
    if (user.role === 'vendor') {
      vendorData = await require('../models/Vendor').findOne({ userId: user._id });
    }
    res.json({ ...user._doc, vendorData });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route PUT /api/auth/profile
// @desc Update user profile
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, phone, bankAccount, ifscCode, bankName } = req.body;
    const user = await User.findById(req.user._id);
    
    if (name) user.name = name;
    if (!user.profile) user.profile = {};
    if (phone) user.profile.phone = phone;
    
    await user.save();

    if (user.role === 'vendor') {
      const vendor = await require('../models/Vendor').findOne({ userId: user._id });
      if (vendor) {
        vendor.bankAccount = bankAccount;
        vendor.ifscCode = ifscCode;
        vendor.bankName = bankName;
        await vendor.save();
      }
    }

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
