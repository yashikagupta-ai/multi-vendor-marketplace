const Vendor = require('../models/Vendor');

const vendorScope = async (req, res, next) => {
  try {
    const vendor = await Vendor.findOne({ userId: req.user._id });
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor profile not found for this user' });
    }
    req.vendor = vendor;
    next();
  } catch (error) {
    res.status(500).json({ message: 'Error checking vendor scope' });
  }
};

module.exports = { vendorScope };
