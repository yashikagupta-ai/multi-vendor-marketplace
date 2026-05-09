const mongoose = require('mongoose');

const commissionLedgerSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
  grossAmount: { type: Number, required: true }, // In cents
  commissionRateApplied: { type: Number, required: true }, // Percentage
  commissionAmount: { type: Number, required: true }, // In cents
  netAmount: { type: Number, required: true }, // In cents
  status: { type: String, enum: ['pending', 'cleared', 'refunded'], default: 'cleared' }
}, { timestamps: true });

module.exports = mongoose.model('CommissionLedger', commissionLedgerSchema);
