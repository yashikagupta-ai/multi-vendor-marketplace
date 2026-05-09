import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingBag, Heart, ChevronLeft, ChevronRight, Truck, RotateCcw, Star } from 'lucide-react';
import { useCart } from '../../store/useCart';
import { useToast } from '../../store/useToast';
import { useWishlist } from '../../store/useWishlist';
import { useAuth } from '../../store/useAuth';
import { formatINR } from '../../utils/currency';
import { RatingStars } from '../../components/RatingStars/RatingStars';
import { ProductCard } from '../../components/ProductCard/ProductCard';
import { Button } from '../../components/Button/Button';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [showStickyBar, setShowStickyBar] = useState(false);
  
  // Review Form State
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', body: '' });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  
  const atcRef = useRef(null);
  const { addItem } = useCart();
  const { showToast } = useToast();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { token, isAuthenticated, user } = useAuth();

  const fetchProductData = () => {
    Promise.all([
      fetch(`http://localhost:5000/api/products/${id}`).then(res => res.json()),
      fetch(`http://localhost:5000/api/reviews/${id}`).then(res => res.json())
    ]).then(([productData, reviewsData]) => {
      setData(productData);
      setReviews(Array.isArray(reviewsData) ? reviewsData : []);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  };

  useEffect(() => {
    setLoading(true);
    window.scrollTo(0, 0);
    fetchProductData();
  }, [id]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowStickyBar(!entry.isIntersecting && entry.boundingClientRect.top < 0);
      },
      { threshold: 0 }
    );

    if (atcRef.current) {
      observer.observe(atcRef.current);
    }

    return () => observer.disconnect();
  }, [data]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!token) return;
    
    setIsSubmittingReview(true);
    try {
      const res = await fetch('http://localhost:5000/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          productId: id,
          rating: reviewForm.rating,
          title: reviewForm.title,
          body: reviewForm.body
        })
      });

      if (res.ok) {
        showToast('Review submitted successfully!');
        setReviewForm({ rating: 5, title: '', body: '' });
        fetchProductData(); // Refresh reviews
      } else {
        const error = await res.json();
        alert(error.message || 'Failed to submit review');
      }
    } catch (err) {
      alert('Network error');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (loading) return <div className="product-detail-loading container">Loading product...</div>;
  if (!data || !data.product) return <div className="product-detail-error container">Product not found.</div>;

  const { product, related } = data;
  const images = product.images.length > 0 ? product.images : [null, null, null, null];
  
  const handleAddToCart = () => {
    addItem({ ...product, quantity });
    showToast(`${product.name} added to cart`);
  };

  const avgRating = reviews.length > 0 
    ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length 
    : 0;

  const initials = product.name.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <div className="product-detail-page">
      <div className="container product-main">
        <div className="product-gallery">
          <div className="main-image">
            {images[activeImage] ? (
              <img src={images[activeImage]} alt={product.name} />
            ) : (
              <div 
                className="image-placeholder" 
                style={{ backgroundColor: product.vendorId.storefront?.themeAccent || '#eee' }}
              >
                <span>{initials}</span>
              </div>
            )}
            <div className="image-counter">
              {activeImage + 1} of {images.length}
            </div>
          </div>
          <div className="thumbnails">
            {images.map((img, idx) => (
              <div 
                key={idx} 
                className={`thumbnail ${activeImage === idx ? 'active' : ''}`}
                onClick={() => setActiveImage(idx)}
                style={{ backgroundColor: !img ? (product.vendorId.storefront?.themeAccent || '#eee') : 'transparent' }}
              >
                {!img && <span>{initials}</span>}
                {img && <img src={img} alt="" />}
              </div>
            ))}
          </div>
        </div>

        <div className="product-info">
          <div className="vendor-link">
            <span className="accent-dot" style={{ backgroundColor: product.vendorId.storefront?.themeAccent }}></span>
            <Link to={`/shop/${product.vendorId.storefront?.slug}`}>{product.vendorId.storefront?.name}</Link>
          </div>
          
          <h1 className="product-title">{product.name}</h1>
          
          <div className="rating-summary">
            <RatingStars rating={avgRating} size="sm" />
            <span className="review-count">({reviews.length} reviews)</span>
          </div>

          <div className="price-section">
            <span className="current-price">{formatINR(product.price)}</span>
            {product.price > 500000 && (
              <span className="mrp-price">{formatINR(product.price * 1.2)}</span>
            )}
          </div>

          <div className="tags-pills">
            {product.tags.map(tag => (
              <Link key={tag} to={`/search?tag=${tag}`} className="tag-pill">#{tag}</Link>
            ))}
          </div>

          <div className="purchase-controls" ref={atcRef}>
            <div className="qty-selector">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity(Math.min(product.inventory || 10, quantity + 1))}>+</button>
            </div>
            
            <div className="action-buttons">
              <Button className="atc-btn" onClick={handleAddToCart}>
                <ShoppingBag size={20} /> Add to Cart
              </Button>
              <button 
                className={`wishlist-btn ${isWishlisted(product._id) ? 'active' : ''}`}
                onClick={() => toggleWishlist(product._id, token)}
              >
                <Heart size={20} fill={isWishlisted(product._id) ? 'currentColor' : 'none'} />
              </button>
            </div>
          </div>

          <div className="trust-badges">
            <div className="badge">
              <Truck size={18} />
              <span>Free delivery on orders above ₹999</span>
            </div>
            <div className="badge">
              <RotateCcw size={18} />
              <span>7-day easy returns</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container product-tabs">
        <div className="tabs-header">
          <button className={activeTab === 'description' ? 'active' : ''} onClick={() => setActiveTab('description')}>Description</button>
          <button className={activeTab === 'specifications' ? 'active' : ''} onClick={() => setActiveTab('specifications')}>Specifications</button>
          <button className={activeTab === 'reviews' ? 'active' : ''} onClick={() => setActiveTab('reviews')}>Reviews</button>
        </div>
        
        <div className="tab-content">
          {activeTab === 'description' && (
            <div className="description-tab">
              <p>{product.description}</p>
            </div>
          )}
          
          {activeTab === 'specifications' && (
            <div className="specs-tab">
              <table className="specs-table">
                <tbody>
                  {(product.specifications?.length > 0 ? product.specifications : [
                    { key: 'Material', value: 'Mixed' },
                    { key: 'Origin', value: 'Handmade' }
                  ]).map((spec, i) => (
                    <tr key={i}>
                      <td className="spec-key">{spec.key}</td>
                      <td className="spec-val">{spec.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {activeTab === 'reviews' && (
            <div className="reviews-tab">
              <div className="reviews-header">
                <div className="avg-big">
                  <span className="num">{avgRating.toFixed(1)}</span>
                  <RatingStars rating={avgRating} />
                  <span className="count">{reviews.length} total reviews</span>
                </div>
              </div>

              {isAuthenticated ? (
                <div className="write-review-card">
                  <h3>Share your experience</h3>
                  <form onSubmit={handleReviewSubmit} className="review-form">
                    <div className="star-picker">
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star 
                          key={star} 
                          size={24} 
                          fill={star <= reviewForm.rating ? 'var(--color-accent-1)' : 'none'}
                          color={star <= reviewForm.rating ? 'var(--color-accent-1)' : '#ccc'}
                          onClick={() => setReviewForm({...reviewForm, rating: star})}
                          style={{ cursor: 'pointer' }}
                        />
                      ))}
                    </div>
                    <input 
                      type="text" 
                      placeholder="Review Title" 
                      required 
                      value={reviewForm.title}
                      onChange={(e) => setReviewForm({...reviewForm, title: e.target.value})}
                    />
                    <textarea 
                      placeholder="Write your review here..." 
                      required 
                      value={reviewForm.body}
                      onChange={(e) => setReviewForm({...reviewForm, body: e.target.value})}
                    ></textarea>
                    <Button type="submit" disabled={isSubmittingReview}>
                      {isSubmittingReview ? 'Submitting...' : 'Post Review'}
                    </Button>
                  </form>
                </div>
              ) : (
                <p className="login-prompt">Please <Link to="/login">login</Link> to write a review.</p>
              )}

              <div className="reviews-list">
                {reviews.length === 0 ? (
                  <p className="no-reviews">No reviews yet. Be the first to review!</p>
                ) : (
                  reviews.map(review => (
                    <div key={review._id} className="review-card">
                      <div className="review-header">
                        <RatingStars rating={review.rating} size="sm" />
                        <span className="reviewer">{review.userId?.name || 'Customer'}</span>
                        <span className="date">{new Date(review.createdAt).toLocaleDateString()}</span>
                      </div>
                      <h4 className="review-title">{review.title}</h4>
                      <p className="review-body">{review.body}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
