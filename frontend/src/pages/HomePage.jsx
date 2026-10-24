import React, { useState, useEffect } from 'react';
import HeroBanner from '../components/HeroBanner';
import ProductCard from '../components/ProductCard';
import api from '../services/api';
import { 
  Laptop, 
  Shirt, 
  Home as HomeIcon, 
  Sparkles, 
  Headphones, 
  ArrowRight, 
  Tag, 
  Send 
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

export default function HomePage({ setCurrentRoute, setSelectedCategory, onViewProductDetails }) {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const { showToast } = useToast();

  const categories = [
    { name: 'Electronics', icon: Laptop, count: '6 Items' },
    { name: 'Fashion', icon: Shirt, count: '4 Items' },
    { name: 'Home & Kitchen', icon: HomeIcon, count: '3 Items' },
    { name: 'Beauty & Wellness', icon: Sparkles, count: '3 Items' },
    { name: 'Audio & Wearables', icon: Headphones, count: '4 Items' }
  ];

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await api.get('/products', { limit: 8 });
        if (res.success && res.data?.products) {
          const prods = res.data.products;
          setFeaturedProducts(prods.filter(p => p.is_featured).slice(0, 4));
          setTrendingProducts(prods.slice(0, 4));
        }
      } catch (err) {
        console.error('Error fetching homepage products:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  const handleCategoryClick = (categoryName) => {
    if (setSelectedCategory) setSelectedCategory(categoryName);
    if (setCurrentRoute) setCurrentRoute('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    showToast(`Thank you for subscribing! Promo code SYNTEC10 sent to ${newsletterEmail}`, 'success');
    setNewsletterEmail('');
  };

  return (
    <div>
      {/* Grand Hero Section with Promotion */}
      <HeroBanner 
        onShopClick={() => {
          if (setSelectedCategory) setSelectedCategory('all');
          if (setCurrentRoute) setCurrentRoute('shop');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onCategoryClick={() => {
          const el = document.getElementById('home-categories-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      <div className="container" style={{ margin: '3.5rem auto' }} id="home-categories-section">
        {/* Category Showcase Section */}
        <div className="section-header">
          <div>
            <div className="section-tag">Collections</div>
            <h2 className="section-title">Explore by Category</h2>
            <p className="section-subtitle">Curated catalog built for modern productivity, style, and everyday comfort</p>
          </div>
          <button 
            className="btn-secondary" 
            style={{ color: 'var(--primary)', borderColor: 'var(--primary)', background: 'white' }}
            onClick={() => {
              if (setSelectedCategory) setSelectedCategory('all');
              if (setCurrentRoute) setCurrentRoute('shop');
            }}
          >
            <span>View All Categories</span>
            <ArrowRight size={16} />
          </button>
        </div>

        <div className="category-grid">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div 
                key={cat.name} 
                className="category-card"
                onClick={() => handleCategoryClick(cat.name)}
                id={`home-category-${cat.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
              >
                <div className="category-icon-bubble">
                  <Icon size={26} />
                </div>
                <div className="category-name">{cat.name}</div>
                <div className="category-count">{cat.count}</div>
              </div>
            );
          })}
        </div>

        {/* Featured Products Showcase */}
        <div className="section-header" style={{ marginTop: '4.5rem' }}>
          <div>
            <div className="section-tag">Handpicked For You</div>
            <h2 className="section-title">Featured Highlights</h2>
            <p className="section-subtitle">Top-rated items favored by our shoppers with special promotional rates</p>
          </div>
          <button 
            className="btn-secondary" 
            style={{ color: 'var(--primary)', borderColor: 'var(--primary)', background: 'white' }}
            onClick={() => {
              if (setCurrentRoute) setCurrentRoute('shop');
            }}
          >
            <span>Browse Full Catalog</span>
            <ArrowRight size={16} />
          </button>
        </div>

        {loading ? (
          <div className="loading-spinner"></div>
        ) : (
          <div className="product-grid">
            {featuredProducts.map((prod) => (
              <ProductCard 
                key={prod.id} 
                product={prod} 
                onViewDetails={onViewProductDetails} 
              />
            ))}
          </div>
        )}

        {/* Promotional Callout Banner */}
        <div style={{
          background: 'var(--accent-gradient)',
          borderRadius: 'var(--radius-xl)',
          padding: '3rem',
          color: 'white',
          margin: '5rem 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '2rem',
          boxShadow: 'var(--shadow-glow)'
        }}>
          <div style={{ maxWidth: 600 }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              background: 'rgba(255, 255, 255, 0.2)',
              padding: '0.35rem 0.85rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.85rem',
              fontWeight: 700,
              marginBottom: '1rem'
            }}>
              <Tag size={16} />
              <span>LIMITED INTERNSHIP SPECIAL</span>
            </div>
            <h3 style={{ fontSize: '2.3rem', fontFamily: 'var(--font-display)', fontWeight: 800, lineHeight: 1.2, marginBottom: '0.75rem' }}>
              Save 10% on your initial checkout with code <span style={{ textDecoration: 'underline', color: '#fef08a' }}>SYNTEC10</span>
            </h3>
            <p style={{ color: '#e0e7ff', fontSize: '1.05rem', lineHeight: 1.6 }}>
              Enjoy automated server-calculated totals, instant demo payment processing, and real-time MongoDB order tracking.
            </p>
          </div>
          <div>
            <button
              className="btn-primary"
              style={{ padding: '1rem 2.25rem', fontSize: '1.05rem', fontWeight: 800 }}
              onClick={() => {
                if (setCurrentRoute) setCurrentRoute('shop');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              Shop Discounted Deals
            </button>
          </div>
        </div>

        {/* Trending Essentials */}
        <div className="section-header">
          <div>
            <div className="section-tag">Best Sellers</div>
            <h2 className="section-title">Trending Essentials</h2>
            <p className="section-subtitle">Discover the most popular products in our store today</p>
          </div>
        </div>

        {loading ? (
          <div className="loading-spinner"></div>
        ) : (
          <div className="product-grid" style={{ marginBottom: '4rem' }}>
            {trendingProducts.map((prod) => (
              <ProductCard 
                key={prod.id} 
                product={prod} 
                onViewDetails={onViewProductDetails} 
              />
            ))}
          </div>
        )}

        {/* Newsletter Box */}
        <div style={{
          background: 'white',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-xl)',
          padding: '3rem 2rem',
          textAlign: 'center',
          maxWidth: 720,
          margin: '3rem auto 5rem',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.85rem', fontWeight: 700, marginBottom: '0.65rem' }}>
            Stay in the Loop
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.75rem' }}>
            Subscribe to our newsletter to receive the latest product releases, flash discounts, and internship portfolio updates directly.
          </p>
          <form onSubmit={handleNewsletterSubmit} style={{ display: 'flex', gap: '0.75rem', maxWidth: 480, margin: '0 auto' }}>
            <input
              type="email"
              required
              placeholder="Enter your email address..."
              className="form-input"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              style={{ flex: 1 }}
            />
            <button type="submit" className="btn-primary" style={{ background: 'var(--primary)', color: 'white', padding: '0.75rem 1.5rem', whiteSpace: 'nowrap' }}>
              <Send size={16} />
              <span>Subscribe</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
