import React, { useState, useEffect } from 'react';
import { Card } from '../../components/Card/Card';
import { useAuth } from '../../store/useAuth';
import { formatINR } from '../../utils/currency';

const DashboardMetrics = () => {
  const [metrics, setMetrics] = useState({ revenue: 0, orders: 0, disputes: 0 });
  const { token } = useAuth();

  useEffect(() => {
    // Quick aggregated mock/fetch for dashboard metrics
    fetch('http://localhost:5000/api/orders/vendor/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(orders => {
        if (!Array.isArray(orders)) return;
        let rev = 0;
        orders.forEach(order => {
          order.vendorSplit.forEach(split => {
            if(split.status === 'fulfilled') rev += split.netAmount;
          });
        });
        setMetrics(m => ({ ...m, revenue: rev, orders: orders.length }));
      })
      .catch(console.error);
      
    fetch('http://localhost:5000/api/disputes/vendor', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setMetrics(m => ({ ...m, disputes: data.filter(d => d.status === 'open').length }));
        }
      });
  }, [token]);

  return (
    <div style={{ display: 'flex', gap: '24px', marginBottom: '32px' }}>
      <Card style={{ flex: 1, backgroundColor: 'var(--color-surface)' }}>
        <h3 style={{ color: 'var(--color-text-muted)', fontSize: '14px', marginBottom: '8px' }}>Total Revenue (Net)</h3>
        <div style={{ fontSize: '32px', fontFamily: 'var(--font-mono)' }}>{formatINR(metrics.revenue)}</div>
      </Card>
      <Card style={{ flex: 1, backgroundColor: 'var(--color-surface)' }}>
        <h3 style={{ color: 'var(--color-text-muted)', fontSize: '14px', marginBottom: '8px' }}>Total Orders</h3>
        <div style={{ fontSize: '32px', fontFamily: 'var(--font-mono)' }}>{metrics.orders}</div>
      </Card>
      <Card style={{ flex: 1, backgroundColor: 'var(--color-surface)' }}>
        <h3 style={{ color: 'var(--color-text-muted)', fontSize: '14px', marginBottom: '8px' }}>Open Disputes</h3>
        <div style={{ fontSize: '32px', fontFamily: 'var(--font-mono)', color: metrics.disputes > 0 ? '#DC2626' : 'inherit' }}>
          {metrics.disputes}
        </div>
      </Card>
    </div>
  );
};

export default DashboardMetrics;
