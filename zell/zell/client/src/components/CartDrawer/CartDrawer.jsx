import React from 'react';
import { X, Trash2, Plus, Minus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../store/useCart';
import { Button } from '../Button/Button';
import { formatINR } from '../../utils/currency';
import './CartDrawer.css';

export const CartDrawer = ({ isOpen, onClose }) => {
  const { items, removeItem, increaseQty, decreaseQty, total } = useCart();
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <>
      <div className="cart-overlay" onClick={onClose} />
      <div className={`cart-drawer ${isOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <h2>Your Cart</h2>
          <button className="close-btn" onClick={onClose}><X size={24} /></button>
        </div>

        <div className="cart-items">
          {items.length === 0 ? (
            <p className="empty-cart">Your cart is empty.</p>
          ) : (
            items.map(item => (
              <div key={item.productId} className="cart-item">
                <div className="cart-item-info">
                  <h4>{item.title}</h4>
                  <div className="qty-controls">
                    <button 
                      className="qty-btn" 
                      onClick={() => decreaseQty(item.productId)}
                    >
                      {item.quantity === 1 ? <Trash2 size={14} /> : <Minus size={14} />}
                    </button>
                    <span className="qty-num">{item.quantity}</span>
                    <button 
                      className="qty-btn" 
                      onClick={() => increaseQty(item.productId)}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
                <div className="cart-item-actions">
                  <p className="price">{formatINR(item.priceAtPurchase * item.quantity)}</p>
                  <button className="remove-btn" onClick={() => removeItem(item.productId)}>
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total">
              <span>Total</span>
              <span>{formatINR(total())}</span>
            </div>
            <Button 
              className="checkout-btn" 
              onClick={() => { onClose(); navigate('/checkout'); }}
            >
              Checkout
            </Button>
          </div>
        )}
      </div>
    </>
  );
};
