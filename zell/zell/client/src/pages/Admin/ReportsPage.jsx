import React, { useState, useEffect } from 'react';
import { useAuth } from '../../store/useAuth';
import { Card } from '../../components/Card/Card';
import { Button } from '../../components/Button/Button';
import { formatINR } from '../../utils/currency';

const ReportsPage = () => {
  const [metrics, setMetrics] = useState({
    totalOrders: 0,
    totalGross: 0,
    totalZellCommission: 0,
    openDisputes: 0
  });
  const { token } = useAuth();

  useEffect(() => {
    if (token) {
      fetch('http://localhost:5000/api/admin/metrics', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if(data && !data.message) setMetrics(data);
        })
        .catch(console.error);
    }
  }, [token]);

  const downloadAdminReport = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/reports/admin-summary', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to download report');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'zell-admin-commission-summary.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <div className="dashboard-header">
        <h2>Platform Reports</h2>
        <p>Overview of Zell Marketplace performance and metrics.</p>
      </div>

      <div style={{ display: 'flex', gap: '24px', marginBottom: '32px' }}>
        <Card style={{ flex: 1 }}>
          <h3 style={{ color: 'var(--color-text-muted)', fontSize: '14px', marginBottom: '8px' }}>Total Platform Gross</h3>
          <div style={{ fontSize: '32px', fontFamily: 'var(--font-mono)' }}>{formatINR(metrics.totalGross)}</div>
        </Card>
        <Card style={{ flex: 1 }}>
          <h3 style={{ color: 'var(--color-text-muted)', fontSize: '14px', marginBottom: '8px' }}>Total Zell Revenue (Commission)</h3>
          <div style={{ fontSize: '32px', fontFamily: 'var(--font-mono)' }}>{formatINR(metrics.totalZellCommission)}</div>
        </Card>
        <Card style={{ flex: 1 }}>
          <h3 style={{ color: 'var(--color-text-muted)', fontSize: '14px', marginBottom: '8px' }}>Open Disputes</h3>
          <div style={{ fontSize: '32px', fontFamily: 'var(--font-mono)', color: metrics.openDisputes > 0 ? '#DC2626' : 'inherit' }}>
            {metrics.openDisputes}
          </div>
        </Card>
      </div>

      <Card>
        <h3>Download Commission Summary</h3>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '16px' }}>Generate a server-side rendered PDF report containing the all-vendors commission summary.</p>
        <Button onClick={downloadAdminReport}>
          Download Admin Report PDF
        </Button>
      </Card>
    </div>
  );
};

export default ReportsPage;
