import React, { useState, useEffect } from 'react';
import { useAuth } from '../../store/useAuth';
import { Card } from '../../components/Card/Card';
import { Badge } from '../../components/Badge/Badge';
import { Button } from '../../components/Button/Button';

const VendorApproval = () => {
  const [vendors, setVendors] = useState([]);
  const { token } = useAuth();

  useEffect(() => {
    fetch('http://localhost:5000/api/admin/vendors', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setVendors(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, [token]);

  const updateTier = async (id, tier) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/vendors/${id}/tier`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ tier })
      });
      if (res.ok) {
        setVendors(vendors.map(v => v._id === id ? { ...v, tier } : v));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const approveVendor = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/vendors/${id}/approve`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        setVendors(vendors.map(v => v._id === id ? { ...v, isApproved: true } : v));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="dashboard-header">
        <h2>Vendor Management</h2>
        <p>Approve vendors and manage commission tiers.</p>
      </div>

      <Card>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
              <th style={{ padding: '12px' }}>Vendor Name</th>
              <th style={{ padding: '12px' }}>Email</th>
              <th style={{ padding: '12px' }}>Tier</th>
              <th style={{ padding: '12px' }}>Comm. Rate</th>
              <th style={{ padding: '12px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {vendors.map(vendor => (
              <tr key={vendor._id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ padding: '12px', fontWeight: 500 }}>{vendor.storefront?.name || 'Pending Setup'}</td>
                <td style={{ padding: '12px' }}>{vendor.userId?.email}</td>
                <td style={{ padding: '12px' }}>
                  <Badge variant={vendor.tier === 'elite' ? 'success' : vendor.tier === 'pro' ? 'warning' : 'default'}>
                    {vendor.tier}
                  </Badge>
                </td>
                <td style={{ padding: '12px', fontFamily: 'var(--font-mono)' }}>{vendor.commissionRate}%</td>
                <td style={{ padding: '12px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <select 
                    value={vendor.tier} 
                    onChange={(e) => updateTier(vendor._id, e.target.value)}
                    style={{ padding: '4px', borderRadius: '4px', border: '1px solid #ccc' }}
                  >
                    <option value="starter">Starter</option>
                    <option value="pro">Pro</option>
                    <option value="elite">Elite</option>
                  </select>
                  {!vendor.isApproved ? (
                    <Button variant="primary" size="sm" onClick={() => approveVendor(vendor._id)}>Approve</Button>
                  ) : (
                    <Badge variant="success">Approved</Badge>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

export default VendorApproval;
