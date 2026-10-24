import React, { useState, useEffect } from 'react';
import { 
  Star, 
  ShoppingCart, 
  Zap, 
  Check, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Plus, 
  Minus, 
  ArrowLeft,
  AlertCircle
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import api from '../services/api';

export default function ProductDetailPage({ 
  product, 
  onBackToShop, 
  onNavigateToCheckout,
  onViewProductDetails 
}) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('specs');
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setQuantity(1);

    // Fetch related products in the same category
    if (product?.category) {
      api.get('/products', { category: product.category, limit: 4 })
        .then((res) => {
          if (res.success && res.data?.products) {
            setRelatedProducts(res.data.products.filter(p => p.id !== product.id).slice(0, 3));
          }
        })
        .catch(() => {});
    }
  }, [product]);

  if (!product) {
    return (
      <div className="container" style={{ margin: '4rem auto', textAlign: 'center' }}>
        <h2>Product not found</h2>
        <button className="btn-primary" onClick={onBackToShop} style={{ marginTop: '1.5rem', background: 'var(--primary)', color: 'white' }}>
          Back to Catalog
        </button>
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  const handleAddToCart = () => {
    if (!isOutOfStock) {
      addToCart(product, quantity);
    }
  };

  const handleBuyNow = () => {
    if (!isOutOfStock) {
      addToCart(product, quantity);
      if (onNavigateToCheckout) {
        onNavigateToCheckout();
      }
    }
  };

  return (
    <div className="container product-detail-container">
      {/* Back Button & Breadcrumbs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
        <button
          onClick={onBackToShop}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            color: 'var(--primary)',
            fontWeight: 700,
            fontSize: '0.9rem'
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Catalog</span>
        </button>
        <span style={{ color: 'var(--text-light)' }}>/</span>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{product.category}</span>
        <span style={{ color: 'var(--text-light)' }}>/</span>
        <span style={{ color: 'var(--text-main)', fontSize: '0.9rem', fontWeight: 600 }}>{product.name}</span>
      </div>

      {/* Main Detail Grid */}
      <div className="detail-grid">
        {/* Left Column: Image */}
        <div className="detail-gallery">
          <img
            src={product.image_url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80'}
            alt={product.name}
            className="detail-main-img"
          />
          {product.discount > 0 && (
            <span className="badge-discount" style={{ top: 20, left: 20, fontSize: '0.85rem', padding: '0.35rem 0.85rem' }}>
              -{product.discount}% OFF
            </span>
          )}
        </div>

        {/* Right Column: Info & Actions */}
        <div>
          <span className="detail-category-badge">{product.category}</span>
          <h1 className="detail-title">{product.name}</h1>

          {/* Rating */}
          <div className="detail-rating-row">
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  size={18}
                  className="star-filled"
                  style={{ fill: s <= Math.round(product.rating || 4.5) ? '#fbbf24' : '#e2e8f0', color: '#fbbf24' }}
                />
              ))}
            </div>
            <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>
              {product.rating ? product.rating.toFixed(1) : '4.8'} out of 5.0
            </span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              ({product.num_reviews || 94} customer ratings)
            </span>
          </div>

          {/* Pricing */}
          <div className="detail-price-box">
            <span className="detail-price">${Number(product.price).toFixed(2)}</span>
            {product.original_price && product.original_price > product.price && (
              <>
                <span className="original-price" style={{ fontSize: '1.25rem' }}>
                  ${Number(product.original_price).toFixed(2)}
                </span>
                <span style={{ color: 'var(--success)', fontWeight: 700, fontSize: '0.95rem' }}>
                  Save ${(product.original_price - product.price).toFixed(2)}
                </span>
              </>
            )}
          </div>

          {/* Stock Indicator */}
          <div style={{ marginBottom: '1.5rem', fontSize: '0.95rem' }}>
            {isOutOfStock ? (
              <span className="stock-out" style={{ fontWeight: 700 }}>
                <AlertCircle size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                Currently Out of Stock
              </span>
            ) : isLowStock ? (
              <span className="stock-low" style={{ fontWeight: 700 }}>
                <AlertCircle size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                Hurry! Only {product.stock} items remaining in stock
              </span>
            ) : (
              <span className="stock-in" style={{ fontWeight: 700 }}>
                <Check size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                In Stock & Ready to Ship ({product.stock} units)
              </span>
            )}
          </div>

          {/* Description */}
          <p className="detail-desc">{product.description}</p>

          {/* Quantity Selector */}
          {!isOutOfStock && (
            <div style={{ marginBottom: '1.75rem' }}>
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.45rem', color: 'var(--text-main)' }}>
                Quantity:
              </label>
              <div className="qty-picker">
                <button
                  className="qty-btn"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus size={16} />
                </button>
                <span className="qty-display">{quantity}</span>
                <button
                  className="qty-btn"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="detail-actions">
            <button
              className="btn-detail-cart"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              id="detail-add-cart-btn"
            >
              <ShoppingCart size={20} />
              <span>Add to Cart</span>
            </button>

            <button
              className="btn-buy-now"
              onClick={handleBuyNow}
              disabled={isOutOfStock}
              id="detail-buy-now-btn"
            >
              <Zap size={20} />
              <span>Buy Now</span>
            </button>
          </div>

          {/* Trust Guarantees */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1rem',
            marginTop: '2.5rem',
            paddingTop: '2rem',
            borderTop: '1px solid var(--border-color)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              <Truck size={20} style={{ color: 'var(--primary)', margin: '0 auto 0.35rem' }} />
              <div>Free Delivery</div>
              <strong style={{ color: 'var(--text-main)' }}>Over $50</strong>
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              <ShieldCheck size={20} style={{ color: 'var(--primary)', margin: '0 auto 0.35rem' }} />
              <div>Guaranteed Authentic</div>
              <strong style={{ color: 'var(--text-main)' }}>100% Genuine</strong>
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              <RotateCcw size={20} style={{ color: 'var(--primary)', margin: '0 auto 0.35rem' }} />
              <div>30 Days Return</div>
              <strong style={{ color: 'var(--text-main)' }}>Hassle Free</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section: Specifications and Reviews */}
      <div style={{
        background: 'white',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-xl)',
        padding: '2.5rem',
        marginBottom: '4rem',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div className="admin-nav-tabs" style={{ marginBottom: '1.5rem' }}>
          <button
            className={`admin-tab-btn ${activeTab === 'specs' ? 'active' : ''}`}
            onClick={() => setActiveTab('specs')}
          >
            Product Specifications
          </button>
          <button
            className={`admin-tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            Customer Reviews ({product.num_reviews || 94})
          </button>
        </div>

        {activeTab === 'specs' ? (
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>Technical Details</h3>
            <table className="specs-table">
              <tbody>
                <tr>
                  <td>Category</td>
                  <td>{product.category}</td>
                </tr>
                <tr>
                  <td>Stock Units</td>
                  <td>{product.stock} available in warehouse</td>
                </tr>
                {product.specs && Object.entries(product.specs).map(([key, val]) => (
                  <tr key={key}>
                    <td>{key}</td>
                    <td>{String(val)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem' }}>Verified Customer Feedback</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ padding: '1.25rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', background: 'var(--bg-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.45rem' }}>
                  <div style={{ fontWeight: 700 }}>Michael R. <span style={{ color: 'var(--success)', fontSize: '0.8rem', fontWeight: 600 }}>• Verified Buyer</span></div>
                  <div style={{ display: 'flex', gap: 2 }}>
                    {[1,2,3,4,5].map(i => <Star key={i} size={14} className="star-filled" />)}
                  </div>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
                  Exceeded my expectations! Build quality is top-notch, battery life matches the manufacturer claims, and shipping arrived in 2 days. Highly recommended.
                </p>
              </div>

              <div style={{ padding: '1.25rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', background: 'var(--bg-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.45rem' }}>
                  <div style={{ fontWeight: 700 }}>Elena S. <span style={{ color: 'var(--success)', fontSize: '0.8rem', fontWeight: 600 }}>• Verified Buyer</span></div>
                  <div style={{ display: 'flex', gap: 2 }}>
                    {[1,2,3,4,5].map(i => <Star key={i} size={14} className="star-filled" />)}
                  </div>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
                  Flawless design and intuitive to use straight out of the box. Delivery was seamless and the packaging was completely secure.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Related Products Grid */}
      {relatedProducts.length > 0 && (
        <div style={{ marginBottom: '4rem' }}>
          <div className="section-header">
            <div>
              <div className="section-tag">Similar Items</div>
              <h2 className="section-title">You May Also Like</h2>
            </div>
          </div>
          <div className="product-grid">
            {relatedProducts.map((rel) => (
              <ProductCard
                key={rel.id}
                product={rel}
                onViewDetails={onViewProductDetails}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
