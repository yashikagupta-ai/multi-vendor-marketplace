import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ProductCard } from '../../components/ProductCard/ProductCard';
import { formatINR } from '../../utils/currency';
import './CategoryPage.css';

const CATEGORIES = {
  'home-living':  { label: 'Home & Living',  desc: 'Thoughtfully made objects for your space.', color: '#E8D5C4' },
  'ceramics':     { label: 'Ceramics',        desc: 'Hand-thrown and kiln-fired by independent makers.', color: '#C8DDD4' },
  'apparel':      { label: 'Apparel',         desc: 'Considered clothing that lasts.', color: '#D4CAEC' },
  'wellness':     { label: 'Wellness',        desc: 'Rituals for a slower, better day.', color: '#F0E6D3' },
  'stationery':   { label: 'Stationery',      desc: 'Tools for thinking and making.', color: '#D4CAEC' },
  'kitchen':      { label: 'Kitchen',         desc: 'Beautiful tools for daily cooking.', color: '#C8DDD4' },
  'jewellery':    { label: 'Jewellery',       desc: 'Wearable art from independent designers.', color: '#E8D5C4' },
  'art':          { label: 'Art & Prints',    desc: 'Original works and editions.', color: '#F7F4EF' },
};

const CategoryPage = () => {
  const { slug } = useParams();
  const category = CATEGORIES[slug] || { label: slug, desc: '', color: '#F7F4EF' };
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 1000000, // 10k INR in paise
    sort: 'newest',
    inStock: false
  });

  useEffect(() => {
    setLoading(true);
    const query = new URLSearchParams({
      category: slug,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      sort: filters.sort,
      inStock: filters.inStock
    }).toString();

    fetch(`http://localhost:5000/api/products?${query}`)
      .then(res => res.json())
      .then(data => {
        setProducts(data.products || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [slug, filters]);

  const clearFilters = () => {
    setFilters({
      minPrice: 0,
      maxPrice: 1000000,
      sort: 'newest',
      inStock: false
    });
  };

  return (
    <div className="category-page">
      <header className="category-hero" style={{ backgroundColor: category.color }}>
        <div className="container">
          <h1>{category.label}</h1>
          <p>{category.desc}</p>
        </div>
      </header>

      <div className="container category-content">
        <aside className="filters-sidebar">
          <div className="filter-group">
            <h3>Price Range</h3>
            <div className="price-inputs">
              <button 
                className={filters.maxPrice === 50000 ? 'active' : ''}
                onClick={() => setFilters({ ...filters, minPrice: 0, maxPrice: 50000 })}
              >
                Under ₹500
              </button>
              <button 
                className={filters.minPrice === 50000 && filters.maxPrice === 200000 ? 'active' : ''}
                onClick={() => setFilters({ ...filters, minPrice: 50000, maxPrice: 200000 })}
              >
                ₹500 - ₹2000
              </button>
              <button 
                className={filters.minPrice === 200000 && filters.maxPrice === 500000 ? 'active' : ''}
                onClick={() => setFilters({ ...filters, minPrice: 200000, maxPrice: 500000 })}
              >
                ₹2000 - ₹5000
              </button>
              <button 
                className={filters.minPrice === 500000 ? 'active' : ''}
                onClick={() => setFilters({ ...filters, minPrice: 500000, maxPrice: 10000000 })}
              >
                ₹5000+
              </button>
            </div>
          </div>

          <div className="filter-group">
            <h3>Sort By</h3>
            <select 
              value={filters.sort} 
              onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
              className="filter-select"
            >
              <option value="newest">Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>

          <div className="filter-group">
            <label className="checkbox-label">
              <input 
                type="checkbox" 
                checked={filters.inStock} 
                onChange={(e) => setFilters({ ...filters, inStock: e.target.checked })}
              />
              <span>In Stock Only</span>
            </label>
          </div>

          <button className="clear-filters" onClick={clearFilters}>Clear all filters</button>
        </aside>

        <main className="product-results">
          <div className="results-header">
            <span>Showing {products.length} products</span>
          </div>

          {loading ? (
            <div className="product-grid">
              {[...Array(6)].map((_, i) => <div key={i} className="skeleton-card" />)}
            </div>
          ) : products.length === 0 ? (
            <div className="no-results">
              <p>No products found in this category.</p>
            </div>
          ) : (
            <div className="product-grid">
              {products.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default CategoryPage;
