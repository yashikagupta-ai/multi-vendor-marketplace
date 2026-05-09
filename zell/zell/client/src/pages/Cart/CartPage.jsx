import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../store/useCart';
import { Button } from '../../components/Button/Button';
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from 'lucide-react';
import { formatINR } from '../../utils/currency';
import './CartPage.css';

const CartPage = () => {
  const { items, removeItem, increaseQty, decreaseQty, total } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="cart-page container empty-cart-view fade-slide-enter-active">
        <div className="empty-state">
          <div className="empty-icon"><ShoppingBag size={64} /></div>
          <h2>Your cart is empty.</h2>
          <p>Explore our curated collections and find something you love.</p>
          <Link to="/search" className="browse-btn">Start Shopping →</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page container fade-slide-enter-active">
      <header className="cart-header">
        <Link to="/" className="back-link"><ArrowLeft size={18} /> Back to Shopping</Link>
        <h1>Your Shopping Cart</h1>
        <p>You have {items.length} items in your bag.</p>
      </header>

      <div className="cart-layout">
        <div className="cart-items-list">
          {items.map(item => (
            <div key={item.productId} className="cart-item-card">
              <div className="item-img-placeholder" style={{ backgroundColor: 'var(--color-bg)' }}>
                {item.title[0]}
              </div>
              <div className="item-details">
                <div className="item-main-info">
                  <h3>{item.title}</h3>
                  <span className="item-price-unit">{formatINR(item.priceAtPurchase)}</span>
                </div>
                
                <div className="item-actions-row">
                  <div className="quantity-selector">
                    <button onClick={() => decreaseQty(item.productId)} disabled={item.quantity <= 1}>
                      <Minus size={16} />
                    </button>
                    <span>{item.quantity}</span>
                    <button onClick={() => increaseQty(item.productId)}>
                      <Plus size={16} />
                    </button>
                  </div>
                  
                  <button className="delete-btn" onClick={() => removeItem(item.productId)}>
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <div className="item-total-price">
                {formatINR(item.priceAtPurchase * item.quantity)}
              </div>
            </div>
          ))}
        </div>

        <aside className="cart-summary">
          <div className="summary-card">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>{formatINR(total())}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span className="free-shipping">FREE</span>
            </div>
            <hr />
            <div className="summary-row total">
              <span>Total</span>
              <span>{formatINR(total())}</span>
            </div>
            <Button className="checkout-btn" onClick={() => navigate('/checkout')}>
              Proceed to Checkout
            </Button>
            <p className="summary-note">Secure checkout powered by Stripe.</p>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CartPage;
