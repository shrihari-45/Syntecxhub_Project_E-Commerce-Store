import { ShoppingBag, Mail, Phone, MapPin, ShieldCheck, Globe, Share2 } from 'lucide-react';

export default function Footer({ setCurrentRoute }) {
  const navigateTo = (route) => {
    if (setCurrentRoute) {
      setCurrentRoute(route);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Info */}
          <div>
            <div className="brand-logo" style={{ color: 'white', marginBottom: '1rem', cursor: 'pointer' }} onClick={() => navigateTo('home')}>
              <div className="brand-icon">
                <ShoppingBag size={22} />
              </div>
              <span>Shop<span style={{ color: '#818cf8' }}>Hub</span></span>
              <span className="brand-badge">Store</span>
            </div>
            <p className="footer-text">
              Engineered with modern full-stack web standards: React.js, Python Flask REST API, and MongoDB persistent storage. Deliver modern e-commerce with seamless checkout.
            </p>
            <div className="footer-social-row">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="social-icon-btn" aria-label="GitHub">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="social-icon-btn" aria-label="LinkedIn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="social-icon-btn" aria-label="Twitter">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="footer-title">Navigation</h4>
            <ul className="footer-links">
              <li>
                <button className="footer-link" onClick={() => navigateTo('home')}>Home Page</button>
              </li>
              <li>
                <button className="footer-link" onClick={() => navigateTo('shop')}>Explore Catalog</button>
              </li>
              <li>
                <button className="footer-link" onClick={() => navigateTo('orders')}>Track Orders</button>
              </li>
              <li>
                <button className="footer-link" onClick={() => navigateTo('about')}>About Us</button>
              </li>
              <li>
                <button className="footer-link" onClick={() => navigateTo('contact')}>Help & Contact</button>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="footer-title">Top Categories</h4>
            <ul className="footer-links">
              <li><button className="footer-link" onClick={() => navigateTo('shop')}>Electronics</button></li>
              <li><button className="footer-link" onClick={() => navigateTo('shop')}>Fashion & Apparel</button></li>
              <li><button className="footer-link" onClick={() => navigateTo('shop')}>Home & Living</button></li>
              <li><button className="footer-link" onClick={() => navigateTo('shop')}>Beauty & Wellness</button></li>
              <li><button className="footer-link" onClick={() => navigateTo('shop')}>Audio & Wearables</button></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="footer-title">Customer Support</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <ShieldCheck size={18} style={{ color: '#818cf8', flexShrink: 0 }} />
                <span>Verified Online Store</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Mail size={18} style={{ color: '#818cf8', flexShrink: 0 }} />
                <span>support@shophub.com</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Phone size={18} style={{ color: '#818cf8', flexShrink: 0 }} />
                <span>+1 (800) 555-0199</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <MapPin size={18} style={{ color: '#818cf8', flexShrink: 0 }} />
                <span>San Francisco, CA & Global Remote</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <div>
            © {new Date().getFullYear()} ShopHub Store. Built with React.js & Python Flask.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', color: '#64748b' }}>
            <span>Secure 256-Bit SSL</span>
            <span>REST API Verified</span>
            <span>MongoDB Powered</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
