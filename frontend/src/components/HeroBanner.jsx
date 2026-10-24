import React from 'react';
import { ArrowRight, Sparkles, ShieldCheck, Truck, RefreshCw, Headphones, Star } from 'lucide-react';

export default function HeroBanner({ onShopClick, onCategoryClick }) {
  return (
    <>
      <section className="hero-section">
        <div className="hero-glow-1"></div>
        <div className="hero-glow-2"></div>

        <div className="container hero-grid">
          {/* Left Column: Copy & CTAs */}
          <div>
            <div className="hero-tag">
              <Sparkles size={16} style={{ color: '#fbbf24' }} />
              <span>Syntecxhub Exclusive • Up to 30% Off Selected Collections</span>
            </div>

            <h1 className="hero-title">
              Elevate Your Lifestyle with <span className="hero-gradient-text">Next-Gen Tech & Essentials</span>
            </h1>

            <p className="hero-subtitle">
              Discover curated electronics, timeless fashion, home innovations, and wellness gear with lightning-fast shipping and guaranteed authenticity.
            </p>

            <div className="hero-cta-group">
              <button 
                className="btn-primary" 
                onClick={onShopClick}
                id="hero-shop-now-btn"
              >
                <span>Shop Now</span>
                <ArrowRight size={18} />
              </button>

              <button 
                className="btn-secondary" 
                onClick={onCategoryClick}
                id="hero-explore-categories-btn"
              >
                Explore Categories
              </button>
            </div>
          </div>

          {/* Right Column: Hero Visual Showcase */}
          <div className="hero-image-card">
            <img
              src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80"
              alt="Sony WH-1000XM5 Wireless Headphones"
              className="hero-featured-img"
            />
            <div className="hero-float-badge">
              <div style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: '#fef3c7',
                color: '#d97706',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Star size={24} fill="#d97706" />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#0f172a' }}>4.9 / 5.0 Rating</div>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Over 10,000+ happy shoppers</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Bar */}
      <div className="container">
        <div className="features-bar">
          <div className="feature-box">
            <div className="feature-icon-wrapper">
              <Truck size={24} />
            </div>
            <div>
              <div className="feature-title">Free Shipping</div>
              <div className="feature-desc">On all orders over $50.00</div>
            </div>
          </div>

          <div className="feature-box">
            <div className="feature-icon-wrapper">
              <ShieldCheck size={24} />
            </div>
            <div>
              <div className="feature-title">100% Secure Checkout</div>
              <div className="feature-desc">Verified 256-bit encryption</div>
            </div>
          </div>

          <div className="feature-box">
            <div className="feature-icon-wrapper">
              <RefreshCw size={24} />
            </div>
            <div>
              <div className="feature-title">30-Day Easy Returns</div>
              <div className="feature-desc">Hassle-free guarantee</div>
            </div>
          </div>

          <div className="feature-box">
            <div className="feature-icon-wrapper">
              <Headphones size={24} />
            </div>
            <div>
              <div className="feature-title">24/7 Priority Support</div>
              <div className="feature-desc">Always here to help you</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
