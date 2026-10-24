import React, { useState, useEffect } from 'react';
import { X, Save, Package } from 'lucide-react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';

export default function AdminProductModal({ isOpen, onClose, productToEdit, onSaved }) {
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    category: 'Electronics',
    price: '',
    original_price: '',
    stock: '',
    image_url: '',
    description: '',
    is_featured: false
  });

  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (productToEdit) {
      setFormData({
        name: productToEdit.name || '',
        category: productToEdit.category || 'Electronics',
        price: productToEdit.price !== undefined ? productToEdit.price : '',
        original_price: productToEdit.original_price !== undefined ? productToEdit.original_price : '',
        stock: productToEdit.stock !== undefined ? productToEdit.stock : '',
        image_url: productToEdit.image_url || '',
        description: productToEdit.description || '',
        is_featured: !!productToEdit.is_featured
      });
    } else {
      setFormData({
        name: '',
        category: 'Electronics',
        price: '',
        original_price: '',
        stock: '20',
        image_url: '',
        description: '',
        is_featured: false
      });
    }
    setErrors({});
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSubmitting(true);

    try {
      const payload = {
        name: formData.name,
        category: formData.category,
        price: parseFloat(formData.price),
        original_price: formData.original_price ? parseFloat(formData.original_price) : parseFloat(formData.price),
        stock: parseInt(formData.stock, 10),
        image_url: formData.image_url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
        description: formData.description,
        is_featured: formData.is_featured
      };

      if (productToEdit) {
        // Edit existing product
        const id = productToEdit.id || productToEdit._id;
        await api.put(`/products/${id}`, payload);
        showToast(`Product "${payload.name}" updated successfully!`, 'success');
      } else {
        // Create new product
        await api.post('/products', payload);
        showToast(`Product "${payload.name}" created successfully!`, 'success');
      }

      if (onSaved) onSaved();
      onClose();
    } catch (err) {
      const errData = err.data?.errors || {};
      setErrors(errData);
      showToast(err.message || 'Failed to save product', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: 650 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              width: 38,
              height: 38,
              borderRadius: 'var(--radius-md)',
              background: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Package size={20} />
            </div>
            <h3 className="modal-title">
              {productToEdit ? 'Edit Product' : 'Add New Product'}
            </h3>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Product Name *</label>
            <input
              type="text"
              name="name"
              required
              className={`form-input ${errors.name ? 'error' : ''}`}
              placeholder="e.g. Wireless Noise-Cancelling Headphones"
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && <span className="form-error-msg">{errors.name}</span>}
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Category *</label>
              <select
                name="category"
                className="form-input"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="Electronics">Electronics</option>
                <option value="Fashion">Fashion</option>
                <option value="Home & Kitchen">Home & Kitchen</option>
                <option value="Beauty & Wellness">Beauty & Wellness</option>
                <option value="Audio & Wearables">Audio & Wearables</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Stock Quantity *</label>
              <input
                type="number"
                name="stock"
                min="0"
                required
                className={`form-input ${errors.stock ? 'error' : ''}`}
                placeholder="e.g. 25"
                value={formData.stock}
                onChange={handleChange}
              />
              {errors.stock && <span className="form-error-msg">{errors.stock}</span>}
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Price ($) *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                name="price"
                required
                className={`form-input ${errors.price ? 'error' : ''}`}
                placeholder="e.g. 99.99"
                value={formData.price}
                onChange={handleChange}
              />
              {errors.price && <span className="form-error-msg">{errors.price}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Original Price ($) (Optional)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                name="original_price"
                className="form-input"
                placeholder="e.g. 129.99"
                value={formData.original_price}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Image URL</label>
            <input
              type="url"
              name="image_url"
              className="form-input"
              placeholder="https://images.unsplash.com/..."
              value={formData.image_url}
              onChange={handleChange}
            />
            <span style={{ fontSize: '0.78rem', color: 'var(--text-light)', marginTop: 2 }}>
              Paste any reliable image URL or leave blank for a default placeholder.
            </span>
          </div>

          <div className="form-group">
            <label className="form-label">Detailed Description</label>
            <textarea
              name="description"
              rows={3}
              className="form-input"
              placeholder="Describe key features, specifications, and benefits..."
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer', fontSize: '0.9rem' }}>
              <input
                type="checkbox"
                name="is_featured"
                checked={formData.is_featured}
                onChange={handleChange}
                style={{ width: 18, height: 18, accentColor: 'var(--primary)' }}
              />
              <span style={{ fontWeight: 600 }}>Feature this product on homepage showcases</span>
            </label>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <button
              type="button"
              className="btn-secondary"
              style={{ color: 'var(--text-main)', border: '1px solid var(--border-color)', background: 'var(--bg-subtle)' }}
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-checkout"
              style={{ width: 'auto', padding: '0.75rem 1.75rem' }}
              disabled={submitting}
            >
              <Save size={18} />
              <span>{submitting ? 'Saving...' : productToEdit ? 'Save Changes' : 'Create Product'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
