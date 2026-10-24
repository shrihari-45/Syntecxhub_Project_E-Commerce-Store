import React from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Plus, Minus, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartDrawer({ onNavigateToCheckout, onNavigateToCart }) {
  const { 
    isDrawerOpen, 
    closeDrawer, 
    cartItems, 
    updateQuantity, 
    removeFromCart, 
    subtotal, 
    cartCount 
  } = useCart();

  if (!isDrawerOpen) return null;

  const freeShippingThreshold = 50.0;
  const isFreeShipping = subtotal >= freeShippingThreshold;
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  const handleCheckoutClick = () => {
    closeDrawer();
    if (onNavigateToCheckout) {
      onNavigateToCheckout();
    }
  };

  const handleFullCartClick = () => {
    closeDrawer();
    if (onNavigateToCart) {
      onNavigateToCart();
    }
  };

  return (
    <div className="drawer-backdrop" onClick={closeDrawer}>
      <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="drawer-header">
          <div className="drawer-title">
            <ShoppingBag size={22} style={{ color: 'var(--primary)' }} />
            <span>Shopping Cart</span>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              ({cartCount} {cartCount === 1 ? 'item' : 'items'})
            </span>
          </div>
          <button className="modal-close-btn" onClick={closeDrawer} aria-label="Close cart drawer">
            <X size={18} />
          </button>
        </div>

        {/* Free Shipping Progress */}
        <div style={{ padding: '0.85rem 1.5rem', background: '#f8fafc', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.45rem' }}>
            <Truck size={16} style={{ color: isFreeShipping ? 'var(--success)' : 'var(--primary)' }} />
            <span>
              {isFreeShipping 
                ? 'You unlocked FREE Shipping!' 
                : `Add $${amountToFreeShipping.toFixed(2)} more for FREE shipping`}
            </span>
          </div>
          <div style={{ width: '100%', height: 6, background: '#e2e8f0', borderRadius: 3, overflow: 'hidden' }}>
            <div 
              style={{ 
                width: `${progressPercent}%`, 
                height: '100%', 
                background: isFreeShipping ? 'var(--success)' : 'var(--primary)',
                transition: 'width 0.3s ease'
              }} 
            />
          </div>
        </div>

        {/* Cart Items List */}
        <div className="drawer-items">
          {cartItems.length === 0 ? (
            <div className="empty-state" style={{ margin: 'auto', border: 'none' }}>
              <div className="empty-state-icon">
                <ShoppingBag size={32} />
              </div>
              <h4 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Your Cart is Empty</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
                Looks like you haven't added any products yet.
              </p>
              <button 
                className="btn-primary" 
                style={{ background: 'var(--primary)', color: 'white', padding: '0.65rem 1.25rem', fontSize: '0.9rem' }}
                onClick={closeDrawer}
              >
                Start Shopping
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="cart-item-row">
                <img src={item.image_url} alt={item.name} className="cart-item-img" />
                <div className="cart-item-info">
                  <h4 className="cart-item-title">{item.name}</h4>
                  <div className="cart-item-price">${Number(item.price).toFixed(2)}</div>

                  <div className="cart-item-controls">
                    <div className="qty-picker" style={{ height: 32 }}>
                      <button 
                        className="qty-btn" 
                        style={{ width: 30, height: 32 }}
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus size={14} />
                      </button>
                      <span className="qty-display" style={{ width: 36, fontSize: '0.88rem' }}>
                        {item.quantity}
                      </span>
                      <button 
                        className="qty-btn" 
                        style={{ width: 30, height: 32 }}
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <button 
                      className="btn-remove-item"
                      onClick={() => removeFromCart(item.id)}
                      title="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer with Summary and Checkout Button */}
        {cartItems.length > 0 && (
          <div className="drawer-footer">
            <div className="drawer-summary-row">
              <span>Subtotal</span>
              <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>${subtotal.toFixed(2)}</span>
            </div>
            <div className="drawer-summary-row">
              <span>Estimated Shipping</span>
              <span>{isFreeShipping ? <strong style={{ color: 'var(--success)' }}>FREE</strong> : '$9.99'}</span>
            </div>
            <div className="drawer-summary-row drawer-summary-total">
              <span>Estimated Total</span>
              <span>${(subtotal + (isFreeShipping ? 0 : 9.99)).toFixed(2)}</span>
            </div>

            <button 
              className="btn-checkout" 
              onClick={handleCheckoutClick}
              id="drawer-checkout-btn"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={18} />
            </button>

            <button
              onClick={handleFullCartClick}
              style={{
                width: '100%',
                textAlign: 'center',
                marginTop: '0.85rem',
                fontSize: '0.88rem',
                color: 'var(--primary)',
                fontWeight: 600,
                textDecoration: 'underline'
              }}
            >
              View Detailed Cart & Promo Codes
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
