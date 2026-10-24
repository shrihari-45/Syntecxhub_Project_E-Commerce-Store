import React from 'react';
import { Filter, RotateCcw, Star, Check } from 'lucide-react';

export default function ProductFilter({
  categories = [],
  selectedCategory,
  onSelectCategory,
  minPrice,
  maxPrice,
  onPriceChange,
  selectedRating,
  onSelectRating,
  inStockOnly,
  onToggleInStock,
  onReset
}) {
  return (
    <aside className="filter-sidebar">
      <div className="filter-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={18} style={{ color: 'var(--primary)' }} />
          <h3 className="filter-title">Filters</h3>
        </div>
        <button className="filter-clear-btn" onClick={onReset} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <RotateCcw size={13} />
          <span>Reset</span>
        </button>
      </div>

      {/* Categories */}
      <div className="filter-group">
        <h4 className="filter-group-title">Categories</h4>
        <ul className="filter-list">
          <li>
            <button
              className={`filter-item-btn ${!selectedCategory || selectedCategory === 'all' ? 'active' : ''}`}
              onClick={() => onSelectCategory('all')}
            >
              <span>All Categories</span>
            </button>
          </li>
          {categories.map((cat) => (
            <li key={cat.name}>
              <button
                className={`filter-item-btn ${selectedCategory === cat.name ? 'active' : ''}`}
                onClick={() => onSelectCategory(cat.name)}
              >
                <span>{cat.name}</span>
                {cat.count !== undefined && (
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-light)' }}>({cat.count})</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Price Range */}
      <div className="filter-group">
        <h4 className="filter-group-title">Price Range ($)</h4>
        <div className="price-inputs">
          <input
            type="number"
            className="price-input-field"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => onPriceChange('min', e.target.value)}
          />
          <span style={{ color: 'var(--text-muted)' }}>–</span>
          <input
            type="number"
            className="price-input-field"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => onPriceChange('max', e.target.value)}
          />
        </div>
      </div>

      {/* Minimum Rating */}
      <div className="filter-group">
        <h4 className="filter-group-title">Customer Rating</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
          {[4, 3, 2].map((stars) => (
            <button
              key={stars}
              className={`filter-item-btn ${selectedRating === stars ? 'active' : ''}`}
              onClick={() => onSelectRating(selectedRating === stars ? null : stars)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Star size={15} className="star-filled" />
                <span>{stars} Stars & Above</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div className="filter-group" style={{ marginBottom: 0 }}>
        <h4 className="filter-group-title">Availability</h4>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer', fontSize: '0.9rem' }}>
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => onToggleInStock(e.target.checked)}
            style={{ width: 16, height: 16, accentColor: 'var(--primary)' }}
          />
          <span>In Stock Items Only</span>
        </label>
      </div>
    </aside>
  );
}
