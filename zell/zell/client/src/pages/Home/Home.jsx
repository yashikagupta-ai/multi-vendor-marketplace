import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../../components/Card/Card';
import { ProductCard } from '../../components/ProductCard/ProductCard';
import './Home.css';

const Home = () => {
  const [vendors, setVendors] = useState([]);
  const [trending, setTrending] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/vendors/public')
      .then(res => res.json())
      .then(data => {
        if(Array.isArray(data)) setVendors(data);
      })
      .catch(console.error);

    fetch('http://localhost:5000/api/products?sort=popular&limit=8')
      .then(res => res.json())
      .then(data => {
        if(data.products) setTrending(data.products);
      })
      .catch(console.error);
  }, []);

  const categories = [
    { name: 'Home & Living', slug: 'home-living', color: '#E8D5C4', icon: '🏠' },
    { name: 'Ceramics', slug: 'ceramics', color: '#C8DDD4', icon: '🍶' },
    { name: 'Apparel', slug: 'apparel', color: '#D4CAEC', icon: '👕' },
    { name: 'Wellness', slug: 'wellness', color: '#F0E6D3', icon: '🌿' },
    { name: 'Stationery', slug: 'stationery', color: '#D4CAEC', icon: '📝' },
    { name: 'Art & Prints', slug: 'art', color: '#F7F4EF', icon: '🎨' },
  ];

  return (
    <div className="home-page fade-slide-enter-active">
      <header className="hero">
        <h1>Curated independent boutiques.</h1>
        <p>Discover unique products from hand-picked creators.</p>
        <div className="hero-actions">
          <Link to="/search" className="hero-btn">Shop Collection</Link>
        </div>
      </header>

      <section className="category-grid-section">
        <div className="container">
          <div className="category-strip">
            {categories.map(cat => (
              <Link key={cat.slug} to={`/category/${cat.slug}`} className="category-card" style={{ backgroundColor: cat.color }}>
                <span className="cat-icon">{cat.icon}</span>
                <h3>{cat.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="trending-section">
        <div className="container">
          <div className="section-header">
            <h2>Trending Now</h2>
            <Link to="/search?sort=popular">See all →</Link>
          </div>
          <div className="trending-scroll">
            {trending.map(product => (
              <ProductCard key={product?._id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="editorial-section">
        <div className="container">
          <div className="editorial-text">
            <h2>The Featured Edit</h2>
            <p>Meet the creators defining modern, mindful commerce.</p>
          </div>
          <div className="vendor-strip">
            {vendors.map(vendor => (
              <Link key={vendor?._id} to={`/shop/${vendor?.storefront?.slug}`} className="vendor-strip-card">
                <Card hover className="vendor-card" style={{ borderTop: `4px solid ${vendor?.storefront?.themeAccent || 'var(--color-accent-1)'}` }}>
                  <h3>{vendor?.storefront?.name}</h3>
                  <p className="bio">{vendor?.storefront?.bio || 'Independent Creator'}</p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
