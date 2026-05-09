import React, { useState } from 'react';
import { ShoppingBag, Heart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from '../Card/Card';
import { useCart } from '../../store/useCart';
import { useToast } from '../../store/useToast';
import { useWishlist } from '../../store/useWishlist';
import { useAuth } from '../../store/useAuth';
import { formatINR } from '../../utils/currency';
import './ProductCard.css';

export const ProductCard = ({ product }) => {
  const addItem = useCart(state => state.addItem);
  const showToast = useToast(state => state.showToast);
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { token, isAuthenticated } = useAuth();
  const [isAdding, setIsAdding] = useState(false);
  const navigate = useNavigate();

  const handleQuickAdd = (e) => {
    e.stopPropagation();
    addItem(product);
    showToast(`${product.name} added to cart`);
    setIsAdding(true);
    setTimeout(() => setIsAdding(false), 1000);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    toggleWishlist(product._id, token);
  };

  const handleCardClick = () => {
    navigate(`/product/${product._id}`);
  };

  const wishlisted = isWishlisted(product._id);

  return (
    <Card className="product-card" hover onClick={handleCardClick}>
      <div className="product-image-container">
        {product?.images?.length > 0 ? (
          <img src={product.images[0]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div className="product-image-placeholder" style={{ backgroundColor: product?.vendorId?.storefront?.themeAccent || '#eee' }}>
            <span>{product?.name?.[0] || '?'}</span>
          </div>
        )}
        <button 
          className={`wishlist-heart ${wishlisted ? 'active' : ''}`} 
          onClick={handleWishlist}
        >
          <Heart size={18} fill={wishlisted ? 'currentColor' : 'none'} />
        </button>
      </div>
      <div className="product-info">
        <h4>{product.name}</h4>
        <p className="price">{formatINR(product.price)}</p>
      </div>
      <div className="product-action">
        <button 
          className="quick-add" 
          onClick={handleQuickAdd}
          disabled={isAdding}
        >
          <ShoppingBag size={16} /> Quick Add
        </button>
      </div>
    </Card>
  );
};
