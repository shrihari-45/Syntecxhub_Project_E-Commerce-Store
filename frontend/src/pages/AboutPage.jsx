import React from 'react';
import { 
  ShieldCheck, 
  Layers, 
  Database, 
  Lock, 
  Code2, 
  CheckCircle, 
  ArrowRight 
} from 'lucide-react';

export default function AboutPage({ onNavigateToShop }) {
  return (
    <div className="container" style={{ margin: '3rem auto 6rem', maxWidth: 980 }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.4rem 1rem',
          background: 'var(--primary-light)',
          color: 'var(--primary)',
          borderRadius: 'var(--radius-full)',
          fontSize: '0.85rem',
          fontWeight: 700,
          marginBottom: '1rem'
        }}>
          <ShieldCheck size={16} />
          <span>FULL-STACK E-COMMERCE PLATFORM</span>
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.8rem', fontWeight: 800, marginBottom: '1rem' }}>
          About ShopHub Store
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: 680, margin: '0 auto', lineHeight: 1.6 }}>
          A production-grade, full-stack shopping platform engineered with clean architectural separation, strict security standards, and seamless user experiences.
        </p>
      </div>

      {/* Tech Stack Highlights Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.75rem', marginBottom: '3.5rem' }}>
        <div style={{ background: 'white', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
            <Layers size={24} />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>React.js & Vite Frontend</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6 }}>
            Ultra-fast single page application utilizing React Context for centralized authentication, shopping cart persistence, and live toast notifications.
          </p>
        </div>

        <div style={{ background: 'white', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', background: '#ede9fe', color: 'var(--accent-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
            <Code2 size={24} />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Python Flask REST APIs</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6 }}>
            Modular Flask blueprints covering authentication, catalog filtering, orders, and admin controls with robust CORS and standardized JSON responses.
          </p>
        </div>

        <div style={{ background: 'white', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', background: '#ecfdf5', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
            <Database size={24} />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>MongoDB Persistence</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6 }}>
            Persistent storage with collections for Users, Products, and Orders, featuring automatic local disk backup fallback for testing resilience.
          </p>
        </div>
      </div>

      {/* Security Principles */}
      <div style={{
        background: 'white',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-xl)',
        padding: '2.5rem',
        boxShadow: 'var(--shadow-sm)',
        marginBottom: '4rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <Lock size={22} style={{ color: 'var(--primary)' }} />
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 700 }}>
            Security & Data Integrity Measures
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
          {[
            {
              title: 'Server-Side Calculations',
              desc: 'Client-submitted prices and totals are never trusted. Product prices, taxes, discounts, and order amounts are strictly validated against MongoDB records.'
            },
            {
              title: 'Inventory Stock Locks',
              desc: 'Checkout requests undergo stock availability checks before placement. Units are atomically decremented to prevent overselling.'
            },
            {
              title: 'PBKDF2 Password Hashing',
              desc: 'Passwords are never stored in plaintext. Secure salt-and-hash algorithms ensure user data protection.'
            },
            {
              title: 'JWT Role Authorization',
              desc: 'Administrative actions (product additions, edits, deletions, and order status updates) require validated administrator token signatures.'
            }
          ].map((item, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '0.75rem' }}>
              <CheckCircle size={18} style={{ color: 'var(--success)', flexShrink: 0, marginTop: 3 }} />
              <div>
                <strong style={{ display: 'block', fontSize: '0.95rem', marginBottom: 2 }}>{item.title}</strong>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{item.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Box */}
      <div style={{ textAlign: 'center' }}>
        <button
          className="btn-primary"
          style={{ background: 'var(--primary)', color: 'white', padding: '0.9rem 2rem', fontSize: '1rem' }}
          onClick={onNavigateToShop}
        >
          <span>Explore Catalog</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
