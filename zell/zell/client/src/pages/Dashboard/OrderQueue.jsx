import React, { useState, useEffect } from 'react';
import { Card } from '../../components/Card/Card';
import { Badge } from '../../components/Badge/Badge';
import { Button } from '../../components/Button/Button';
import { useAuth } from '../../store/useAuth';
import { formatINR } from '../../utils/currency';
import { Bell } from 'lucide-react';

const OrderQueue = () => {
  const [orders, setOrders] = useState([]);
  const { token, user } = useAuth();

  const fetchOrders = () => {
    fetch('http://localhost:5000/api/orders/vendor/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if(Array.isArray(data)) setOrders(data);
      })
      .catch(console.error);
  };

  useEffect(() => {
    fetchOrders();
  }, [token]);

  const handleFulfill = async (orderId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/orders/${orderId}/fulfill`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchOrders();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="order-queue">
      <div className="dashboard-header" style={{ marginBottom: '32px' }}>
        <h2>Order Queue</h2>
        <p>Manage incoming orders and fulfill shipments.</p>
      </div>

      <Card>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
              <th style={{ padding: '12px' }}>Order ID</th>
              <th style={{ padding: '12px' }}>Date</th>
              <th style={{ padding: '12px' }}>Amount</th>
              <th style={{ padding: '12px' }}>Status</th>
              <th style={{ padding: '12px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ padding: '40px 20px', textAlign: 'center' }}>
                  <img src="/images/empty_orders.png" alt="No Orders" style={{ maxWidth: '250px', width: '100%', marginBottom: '16px', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }} />
                  <h4 style={{ marginBottom: '8px' }}>No Orders Yet</h4>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>Incoming orders will appear here once customers make a purchase.</p>
                </td>
              </tr>
            ) : (
              orders.map(order => {
                const vendorIdToCheck = user.vendorData?._id || user._id;
                const split = order.vendorSplit.find(vs => vs.vendorId._id === vendorIdToCheck || vs.vendorId === vendorIdToCheck);
                const isNew = split?.isNew !== false; // Default to true if not found or true

                return (
                  <tr key={order._id} style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: isNew ? 'rgba(200, 221, 212, 0.1)' : 'transparent' }}>
                    <td style={{ padding: '12px', fontFamily: 'var(--font-mono)', fontSize: '14px' }}>
                      {order._id}
                      {isNew && <Badge variant="primary" style={{ marginLeft: '8px', fontSize: '10px' }}>NEW</Badge>}
                    </td>
                    <td style={{ padding: '12px' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td style={{ padding: '12px', fontFamily: 'var(--font-mono)' }}>{formatINR(split?.subtotal)}</td>
                    <td style={{ padding: '12px' }}>
                      <Badge variant={split?.status === 'fulfilled' ? 'success' : 'warning'}>{split?.status}</Badge>
                    </td>
                    <td style={{ padding: '12px' }}>
                      {split?.status !== 'fulfilled' && (
                        <Button variant="primary" size="sm" onClick={() => handleFulfill(order._id)}>Mark Fulfilled</Button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

export default OrderQueue;
