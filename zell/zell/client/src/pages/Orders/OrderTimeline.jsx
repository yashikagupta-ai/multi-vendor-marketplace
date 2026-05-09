import React, { useState, useEffect } from 'react';
import { useAuth } from '../../store/useAuth';
import { Card } from '../../components/Card/Card';
import { Badge } from '../../components/Badge/Badge';
import { Button } from '../../components/Button/Button';
import { formatINR } from '../../utils/currency';

const OrderTimeline = () => {
  const [orders, setOrders] = useState([]);
  const { token } = useAuth();
  
  useEffect(() => {
    fetch('http://localhost:5000/api/orders/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if(Array.isArray(data)) setOrders(data);
      })
      .catch(console.error);
  }, [token]);

  const raiseDispute = async (orderId) => {
    const reason = prompt('Please enter the reason for your dispute:');
    if (!reason) return;

    try {
      const res = await fetch('http://localhost:5000/api/disputes', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ orderId, reason, evidence: 'User reported issue via portal' })
      });
      if (res.ok) {
        alert('Dispute raised successfully. Our team will review it shortly.');
        window.location.reload();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px' }} className="fade-slide-enter-active">
      <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>Your Orders</h1>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: '32px' }}>Track your purchases and manage issues.</p>

      {orders.length === 0 ? (
        <Card><p style={{ color: 'var(--color-text-muted)', textAlign: 'center' }}>You haven't placed any orders yet.</p></Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {orders.map(order => (
            <Card key={order._id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingBottom: '16px', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ margin: '0 0 4px 0', fontFamily: 'var(--font-mono)' }}>Order #{order._id}</h3>
                  <span style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>Placed on {new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '18px', fontWeight: '500', marginBottom: '4px' }}>{formatINR(order.totalAmount)}</div>
                  <Badge variant={order.status === 'completed' ? 'success' : 'default'}>{order.status.replace('_', ' ')}</Badge>
                  {order.expectedDelivery && (
                    <div style={{ fontSize: '12px', color: 'var(--color-accent-1)', marginTop: '8px' }}>
                      Expected: {new Date(order.expectedDelivery).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>

              {order.shippingAddress && (
                <div style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '16px', background: 'var(--color-bg)', padding: '12px', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
                  <strong>Shipping to:</strong> {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                </div>
              )}

              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ marginBottom: '8px' }}>Items:</h4>
                <ul style={{ paddingLeft: '20px', color: 'var(--color-text-muted)' }}>
                  {order.lineItems.map((item, idx) => (
                    <li key={idx}>{item.title} (x{item.quantity}) - {formatINR(item.priceAtPurchase * item.quantity)}</li>
                  ))}
                </ul>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant="outline" size="sm" onClick={() => raiseDispute(order._id)}>
                  Problem with order? (Raise Dispute)
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderTimeline;
