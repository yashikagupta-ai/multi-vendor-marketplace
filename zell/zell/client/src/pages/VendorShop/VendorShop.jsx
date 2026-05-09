import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ProductCard } from '../../components/ProductCard/ProductCard';
import './VendorShop.css';

const VendorShop = () => {
  const { slug } = useParams();
  const [vendor, setVendor] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/api/vendors/public/${slug}`)
      .then(res => res.json())
      .then(data => {
        setVendor(data);
        if (data._id) {
          fetch(`http://localhost:5000/api/products?vendorId=${data._id}`)
            .then(res => res.json())
            .then(prodsData => {
              if(prodsData.products) setProducts(prodsData.products);
            });
        }
      })
      .catch(console.error);
  }, [slug]);

  if (!vendor) return <div className="loading">Loading storefront...</div>;

  const accentColor = vendor.storefront.themeAccent || 'var(--color-accent-1)';

  return (
    <div className="vendor-shop fade-slide-enter-active">
      <div className="storefront-banner" style={{ backgroundColor: accentColor }}></div>
      <div className="storefront-container">
        <aside className="storefront-bio">
          <div className="logo-placeholder" style={{ backgroundColor: accentColor }} />
          <h1>{vendor.storefront.name}</h1>
          <p>{vendor.storefront.bio || 'Curating the best independent products.'}</p>
        </aside>
        
        <main className="storefront-products">
          <div className="products-grid">
            {products.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
            {products.length === 0 && (
              <div className="empty-state">No products available yet.</div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default VendorShop;
