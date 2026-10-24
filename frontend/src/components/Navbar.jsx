import React, { useState, useRef, useEffect } from 'react';
import { 
  ShoppingBag, 
  Search, 
  ShoppingCart, 
  User, 
  Menu, 
  X, 
  ChevronDown, 
  ShieldCheck, 
  Package, 
  LogOut, 
  LogIn, 
  UserPlus 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar({ currentRoute, setCurrentRoute, onSearch }) {
  const { user, isAuthenticated, isAdmin, logout, openAuthModal } = useAuth();
  const { cartCount, openDrawer } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
    setCurrentRoute('shop');
    setMobileMenuOpen(false);
  };

  const navigateTo = (route) => {
    setCurrentRoute(route);
    setMobileMenuOpen(false);
    setDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="navbar">
      <div className="container nav-container">
        {/* Brand Logo */}
        <div 
          className="brand-logo" 
          onClick={() => navigateTo('home')} 
          style={{ cursor: 'pointer' }}
          id="nav-logo"
        >
          <div className="brand-icon">
            <ShoppingBag size={22} />
          </div>
          <span>Shop<span style={{ color: 'var(--primary)' }}>Hub</span></span>
          <span className="brand-badge">Store</span>
        </div>

        {/* Desktop Navigation Links */}
        <ul className="nav-links">
          <li>
            <button 
              className={`nav-link ${currentRoute === 'home' ? 'active' : ''}`}
              onClick={() => navigateTo('home')}
              id="nav-link-home"
            >
              Home
            </button>
          </li>
          <li>
            <button 
              className={`nav-link ${currentRoute === 'shop' ? 'active' : ''}`}
              onClick={() => navigateTo('shop')}
              id="nav-link-shop"
            >
              Shop
            </button>
          </li>
          <li>
            <button 
              className={`nav-link ${currentRoute === 'about' ? 'active' : ''}`}
              onClick={() => navigateTo('about')}
              id="nav-link-about"
            >
              About
            </button>
          </li>
          <li>
            <button 
              className={`nav-link ${currentRoute === 'contact' ? 'active' : ''}`}
              onClick={() => navigateTo('contact')}
              id="nav-link-contact"
            >
              Contact
            </button>
          </li>
        </ul>

        {/* Live Search Input */}
        <form className="nav-search" onSubmit={handleSearchSubmit}>
          <Search size={18} className="search-icon" />
          <input
            id="nav-search-input"
            type="text"
            className="search-input"
            placeholder="Search products, brands, categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>

        {/* Right Actions (Cart, Account, Mobile Toggle) */}
        <div className="nav-actions">
          {/* Shopping Cart Drawer Trigger */}
          <button 
            className="icon-btn" 
            onClick={openDrawer} 
            aria-label="View Shopping Cart"
            id="nav-cart-btn"
          >
            <ShoppingCart size={21} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>

          {/* User Account / Auth Dropdown */}
          <div style={{ position: 'relative' }} ref={dropdownRef}>
            {isAuthenticated ? (
              <button 
                className="user-menu-btn" 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                id="user-menu-button"
              >
                <div className="user-avatar-badge">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span style={{ maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.name?.split(' ')[0]}
                </span>
                <ChevronDown size={15} />
              </button>
            ) : (
              <button 
                className="user-menu-btn" 
                onClick={() => openAuthModal('login')}
                id="login-button"
              >
                <LogIn size={17} />
                <span>Sign In</span>
              </button>
            )}

            {/* Account Dropdown Menu */}
            {isAuthenticated && dropdownOpen && (
              <div className="dropdown-menu">
                <div className="dropdown-header">
                  <div className="dropdown-user-name">{user.name}</div>
                  <div className="dropdown-user-email">{user.email}</div>
                  <span className="dropdown-role-tag">{user.role}</span>
                </div>

                <button 
                  className="dropdown-item" 
                  onClick={() => navigateTo('orders')}
                  id="dropdown-my-orders"
                >
                  <Package size={17} />
                  <span>My Orders</span>
                </button>

                {isAdmin && (
                  <button 
                    className="dropdown-item" 
                    onClick={() => navigateTo('admin')}
                    id="dropdown-admin-panel"
                    style={{ color: 'var(--accent-purple)', fontWeight: 600 }}
                  >
                    <ShieldCheck size={17} />
                    <span>Admin Dashboard</span>
                  </button>
                )}

                <button 
                  className="dropdown-item danger" 
                  onClick={() => {
                    logout();
                    setDropdownOpen(false);
                    navigateTo('home');
                  }}
                  id="dropdown-logout"
                >
                  <LogOut size={17} />
                  <span>Log Out</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Hamburger */}
          <button 
            className="icon-btn mobile-menu-toggle" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div style={{
          background: 'white',
          borderBottom: '1px solid var(--border-color)',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <form onSubmit={handleSearchSubmit} style={{ position: 'relative' }}>
            <Search size={18} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>

          <button 
            className="nav-link" 
            style={{ textAlign: 'left', padding: '0.5rem 0' }}
            onClick={() => navigateTo('home')}
          >
            Home
          </button>
          <button 
            className="nav-link" 
            style={{ textAlign: 'left', padding: '0.5rem 0' }}
            onClick={() => navigateTo('shop')}
          >
            Shop All Products
          </button>
          <button 
            className="nav-link" 
            style={{ textAlign: 'left', padding: '0.5rem 0' }}
            onClick={() => navigateTo('about')}
          >
            About Us
          </button>
          <button 
            className="nav-link" 
            style={{ textAlign: 'left', padding: '0.5rem 0' }}
            onClick={() => navigateTo('contact')}
          >
            Contact Support
          </button>

          {isAuthenticated ? (
            <>
              <hr style={{ borderColor: 'var(--border-color)' }} />
              <button 
                className="nav-link" 
                style={{ textAlign: 'left', padding: '0.5rem 0' }}
                onClick={() => navigateTo('orders')}
              >
                My Orders
              </button>
              {isAdmin && (
                <button 
                  className="nav-link" 
                  style={{ textAlign: 'left', padding: '0.5rem 0', color: 'var(--accent-purple)', fontWeight: 700 }}
                  onClick={() => navigateTo('admin')}
                >
                  Admin Dashboard
                </button>
              )}
              <button 
                className="nav-link" 
                style={{ textAlign: 'left', padding: '0.5rem 0', color: 'var(--danger)' }}
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
              >
                Log Out
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button 
                className="btn-primary" 
                style={{ flex: 1, padding: '0.65rem 1rem', background: 'var(--primary)', color: 'white' }}
                onClick={() => {
                  openAuthModal('login');
                  setMobileMenuOpen(false);
                }}
              >
                Sign In
              </button>
              <button 
                className="btn-secondary" 
                style={{ flex: 1, padding: '0.65rem 1rem', background: 'var(--bg-subtle)', color: 'var(--text-main)', border: '1px solid var(--border-color)' }}
                onClick={() => {
                  openAuthModal('register');
                  setMobileMenuOpen(false);
                }}
              >
                Register
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
