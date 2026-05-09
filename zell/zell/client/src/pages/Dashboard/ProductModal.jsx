import React, { useState, useEffect } from 'react';
import { Button } from '../../components/Button/Button';
import { Card } from '../../components/Card/Card';
import { X } from 'lucide-react';
import './ProductModal.css';

export const ProductModal = ({ isOpen, onClose, onSave, product = null }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'home-living',
    inventory: '',
    isActive: true,
    tags: '',
    specifications: [{ name: '', value: '' }],
    images: ''
  });

  useEffect(() => {
    if (product) {
      setFormData({
        ...product,
        price: product.price / 100, // Convert paise to INR for editing
        tags: product.tags?.join(', ') || '',
        specifications: product.specifications?.length > 0 ? product.specifications : [{ name: '', value: '' }],
        images: product.images?.join(', ') || ''
      });
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        category: 'home-living',
        inventory: '',
        isActive: true,
        tags: '',
        specifications: [{ name: '', value: '' }],
        images: ''
      });
    }
  }, [product, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const processed = {
      ...formData,
      price: Math.round(parseFloat(formData.price) * 100), // Convert to paise
      inventory: parseInt(formData.inventory),
      tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
      specifications: formData.specifications.filter(s => s.name && s.value),
      images: formData.images.split(',').map(i => i.trim()).filter(i => i)
    };
    onSave(processed);
  };

  const handleSpecChange = (index, field, value) => {
    const newSpecs = [...formData.specifications];
    newSpecs[index][field] = value;
    setFormData({ ...formData, specifications: newSpecs });
  };

  const addSpec = () => {
    setFormData({ 
      ...formData, 
      specifications: [...formData.specifications, { name: '', value: '' }] 
    });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <Card className="modal-content">
        <div className="modal-header">
          <h3>{product ? 'Edit Product' : 'Add New Product'}</h3>
          <button onClick={onClose}><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-row">
            <div className="form-group">
              <label>Product Name</label>
              <input 
                type="text" required 
                value={formData.name} 
                onChange={e => setFormData({ ...formData, name: e.target.value })} 
              />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select 
                value={formData.category} 
                onChange={e => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="home-living">Home & Living</option>
                <option value="ceramics">Ceramics</option>
                <option value="apparel">Apparel</option>
                <option value="wellness">Wellness</option>
                <option value="stationery">Stationery</option>
                <option value="kitchen">Kitchen</option>
                <option value="jewellery">Jewellery</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea 
              required rows="3"
              value={formData.description} 
              onChange={e => setFormData({ ...formData, description: e.target.value })} 
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Price (₹)</label>
              <input 
                type="number" step="0.01" required 
                value={formData.price} 
                onChange={e => setFormData({ ...formData, price: e.target.value })} 
              />
            </div>
            <div className="form-group">
              <label>Stock Quantity</label>
              <input 
                type="number" required 
                value={formData.inventory} 
                onChange={e => setFormData({ ...formData, inventory: e.target.value })} 
              />
            </div>
          </div>

          <div className="form-group">
            <label>Tags (comma separated)</label>
            <input 
              type="text" placeholder="handcrafted, minimal, sustainable"
              value={formData.tags} 
              onChange={e => setFormData({ ...formData, tags: e.target.value })} 
            />
          </div>

          <div className="form-group">
            <label>Image URLs (comma separated)</label>
            <input 
              type="text" placeholder="https://image1.jpg, https://image2.jpg"
              value={formData.images} 
              onChange={e => setFormData({ ...formData, images: e.target.value })} 
            />
          </div>

          <div className="form-group">
            <label>Specifications</label>
            {formData.specifications.map((spec, index) => (
              <div key={index} className="spec-row">
                <input 
                  placeholder="e.g. Material" 
                  value={spec.name} 
                  onChange={e => handleSpecChange(index, 'name', e.target.value)}
                />
                <input 
                  placeholder="e.g. Oak Wood" 
                  value={spec.value} 
                  onChange={e => handleSpecChange(index, 'value', e.target.value)}
                />
              </div>
            ))}
            <button type="button" className="add-spec" onClick={addSpec}>+ Add Specification</button>
          </div>

          <div className="modal-actions">
            <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
            <Button type="submit">Save Product</Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
