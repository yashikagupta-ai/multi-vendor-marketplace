const CommissionLedger = require('../models/CommissionLedger');
const Vendor = require('../models/Vendor');

/**
 * Calculates and records the commission for a given order line item.
 */
const recordCommission = async (orderId, vendorId, grossAmount) => {
  const vendor = await Vendor.findById(vendorId);
  if (!vendor) throw new Error('Vendor not found');

  const commissionRate = vendor.commissionRate;
  const commissionAmount = Math.round(grossAmount * (commissionRate / 100));
  const netAmount = grossAmount - commissionAmount;

  const ledgerEntry = new CommissionLedger({
    orderId,
    vendorId,
    grossAmount,
    commissionRateApplied: commissionRate,
    commissionAmount,
    netAmount,
    status: 'pending' // pending until payout
  });

  await ledgerEntry.save();
  return { commissionAmount, netAmount };
};

module.exports = { recordCommission };
