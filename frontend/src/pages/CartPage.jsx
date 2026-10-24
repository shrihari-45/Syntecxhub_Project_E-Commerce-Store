import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ArrowLeft, 
  Tag, 
  Check, 
  Truck, 
  ShieldCheck 
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

export default function CartPage({ onNavigateToShop, onNavigateToCheckout, promoCode, setPromoCode }) {
  const { cartItems, updateQuantity, removeFromCart, clearCart, subtotal, cartCount } = useCart();
  const { showToast } = useToast();

  const [inputCoupon, setInputCoupon] = useState(promoCode || '');
  const [appliedCoupon, setAppliedCoupon] = useState(promoCode || '');
  const [discountPercent, setDiscountPercent] = useState(
    (promoCode === 'SAVE10' || promoCode === 'SYNTEC10') ? 0.10 : promoCode === 'WELCOME20' ? 0.20 : 0
  );

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    const code = inputCoupon.trim().toUpperCase();

    if (code === 'SAVE10' || code === 'SYNTEC10') {
      setAppliedCoupon(code);
      setDiscountPercent(0.10);
      if (setPromoCode) setPromoCode(code);
      showToast(`Promo code ${code} applied: 10% discount!`, 'success');
    } else if (code === 'WELCOME20') {
      setAppliedCoupon('WELCOME20');
      setDiscountPercent(0.20);
      if (setPromoCode) setPromoCode('WELCOME20');
      showToast('Promo code WELCOME20 applied: 20% discount!', 'success');
    } else {
      showToast('Invalid promo code. Try "SAVE10" or "WELCOME20"', 'error');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon('');
    setDiscountPercent(0);
    setInputCoupon('');
    if (setPromoCode) setPromoCode('');
    showToast('Promo code removed', 'info');
  };

  const discountAmount = Number((subtotal * discountPercent).toFixed(2));
  const subtotalAfterDiscount = Math.max(0, subtotal - discountAmount);
  const isFreeShipping = subtotal >= 50.0;
  const shippingFee = isFreeShipping ? 0.0 : 9.99;
  const tax = Number((subtotalAfterDiscount * 0.08).toFixed(2));
  const totalAmount = Number((subtotalAfterDiscount + tax + shippingFee).toFixed(2));

  if (cartItems.length === 0) {
    return (
      <div className="container" style={{ margin: '4rem auto 6rem' }}>
        <div className="empty-state">
          <div className="empty-state-icon">
            <ShoppingBag size={36} />
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.85rem', fontWeight: 700, marginBottom: '0.65rem' }}>
            Your Cart is Empty
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '2rem' }}>
            Explore our curated collections of premium electronics, fashion, and lifestyle items.
          </p>
          <button 
            className="btn-primary" 
            style={{ background: 'var(--primary)', color: 'white' }}
            onClick={onNavigateToShop}
          >
            <ArrowLeft size={16} />
            <span>Start Shopping</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ margin: '2.5rem auto 6rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 800 }}>
            Shopping Cart
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Review your {cartCount} selected {cartCount === 1 ? 'item' : 'items'} and proceed to demo checkout.
          </p>
        </div>
        <button
          onClick={clearCart}
          style={{ color: 'var(--danger)', fontSize: '0.88rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}
        >
          <Trash2 size={15} />
          <span>Clear All</span>
        </button>
      </div>

      <div className="checkout-grid">
        {/* Left: Cart Items Table/List */}
        <div>
          <div style={{ background: 'white', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
            <table className="data-table" style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Subtotal</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <img
                          src={item.image_url}
                          alt={item.name}
                          style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}
                        />
                        <div>
                          <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.95rem', maxWidth: 260 }}>
                            {item.name}
                          </div>
                          <span className="brand-badge" style={{ marginTop: 4, display: 'inline-block' }}>
                            {item.category}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontWeight: 600 }}>
                      ${Number(item.price).toFixed(2)}
                    </td>
                    <td>
                      <div className="qty-picker" style={{ height: 32 }}>
                        <button
                          className="qty-btn"
                          style={{ width: 30, height: 32 }}
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus size={14} />
                        </button>
                        <span className="qty-display" style={{ width: 34, fontSize: '0.88rem' }}>
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
                    </td>
                    <td style={{ fontWeight: 700, color: 'var(--primary)' }}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </td>
                    <td>
                      <button
                        className="btn-remove-item"
                        onClick={() => removeFromCart(item.id)}
                        aria-label="Remove item"
                      >
                        <Trash2 size={17} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem' }}>
            <button
              onClick={onNavigateToShop}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', color: 'var(--primary)', fontWeight: 700, fontSize: '0.95rem' }}
            >
              <ArrowLeft size={16} />
              <span>Continue Shopping</span>
            </button>
          </div>
        </div>

        {/* Right: Order Summary Card */}
        <div>
          <div className="checkout-card">
            <h3 className="checkout-card-title">
              <Tag size={18} style={{ color: 'var(--primary)' }} />
              <span>Order Summary</span>
            </h3>

            {/* Promo Code Input */}
            <form onSubmit={handleApplyCoupon} style={{ marginBottom: '1.5rem' }}>
              <label className="form-label" style={{ marginBottom: '0.35rem' }}>Promo Code</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  placeholder="e.g. SAVE10"
                  className="form-input"
                  style={{ textTransform: 'uppercase' }}
                  value={inputCoupon}
                  onChange={(e) => setInputCoupon(e.target.value)}
                  disabled={!!appliedCoupon}
                />
                {appliedCoupon ? (
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="btn-secondary"
                    style={{ background: 'var(--danger-bg)', color: 'var(--danger)', borderColor: '#fca5a5' }}
                  >
                    Remove
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="btn-primary"
                    style={{ background: 'var(--primary)', color: 'white', padding: '0.65rem 1.25rem' }}
                  >
                    Apply
                  </button>
                )}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-light)', marginTop: 4 }}>
                Available demo coupons: <strong>SAVE10</strong> (10% off) or <strong>WELCOME20</strong> (20% off)
              </div>
            </form>

            {/* Breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Subtotal</span>
                <span style={{ fontWeight: 600 }}>${subtotal.toFixed(2)}</span>
              </div>

              {discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', color: 'var(--success)' }}>
                  <span>Discount ({appliedCoupon})</span>
                  <span style={{ fontWeight: 700 }}>-${discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Estimated Tax (8%)</span>
                <span style={{ fontWeight: 600 }}>${tax.toFixed(2)}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Estimated Shipping</span>
                <span>
                  {isFreeShipping ? (
                    <strong style={{ color: 'var(--success)' }}>FREE</strong>
                  ) : (
                    `$${shippingFee.toFixed(2)}`
                  )}
                </span>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '1.35rem',
                fontWeight: 800,
                color: 'var(--text-main)',
                borderTop: '2px solid var(--border-color)',
                paddingTop: '1rem',
                marginTop: '0.5rem'
              }}>
                <span>Total</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <button
              className="btn-checkout"
              style={{ width: '100%', marginTop: '1.75rem' }}
              onClick={onNavigateToCheckout}
              id="cart-proceed-checkout-btn"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={18} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'var(--text-light)', fontSize: '0.8rem', marginTop: '1rem' }}>
              <ShieldCheck size={16} />
              <span>Safe & Secure Checkout • 256-Bit SSL</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
