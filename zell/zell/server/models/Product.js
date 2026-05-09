const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true }, // Stored in paise
  images: [{ type: String }],
  catalogue: { type: String },
  inventory: { type: Number, default: 0, required: true },
  category: { 
    type: String, 
    enum: ['home-living', 'ceramics', 'apparel', 'wellness', 'stationery', 'kitchen', 'jewellery', 'art'],
    default: 'home-living'
  },
  specifications: [{ key: String, value: String }],
  tags: [{ type: String }],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
