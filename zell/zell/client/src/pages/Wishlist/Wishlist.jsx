import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../../store/useWishlist';
import { useAuth } from '../../store/useAuth';
import { ProductCard } from '../../components/ProductCard/ProductCard';
import './Wishlist.css';

const Wishlist = () => {
  const { productIds, fetchWishlist } = useWishlist();
  const { token, isAuthenticated } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated && token) {
      setLoading(true);
      fetch('http://localhost:5000/api/wishlist', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        // Handle case where backend returns null or empty
        setProducts(data?.productIds || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Wishlist Fetch Error:', err);
        setLoading(false);
      });
    }
  }, [isAuthenticated, token]);

  if (!isAuthenticated) {
    return (
      <div className="wishlist-page container">
        <div className="empty-state">
          <h2>Your wishlist is private.</h2>
          <p>Please <Link to="/login">login</Link> to view your saved items.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-page container fade-slide-enter-active">
      <header className="wishlist-header">
        <h1>My Wishlist</h1>
        <span>{products.length} items</span>
      </header>

      {loading ? (
        <div className="product-grid">
          {[...Array(4)].map((_, i) => <div key={i} className="skeleton-card" />)}
        </div>
      ) : products.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">♡</div>
          <h2>Your wishlist is empty.</h2>
          <p>Start exploring and save your favorite pieces.</p>
          <Link to="/search" className="browse-btn">Start Exploring →</Link>
        </div>
      ) : (
        <div className="product-grid">
          {products.map(product => (
            <div key={product._id} className="wishlist-item-container">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
