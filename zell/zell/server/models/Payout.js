const mongoose = require('mongoose');

const payoutSchema = new mongoose.Schema({
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
  periodStart: { type: Date, required: true },
  periodEnd: { type: Date, required: true },
  amount: { type: Number, required: true }, // In cents
  stripePayoutId: { type: String },
  status: { type: String, enum: ['pending', 'processing', 'paid', 'failed'], default: 'pending' },
  ordersIncluded: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }]
}, { timestamps: true });

module.exports = mongoose.model('Payout', payoutSchema);
