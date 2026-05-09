import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../store/useCart';
import { useAuth } from '../../store/useAuth';
import { Button } from '../../components/Button/Button';
import { Card } from '../../components/Card/Card';
import { formatINR } from '../../utils/currency';
import { MapPin, CreditCard, ShieldCheck, Truck } from 'lucide-react';
import './Checkout.css';

const Checkout = () => {
  const { items, total, clearCart } = useCart();
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India'
  });

  const handleInputChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!token) {
      navigate('/login');
      return;
    }

    setIsProcessing(true);
    try {
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          lineItems: items,
          shippingAddress,
          stripePaymentIntentId: 'pi_mock_' + Math.random().toString(36).substr(2, 9)
        })
      });

      if (response.ok) {
        clearCart();
        navigate('/my-orders');
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Checkout failed');
      }
    } catch (err) {
      alert('Network error during checkout');
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <h2>Your bag is empty.</h2>
        <Button onClick={() => navigate('/')} style={{ marginTop: '24px' }}>Go Shopping</Button>
      </div>
    );
  }

  return (
    <div className="checkout-page container fade-slide-enter-active">
      <div className="checkout-grid">
        <div className="checkout-main">
          <section className="checkout-section">
            <div className="section-header">
              <MapPin size={20} />
              <h3>Shipping Address</h3>
            </div>
            <Card className="address-form-card">
              <form id="checkout-form" onSubmit={handleCheckout}>
                <div className="form-group full">
                  <label>Street Address</label>
                  <input 
                    type="text" 
                    name="street" 
                    required 
                    placeholder="123 Pastel St." 
                    value={shippingAddress.street}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>City</label>
                    <input 
                      type="text" 
                      name="city" 
                      required 
                      placeholder="Bengaluru" 
                      value={shippingAddress.city}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>State</label>
                    <input 
                      type="text" 
                      name="state" 
                      required 
                      placeholder="Karnataka" 
                      value={shippingAddress.state}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>ZIP Code</label>
                    <input 
                      type="text" 
                      name="zipCode" 
                      required 
                      placeholder="560001" 
                      value={shippingAddress.zipCode}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Country</label>
                    <input type="text" value="India" disabled />
                  </div>
                </div>
              </form>
            </Card>
          </section>

          <section className="checkout-section">
            <div className="section-header">
              <CreditCard size={20} />
              <h3>Payment</h3>
            </div>
            <Card className="payment-mock-card">
              <div className="mock-payment-info">
                <ShieldCheck size={32} color="var(--color-accent-1)" />
                <div>
                  <p>Secure Demo Payment Enabled</p>
                  <span>Your card will not be charged in this preview.</span>
                </div>
              </div>
            </Card>
          </section>
        </div>

        <aside className="checkout-sidebar">
          <Card className="order-summary-card">
            <h3>Order Summary</h3>
            <div className="summary-list">
              {items.map(item => (
                <div key={item.productId} className="summary-item">
                  <span>{item.title} x{item.quantity}</span>
                  <span>{formatINR(item.priceAtPurchase * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="delivery-info">
              <Truck size={16} />
              <span>Expected Delivery: <strong>5-7 Days</strong></span>
            </div>
            <div className="total-row">
              <span>Total</span>
              <span>{formatINR(total())}</span>
            </div>
            <Button 
              type="submit" 
              form="checkout-form"
              className="pay-btn" 
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : `Pay ${formatINR(total())}`}
            </Button>
          </Card>
        </aside>
      </div>
    </div>
  );
};

export default Checkout;
