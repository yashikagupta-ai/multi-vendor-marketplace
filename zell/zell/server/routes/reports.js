const express = require('express');
const router = express.Router();
const ejs = require('ejs');
const path = require('path');
const htmlPdf = require('html-pdf-node');
const { protect, authorize } = require('../middleware/auth');
const Vendor = require('../models/Vendor');
const CommissionLedger = require('../models/CommissionLedger');

// @route GET /api/reports/payout/:vendorId
// @desc Generate PDF payout statement for a vendor
router.get('/payout/:vendorId', protect, authorize('admin', 'vendor'), async (req, res) => {
  try {
    let vendorId = req.params.vendorId;
    if (vendorId === 'me' || vendorId === 'current' || vendorId === 'undefined') {
      const v = await Vendor.findOne({ userId: req.user._id });
      if (!v) return res.status(404).json({ message: 'Vendor profile not found' });
      vendorId = v._id;
    }

    const vendor = await Vendor.findById(vendorId).populate('userId', 'name');
    if (!vendor) return res.status(404).json({ message: 'Vendor not found' });

    if (req.user.role === 'vendor' && req.user._id.toString() !== vendor.userId._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this report' });
    }

    const ledgerEntries = await CommissionLedger.find({ vendorId: vendor._id });

    let totalGross = 0;
    let totalCommission = 0;
    let totalNet = 0;

    ledgerEntries.forEach(entry => {
      totalGross += entry.grossAmount;
      totalCommission += entry.commissionAmount;
      totalNet += entry.netAmount;
    });

    const data = {
      vendorName: vendor.storefront.name,
      period: 'All Time',
      entries: ledgerEntries,
      totalGross: (totalGross / 100).toFixed(2),
      totalCommission: (totalCommission / 100).toFixed(2),
      totalNet: (totalNet / 100).toFixed(2)
    };

    const templatePath = path.join(__dirname, '../reports/payout-statement.ejs');

    ejs.renderFile(templatePath, data, async (err, html) => {
      if (err) return res.status(500).json({ message: 'Error rendering template' });

      const options = { format: 'A4' };
      const file = { content: html };

      htmlPdf.generatePdf(file, options).then(pdfBuffer => {
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=payout-${vendor._id}.pdf`);
        res.send(pdfBuffer);
      }).catch(() => {
        res.status(500).json({ message: 'Error generating PDF' });
      });
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route GET /api/reports/admin-summary
// @desc Generate PDF commission summary report for all vendors (admin only)
router.get('/admin-summary', protect, authorize('admin'), async (req, res) => {
  try {
    const vendors = await Vendor.find();

    // Build per-vendor totals
    const vendorRows = await Promise.all(
      vendors.map(async (vendor) => {
        const entries = await CommissionLedger.find({ vendorId: vendor._id });
        let gross = 0;
        let commission = 0;
        entries.forEach(e => {
          gross += e.grossAmount;
          commission += e.commissionAmount;
        });
        return {
          storefront: vendor.storefront,
          tier: vendor.tier,
          gross,
          commission
        };
      })
    );

    const totalGross = vendorRows.reduce((sum, v) => sum + v.gross, 0);
    const totalZellCommission = vendorRows.reduce((sum, v) => sum + v.commission, 0);

    const data = {
      vendors: vendorRows,
      totalGross: (totalGross / 100).toFixed(2),
      totalZellCommission: (totalZellCommission / 100).toFixed(2)
    };

    const templatePath = path.join(__dirname, '../reports/admin-summary.ejs');

    ejs.renderFile(templatePath, data, async (err, html) => {
      if (err) return res.status(500).json({ message: 'Error rendering template' });

      const options = { format: 'A4' };
      const file = { content: html };

      htmlPdf.generatePdf(file, options).then(pdfBuffer => {
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=zell-admin-commission-summary.pdf');
        res.send(pdfBuffer);
      }).catch(() => {
        res.status(500).json({ message: 'Error generating PDF' });
      });
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
