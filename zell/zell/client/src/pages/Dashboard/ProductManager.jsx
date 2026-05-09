import React, { useState, useEffect } from 'react';
import { Card } from '../../components/Card/Card';
import { Button } from '../../components/Button/Button';
import { Badge } from '../../components/Badge/Badge';
import { formatINR } from '../../utils/currency';
import { useAuth } from '../../store/useAuth';
import { useToast } from '../../store/useToast';
import { Edit2, Trash2, Power, PowerOff } from 'lucide-react';
import { ProductModal } from './ProductModal';

const ProductManager = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const { token } = useAuth();
  const { showToast } = useToast();

  const fetchProducts = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/products/vendor/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setProducts(data);
      setLoading(false);
    } catch (err) {
      showToast('Failed to fetch products', 'error');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchProducts();
  }, [token]);

  const handleSaveProduct = async (formData) => {
    try {
      const url = editingProduct 
        ? `http://localhost:5000/api/products/${editingProduct._id}`
        : 'http://localhost:5000/api/products';
      
      const method = editingProduct ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        showToast(editingProduct ? 'Product updated' : 'Product created');
        setIsModalOpen(false);
        setEditingProduct(null);
        fetchProducts();
      } else {
        const error = await res.json();
        showToast(error.message || 'Save failed', 'error');
      }
    } catch (err) {
      showToast('Action failed', 'error');
    }
  };

  const handleToggleActive = async (id, currentStatus) => {
    try {
      const res = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ isActive: !currentStatus })
      });
      if (res.ok) {
        showToast(`Product ${!currentStatus ? 'activated' : 'deactivated'}`);
        fetchProducts();
      }
    } catch (err) {
      showToast('Action failed', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        showToast('Product removed');
        fetchProducts();
      }
    } catch (err) {
      showToast('Delete failed', 'error');
    }
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  return (
    <div className="product-manager">
      <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h2>Products</h2>
          <p>Manage your inventory and product listings.</p>
        </div>
        <Button onClick={openAddModal}>+ Add Product</Button>
      </div>

      <Card>
        {loading ? (
          <p style={{ padding: '40px', textAlign: 'center' }}>Loading your collection...</p>
        ) : products.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center' }}>
            <img src="/images/empty_products.png" alt="Empty Products" style={{ maxWidth: '300px', width: '100%', marginBottom: '24px', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }} />
            <h3 style={{ marginBottom: '8px' }}>Your Inventory is Empty</h3>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '24px' }}>You haven't added any products yet. Start building your catalog.</p>
            <Button variant="outline" onClick={openAddModal}>Create your first product</Button>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <th style={{ padding: '16px' }}>Name</th>
                  <th style={{ padding: '16px' }}>Price</th>
                  <th style={{ padding: '16px' }}>Inventory</th>
                  <th style={{ padding: '16px' }}>Status</th>
                  <th style={{ padding: '16px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p._id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {p.images?.length > 0 ? (
                          <img src={p.images[0]} alt={p.name} style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }} />
                        ) : (
                          <div style={{ width: '40px', height: '40px', borderRadius: '4px', backgroundColor: 'var(--color-surface-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 'bold', color: 'var(--color-text-muted)' }}>
                            {p.name[0]}
                          </div>
                        )}
                        <div>
                          <div style={{ fontWeight: 500 }}>{p.name}</div>
                          <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{p.category}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px', fontFamily: 'var(--font-mono)' }}>{formatINR(p.price)}</td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ color: p.inventory < 5 ? '#ff4d4f' : 'inherit' }}>
                        {p.inventory} left
                      </span>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <Badge variant={p.isActive ? 'success' : 'default'}>{p.isActive ? 'Active' : 'Draft'}</Badge>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button 
                          onClick={() => handleToggleActive(p._id, p.isActive)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}
                          title={p.isActive ? 'Deactivate' : 'Activate'}
                        >
                          {p.isActive ? <PowerOff size={18} /> : <Power size={18} />}
                        </button>
                        <button 
                          onClick={() => openEditModal(p)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(p._id)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ff4d4f' }}
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <ProductModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveProduct}
        product={editingProduct}
      />
    </div>
  );
};

export default ProductManager;
