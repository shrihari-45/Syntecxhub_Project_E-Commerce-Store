import React from 'react';
import { Star, ShoppingCart, Check, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product, onViewDetails }) {
  const { addToCart } = useCart();

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!isOutOfStock) {
      addToCart(product, 1);
    }
  };

  const handleCardClick = () => {
    if (onViewDetails) {
      onViewDetails(product);
    }
  };

  return (
    <div 
      className="product-card" 
      onClick={handleCardClick}
      id={`product-card-${product.id}`}
      style={{ cursor: 'pointer' }}
    >
      <div className="product-img-wrapper">
        <img
          src={product.image_url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80'}
          alt={product.name}
          className="product-img"
          loading="lazy"
        />
        {product.discount > 0 && (
          <span className="badge-discount">-{product.discount}% OFF</span>
        )}
        <span className="badge-category">{product.category}</span>
      </div>

      <div className="product-body">
        {/* Rating */}
        <div className="product-rating">
          <Star size={15} className="star-filled" />
          <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>
            {product.rating ? product.rating.toFixed(1) : '4.5'}
          </span>
          <span className="review-count">({product.num_reviews || 24})</span>
        </div>

        {/* Product Title */}
        <h3 className="product-title" title={product.name}>
          {product.name}
        </h3>

        {/* Stock status indicator */}
        <div className="stock-indicator">
          {isOutOfStock ? (
            <span className="stock-out">
              <AlertCircle size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
              Out of stock
            </span>
          ) : isLowStock ? (
            <span className="stock-low">
              <AlertCircle size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
              Only {product.stock} left in stock!
            </span>
          ) : (
            <span className="stock-in">
              <Check size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
              In Stock ({product.stock} available)
            </span>
          )}
        </div>

        {/* Pricing Row */}
        <div className="product-price-row">
          <span className="current-price">${Number(product.price).toFixed(2)}</span>
          {product.original_price && product.original_price > product.price && (
            <span className="original-price">${Number(product.original_price).toFixed(2)}</span>
          )}
        </div>

        {/* Add To Cart Button */}
        <button
          className="btn-add-cart"
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          style={{ marginTop: '0.85rem' }}
          id={`add-to-cart-btn-${product.id}`}
        >
          <ShoppingCart size={16} />
          <span>{isOutOfStock ? 'Sold Out' : 'Add to Cart'}</span>
        </button>
      </div>
    </div>
  );
}
