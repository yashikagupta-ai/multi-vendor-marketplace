import React, { useState, useEffect } from 'react';
import { useAuth } from '../../store/useAuth';
import { Card } from '../../components/Card/Card';
import { Badge } from '../../components/Badge/Badge';
import { Button } from '../../components/Button/Button';

const DisputeMediation = () => {
  const [disputes, setDisputes] = useState([]);
  const { token } = useAuth();

  useEffect(() => {
    fetch('http://localhost:5000/api/admin/disputes', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setDisputes(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, [token]);

  const resolveDispute = async (id, status) => {
    try {
      const res = await fetch(`http://localhost:5000/api/disputes/${id}/resolve`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status, adminNotes: 'Resolved by admin', resolution: 'Processed' })
      });
      if (res.ok) {
        setDisputes(disputes.map(d => d._id === id ? { ...d, status } : d));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="dashboard-header">
        <h2>Dispute Mediation</h2>
        <p>Review and resolve buyer/vendor disputes.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {disputes.length === 0 ? <p>No disputes to review.</p> : disputes.map(dispute => (
          <Card key={dispute._id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div>
                <h4 style={{ margin: '0 0 8px 0' }}>Order #{dispute.orderId?._id}</h4>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '14px', margin: 0 }}>
                  Buyer: {dispute.buyerId?.email} | Vendor: {dispute.vendorId?.storefront?.name}
                </p>
              </div>
              <div>
                <Badge variant={dispute.status === 'open' ? 'warning' : 'success'} className={dispute.status === 'open' ? 'pulse' : ''}>
                  {dispute.status.replace('_', ' ')}
                </Badge>
              </div>
            </div>
            
            <div style={{ background: '#F9F9F9', padding: '16px', borderRadius: '4px', marginBottom: '16px' }}>
              <strong>Reason:</strong> {dispute.reason}
              <br/>
              <strong>Evidence:</strong> {dispute.evidence || 'None provided'}
            </div>

            {dispute.status === 'open' && (
              <div style={{ display: 'flex', gap: '8px' }}>
                <Button variant="primary" size="sm" onClick={() => resolveDispute(dispute._id, 'resolved_refunded')}>Refund Buyer</Button>
                <Button variant="outline" size="sm" onClick={() => resolveDispute(dispute._id, 'resolved_dismissed')}>Dismiss</Button>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DisputeMediation;
