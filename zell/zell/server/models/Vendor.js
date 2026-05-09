const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  storefront: {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    bio: { type: String },
    logoUrl: { type: String },
    bannerUrl: { type: String },
    themeAccent: { type: String, default: '#C8DDD4' }
  },
  tier: { type: String, enum: ['starter', 'pro', 'elite'], default: 'starter' },
  commissionRate: { type: Number, default: 10.0 }, // Percentage, e.g., 10.0%
  stripeAccountId: { type: String }, // For Stripe Connect
  stripeOnboardingComplete: { type: Boolean, default: false },
  isApproved: { type: Boolean, default: false },
  bankAccount: { type: String },
  ifscCode: { type: String },
  bankName: { type: String },
  analytics: {
    totalSales: { type: Number, default: 0 },
    totalOrders: { type: Number, default: 0 }
  }
}, { timestamps: true });

module.exports = mongoose.model('Vendor', vendorSchema);
