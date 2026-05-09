const mongoose = require('mongoose');

const orderLineItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
  quantity: { type: Number, required: true },
  priceAtPurchase: { type: Number, required: true }, // In cents
  title: { type: String, required: true }
});

const vendorSplitSchema = new mongoose.Schema({
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
  subtotal: { type: Number, required: true }, // In cents
  commissionAmount: { type: Number, required: true }, // In cents
  netAmount: { type: Number, required: true }, // In cents
  status: { type: String, enum: ['pending', 'fulfilled', 'shipped', 'delivered', 'disputed'], default: 'pending' },
  isNew: { type: Boolean, default: true }
});

const orderSchema = new mongoose.Schema({
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  stripePaymentIntentId: { type: String, required: true },
  shippingAddress: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    zipCode: { type: String },
    country: { type: String, default: 'India' }
  },
  expectedDelivery: { type: Date },
  lineItems: [orderLineItemSchema],
  vendorSplit: [vendorSplitSchema],
  totalAmount: { type: Number, required: true }, // In cents
  status: { type: String, enum: ['payment_pending', 'paid', 'processing', 'completed', 'cancelled'], default: 'payment_pending' },
  commissionDeducted: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
