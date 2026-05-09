import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ProductCard } from '../../components/ProductCard/ProductCard';
import { formatINR } from '../../utils/currency';
import { Search as SearchIcon, X, SlidersHorizontal, Grid, List } from 'lucide-react';
import './Search.css';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  
  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const minPrice = searchParams.get('minPrice') || 0;
  const maxPrice = searchParams.get('maxPrice') || 1000000;
  const sort = searchParams.get('sort') || 'newest';
  const inStock = searchParams.get('inStock') === 'true';

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:5000/api/products?${searchParams.toString()}`)
      .then(res => res.json())
      .then(data => {
        setProducts(data.products || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [searchParams]);

  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === null || value === '' || value === false) {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    setSearchParams(newParams);
  };

  const clearAll = () => setSearchParams({});

  return (
    <div className="search-page container fade-slide-enter-active">
      <div className="search-header-full">
        <div className="search-bar-container">
          <SearchIcon className="search-icon" size={20} />
          <input 
            type="text" 
            placeholder="Search for products, vendors, or categories..." 
            value={query}
            onChange={(e) => updateFilter('q', e.target.value)}
            autoFocus
          />
          {query && <X className="clear-search" size={20} onClick={() => updateFilter('q', '')} />}
        </div>

        <div className="active-filters">
          {category && (
            <span className="filter-pill">
              Category: {category} <X size={14} onClick={() => updateFilter('category', '')} />
            </span>
          )}
          {inStock && (
            <span className="filter-pill">
              In Stock <X size={14} onClick={() => updateFilter('inStock', false)} />
            </span>
          )}
          {sort !== 'newest' && (
            <span className="filter-pill">
              Sort: {sort} <X size={14} onClick={() => updateFilter('sort', 'newest')} />
            </span>
          )}
          {(category || inStock || sort !== 'newest') && (
            <button className="clear-all-link" onClick={clearAll}>Clear all</button>
          )}
        </div>
      </div>

      <div className="search-content">
        <aside className="search-sidebar">
          <div className="sidebar-group">
            <h3>Categories</h3>
            <div className="checkbox-list">
              {['home-living', 'ceramics', 'apparel', 'wellness', 'stationery', 'art'].map(cat => (
                <label key={cat} className="checkbox-item">
                  <input 
                    type="checkbox" 
                    checked={category === cat}
                    onChange={() => updateFilter('category', category === cat ? '' : cat)}
                  />
                  <span>{cat.replace('-', ' ')}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="sidebar-group">
            <h3>Sort By</h3>
            <select value={sort} onChange={(e) => updateFilter('sort', e.target.value)}>
              <option value="newest">Newest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>

          <div className="sidebar-group">
            <h3>Availability</h3>
            <label className="checkbox-item">
              <input 
                type="checkbox" 
                checked={inStock}
                onChange={(e) => updateFilter('inStock', e.target.checked)}
              />
              <span>In Stock Only</span>
            </label>
          </div>
        </aside>

        <main className="search-results">
          <div className="results-top-bar">
            <h2>{products.length} {products.length === 1 ? 'Result' : 'Results'} {query && `for "${query}"`}</h2>
            <div className="view-toggle">
              <button className={viewMode === 'grid' ? 'active' : ''} onClick={() => setViewMode('grid')}>
                <Grid size={18} />
              </button>
              <button className={viewMode === 'list' ? 'active' : ''} onClick={() => setViewMode('list')}>
                <List size={18} />
              </button>
            </div>
          </div>

          {loading ? (
            <div className={`results-container ${viewMode}`}>
              {[...Array(6)].map((_, i) => <div key={i} className="skeleton-card" />)}
            </div>
          ) : products.length === 0 ? (
            <div className="no-results-state">
              <p>No products found for your search.</p>
              <button onClick={clearAll}>Try clearing all filters</button>
            </div>
          ) : (
            <div className={`results-container ${viewMode}`}>
              {products.map(product => (
                <div key={product._id} className="search-item">
                  {viewMode === 'grid' ? (
                    <ProductCard product={product} />
                  ) : (
                    <div className="list-item-card">
                      <div className="item-img" style={{ backgroundColor: product.vendorId.storefront?.themeAccent }}>
                        {product.name[0]}
                      </div>
                      <div className="item-details">
                        <h3>{product.name}</h3>
                        <span className="vendor-name">{product.vendorId.storefront?.name}</span>
                        <span className="item-price">{formatINR(product.price)}</span>
                      </div>
                      <Link to={`/product/${product._id}`} className="view-link">View Details</Link>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Search;
