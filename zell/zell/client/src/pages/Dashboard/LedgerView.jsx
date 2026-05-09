import React, { useState, useEffect } from 'react';
import { Card } from '../../components/Card/Card';
import { Badge } from '../../components/Badge/Badge';
import { Button } from '../../components/Button/Button';
import { useAuth } from '../../store/useAuth';
import { formatINR } from '../../utils/currency';

const LedgerView = () => {
  const [ledger, setLedger] = useState([]);
  const { token, user } = useAuth();
  const [totals, setTotals] = useState({ net: 0, fee: 0 });

  useEffect(() => {
    if (token) {
      fetch('http://localhost:5000/api/orders/vendor/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(orders => {
          if (!Array.isArray(orders)) return;
          const entries = [];
          let tNet = 0;
          let tFee = 0;
          
          orders.forEach(order => {
            order.vendorSplit.forEach(split => {
              entries.push({
                _id: order._id + split.vendorId,
                orderId: order._id,
                grossAmount: split.subtotal,
                commissionAmount: split.commissionAmount,
                netAmount: split.netAmount,
                status: split.status === 'fulfilled' ? 'cleared' : 'pending'
              });
              if (split.status === 'fulfilled') {
                tNet += split.netAmount;
              }
              tFee += split.commissionAmount;
            });
          });
          setLedger(entries);
          setTotals({ net: tNet, fee: tFee });
        })
        .catch(console.error);
    }
  }, [token]);

  const downloadPayout = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/reports/payout/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to download statement');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `payout-statement-${new Date().toLocaleDateString()}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="ledger-view">
      <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h2>Commission Ledger</h2>
          <p>Track your earnings and platform fees.</p>
        </div>
        <Button variant="outline" onClick={downloadPayout}>
          Download Payout PDF
        </Button>
      </div>

      <div style={{ display: 'flex', gap: '24px', marginBottom: '32px' }}>
        <Card style={{ flex: 1 }}>
          <h3 style={{ color: 'var(--color-text-muted)', fontSize: '14px', marginBottom: '8px' }}>Total Earned (Cleared Net)</h3>
          <div style={{ fontSize: '32px', fontFamily: 'var(--font-mono)' }}>{formatINR(totals.net)}</div>
        </Card>
        <Card style={{ flex: 1 }}>
          <h3 style={{ color: 'var(--color-text-muted)', fontSize: '14px', marginBottom: '8px' }}>Platform Fees</h3>
          <div style={{ fontSize: '32px', fontFamily: 'var(--font-mono)' }}>{formatINR(totals.fee)}</div>
        </Card>
      </div>

      <Card>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
              <th style={{ padding: '12px' }}>Order Ref</th>
              <th style={{ padding: '12px' }}>Gross</th>
              <th style={{ padding: '12px' }}>Zell Fee</th>
              <th style={{ padding: '12px' }}>Net Earned</th>
              <th style={{ padding: '12px' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {ledger.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ padding: '40px 20px', textAlign: 'center' }}>
                  <img src="/images/empty_ledger.png" alt="Empty Ledger" style={{ maxWidth: '250px', width: '100%', marginBottom: '16px', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }} />
                  <h4 style={{ marginBottom: '8px' }}>Ledger is Empty</h4>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>Your financial transactions and platform fees will be tracked here.</p>
                </td>
              </tr>
            ) : (
              ledger.map(entry => (
                <tr key={entry._id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '12px', fontFamily: 'var(--font-mono)', fontSize: '14px' }}>{entry.orderId}</td>
                  <td style={{ padding: '12px', fontFamily: 'var(--font-mono)' }}>{formatINR(entry.grossAmount)}</td>
                  <td style={{ padding: '12px', fontFamily: 'var(--font-mono)' }}>{formatINR(entry.commissionAmount)}</td>
                  <td style={{ padding: '12px', fontFamily: 'var(--font-mono)' }}>{formatINR(entry.netAmount)}</td>
                  <td style={{ padding: '12px' }}>
                    <Badge variant={entry.status === 'cleared' ? 'success' : 'warning'}>{entry.status}</Badge>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

export default LedgerView;
