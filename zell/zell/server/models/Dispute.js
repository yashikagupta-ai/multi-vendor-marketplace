const mongoose = require('mongoose');

const disputeSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
  reason: { type: String, required: true },
  evidence: { type: String }, // Optional description or link
  status: { 
    type: String, 
    enum: ['open', 'resolved_refunded', 'resolved_dismissed'], 
    default: 'open' 
  },
  adminNotes: { type: String },
  resolutionDate: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Dispute', disputeSchema);
