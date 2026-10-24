import React, { useState } from 'react';
import { X, Mail, Lock, User, Eye, EyeOff, ShieldCheck, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal() {
  const { 
    authModalOpen, 
    authModalMode, 
    closeAuthModal, 
    setAuthModalMode, 
    login, 
    register 
  } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!authModalOpen) return null;

  const isLogin = authModalMode === 'login';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSubmitting(true);

    try {
      if (isLogin) {
        const res = await login(email, password);
        if (!res?.success) {
          setErrorMsg(res?.message || 'Invalid email or password');
        }
      } else {
        const res = await register(name, email, password);
        if (!res?.success) {
          setErrorMsg(res?.message || 'Failed to create account');
        }
      }
    } catch (err) {
      setErrorMsg(err.message || 'Authentication error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickFill = (role) => {
    if (role === 'admin') {
      setEmail('admin@syntecxhub.com');
      setPassword('Admin@123');
      if (!isLogin) setName('Syntecxhub Admin');
    } else {
      setEmail('alex@example.com');
      setPassword('Customer@123');
      if (!isLogin) setName('Alex Johnson');
    }
    setErrorMsg('');
  };

  return (
    <div className="modal-backdrop" onClick={closeAuthModal}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3 className="modal-title">
              {isLogin ? 'Welcome Back' : 'Create an Account'}
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: 4 }}>
              {isLogin ? 'Sign in to access your orders and profile' : 'Join Syntecxhub Store for seamless shopping'}
            </p>
          </div>
          <button className="modal-close-btn" onClick={closeAuthModal} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        {/* Demo Fast-Fill Bar */}
        <div style={{
          background: 'var(--bg-subtle)',
          padding: '0.75rem 1rem',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.25rem',
          border: '1px solid var(--border-color)',
          fontSize: '0.85rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.45rem' }}>
            <ShieldCheck size={16} style={{ color: 'var(--primary)' }} />
            <span>Internship Evaluator Fast-Fill:</span>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn-secondary"
              style={{
                fontSize: '0.78rem',
                padding: '0.35rem 0.75rem',
                background: 'white',
                color: 'var(--accent-purple)',
                borderColor: '#c4b5fd',
                fontWeight: 700
              }}
              onClick={() => handleQuickFill('admin')}
              id="quick-fill-admin-btn"
            >
              Fill Admin (admin@syntecxhub.com)
            </button>
            <button
              type="button"
              className="btn-secondary"
              style={{
                fontSize: '0.78rem',
                padding: '0.35rem 0.75rem',
                background: 'white',
                color: 'var(--primary)',
                borderColor: '#a5b4fc',
                fontWeight: 700
              }}
              onClick={() => handleQuickFill('customer')}
              id="quick-fill-customer-btn"
            >
              Fill Customer (alex@example.com)
            </button>
          </div>
        </div>

        {errorMsg && (
          <div style={{
            background: 'var(--danger-bg)',
            color: 'var(--danger)',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.25rem',
            fontSize: '0.88rem',
            fontWeight: 500
          }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="auth-name-input"
                  type="text"
                  required
                  placeholder="e.g. Alex Johnson"
                  className="form-input"
                  style={{ paddingLeft: '2.5rem' }}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <User size={18} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <input
                id="auth-email-input"
                type="email"
                required
                placeholder="name@example.com"
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Mail size={18} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                id="auth-password-input"
                type={showPassword ? 'text' : 'password'}
                required
                placeholder={isLogin ? 'Enter your password' : 'Minimum 6 characters'}
                className="form-input"
                style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Lock size={18} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            id="auth-submit-btn"
            type="submit"
            className="btn-checkout"
            style={{ width: '100%', marginTop: '1.25rem' }}
            disabled={submitting}
          >
            <span>{submitting ? 'Please wait...' : isLogin ? 'Sign In to Account' : 'Create Account'}</span>
            <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          {isLogin ? (
            <>
              Don't have an account?{' '}
              <button
                type="button"
                style={{ color: 'var(--primary)', fontWeight: 700 }}
                onClick={() => {
                  setErrorMsg('');
                  setAuthModalMode('register');
                }}
              >
                Create one now
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                type="button"
                style={{ color: 'var(--primary)', fontWeight: 700 }}
                onClick={() => {
                  setErrorMsg('');
                  setAuthModalMode('login');
                }}
              >
                Sign in here
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
