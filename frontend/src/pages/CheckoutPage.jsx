import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CreditCard, 
  Truck, 
  MapPin, 
  ArrowRight, 
  Lock, 
  AlertCircle, 
  CheckCircle2, 
  LogIn 
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';

export default function CheckoutPage({ promoCode, onOrderSuccess, onNavigateToShop }) {
  const { cartItems, subtotal, clearCart } = useCart();
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const { showToast } = useToast();

  const [address, setAddress] = useState({
    full_name: user?.name || 'Alex Johnson',
    phone: '+1 (555) 234-5678',
    address: '742 Evergreen Terrace',
    city: 'Springfield',
    state: 'OR',
    postal_code: '97477',
    country: 'United States'
  });

  const [shippingMethod, setShippingMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');

  const [submitting, setSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  // Calculations
  const isFreeStandard = subtotal >= 50.0;
  const shippingFee = shippingMethod === 'express' ? 14.99 : (isFreeStandard ? 0.0 : 9.99);

  let discountAmount = 0.0;
  if (promoCode === 'SAVE10' || promoCode === 'SYNTEC10') discountAmount = Number((subtotal * 0.10).toFixed(2));
  if (promoCode === 'WELCOME20') discountAmount = Number((subtotal * 0.20).toFixed(2));

  const subtotalAfterDiscount = Math.max(0, subtotal - discountAmount);
  const tax = Number((subtotalAfterDiscount * 0.08).toFixed(2));
  const grandTotal = Number((subtotalAfterDiscount + tax + shippingFee).toFixed(2));

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      showToast('Please sign in or register to place your order.', 'warning');
      openAuthModal('login');
      return;
    }

    if (cartItems.length === 0) {
      showToast('Your cart is empty!', 'error');
      return;
    }

    // Validate Address
    const errors = {};
    if (!address.full_name) errors.full_name = 'Full recipient name is required.';
    if (!address.phone) errors.phone = 'Phone number is required.';
    if (!address.address) errors.address = 'Street address is required.';
    if (!address.city) errors.city = 'City is required.';
    if (!address.state) errors.state = 'State is required.';
    if (!address.postal_code) errors.postal_code = 'Postal code is required.';
    if (!address.country) errors.country = 'Country is required.';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      showToast('Please complete all required shipping fields.', 'warning');
      return;
    }

    setSubmitting(true);
    setFormErrors({});

    try {
      const orderPayload = {
        items: cartItems.map((item) => ({
          product_id: item.id,
          quantity: item.quantity
        })),
        shipping_address: address,
        payment_method: paymentMethod === 'card' 
          ? 'Credit / Debit Card (Simulated Demo Payment)' 
          : 'Cash on Delivery (Demo)',
        promo_code: promoCode || ''
      };

      const res = await api.post('/orders', orderPayload);
      if (res.success && res.data?.order) {
        showToast('Order confirmed and recorded in database!', 'success');
        clearCart();
        if (onOrderSuccess) {
          onOrderSuccess(res.data.order);
        }
      }
    } catch (err) {
      const msg = err.data?.message || err.message || 'Failed to place order';
      showToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ margin: '2.5rem auto 6rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 800 }}>
          Checkout & Shipping
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Finalize your shipping destination and payment details.
        </p>
      </div>

      {!isAuthenticated && (
        <div style={{
          background: 'var(--warning-bg)',
          border: '1px solid #fde68a',
          borderRadius: 'var(--radius-lg)',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <AlertCircle size={22} style={{ color: '#d97706', flexShrink: 0 }} />
            <div>
              <div style={{ fontWeight: 700, color: '#92400e' }}>Sign In Required to Complete Order</div>
              <div style={{ fontSize: '0.85rem', color: '#b45309' }}>
                Please sign in with your account or use the demo fast-fill button to link orders to your profile.
              </div>
            </div>
          </div>
          <button
            className="btn-primary"
            style={{ background: '#d97706', color: 'white', fontSize: '0.9rem', padding: '0.55rem 1.25rem' }}
            onClick={() => openAuthModal('login')}
          >
            <LogIn size={16} />
            <span>Sign In Now</span>
          </button>
        </div>
      )}

      <form onSubmit={handlePlaceOrder}>
        <div className="checkout-grid">
          {/* Left Column: Shipping & Payment */}
          <div>
            {/* Step 1: Shipping Address */}
            <div className="checkout-card">
              <h3 className="checkout-card-title">
                <MapPin size={20} style={{ color: 'var(--primary)' }} />
                <span>1. Shipping Address</span>
              </h3>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    name="full_name"
                    required
                    className={`form-input ${formErrors.full_name ? 'error' : ''}`}
                    value={address.full_name}
                    onChange={handleAddressChange}
                    placeholder="Recipient name"
                  />
                  {formErrors.full_name && <span className="form-error-msg">{formErrors.full_name}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    className={`form-input ${formErrors.phone ? 'error' : ''}`}
                    value={address.phone}
                    onChange={handleAddressChange}
                    placeholder="+1 (555) 000-0000"
                  />
                  {formErrors.phone && <span className="form-error-msg">{formErrors.phone}</span>}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Street Address *</label>
                <input
                  type="text"
                  name="address"
                  required
                  className={`form-input ${formErrors.address ? 'error' : ''}`}
                  value={address.address}
                  onChange={handleAddressChange}
                  placeholder="Street name, apt or suite"
                />
                {formErrors.address && <span className="form-error-msg">{formErrors.address}</span>}
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">City *</label>
                  <input
                    type="text"
                    name="city"
                    required
                    className={`form-input ${formErrors.city ? 'error' : ''}`}
                    value={address.city}
                    onChange={handleAddressChange}
                    placeholder="City"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">State / Province *</label>
                  <input
                    type="text"
                    name="state"
                    required
                    className={`form-input ${formErrors.state ? 'error' : ''}`}
                    value={address.state}
                    onChange={handleAddressChange}
                    placeholder="State or Province"
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Postal / ZIP Code *</label>
                  <input
                    type="text"
                    name="postal_code"
                    required
                    className={`form-input ${formErrors.postal_code ? 'error' : ''}`}
                    value={address.postal_code}
                    onChange={handleAddressChange}
                    placeholder="e.g. 97477"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Country *</label>
                  <input
                    type="text"
                    name="country"
                    required
                    className={`form-input ${formErrors.country ? 'error' : ''}`}
                    value={address.country}
                    onChange={handleAddressChange}
                    placeholder="Country"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Delivery Method */}
            <div className="checkout-card">
              <h3 className="checkout-card-title">
                <Truck size={20} style={{ color: 'var(--primary)' }} />
                <span>2. Delivery Speed</span>
              </h3>

              <div 
                className={`payment-method-box ${shippingMethod === 'standard' ? 'selected' : ''}`}
                onClick={() => setShippingMethod('standard')}
              >
                <div>
                  <div style={{ fontWeight: 700 }}>Standard Ground Delivery</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Estimated 3-5 Business Days</div>
                </div>
                <strong style={{ color: isFreeStandard ? 'var(--success)' : 'var(--text-main)' }}>
                  {isFreeStandard ? 'FREE' : '$9.99'}
                </strong>
              </div>

              <div 
                className={`payment-method-box ${shippingMethod === 'express' ? 'selected' : ''}`}
                onClick={() => setShippingMethod('express')}
              >
                <div>
                  <div style={{ fontWeight: 700 }}>Express Priority Air</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Guaranteed 1-2 Business Days</div>
                </div>
                <strong>$14.99</strong>
              </div>
            </div>

            {/* Step 3: Payment Details */}
            <div className="checkout-card">
              <h3 className="checkout-card-title">
                <CreditCard size={20} style={{ color: 'var(--primary)' }} />
                <span>3. Payment Method (Demo Simulation)</span>
              </h3>

              <div style={{
                background: '#eff6ff',
                border: '1px solid #bfdbfe',
                borderRadius: 'var(--radius-md)',
                padding: '0.75rem 1rem',
                fontSize: '0.85rem',
                color: '#1e40af',
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <Lock size={16} style={{ flexShrink: 0 }} />
                <span>
                  Demo Mode: No real financial transaction will occur. Test card values are pre-filled for convenience.
                </span>
              </div>

              <div
                className={`payment-method-box ${paymentMethod === 'card' ? 'selected' : ''}`}
                onClick={() => setPaymentMethod('card')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <CreditCard size={18} style={{ color: 'var(--primary)' }} />
                  <span style={{ fontWeight: 700 }}>Credit / Debit Card (Simulated)</span>
                </div>
                <span className="brand-badge">Recommended</span>
              </div>

              {paymentMethod === 'card' && (
                <div style={{ background: 'var(--bg-subtle)', padding: '1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Simulated Card Number</label>
                    <input
                      type="text"
                      className="form-input"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                    />
                  </div>
                  <div className="form-grid-2">
                    <div className="form-group">
                      <label className="form-label">Expires</label>
                      <input
                        type="text"
                        className="form-input"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">CVV</label>
                      <input
                        type="text"
                        className="form-input"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div
                className={`payment-method-box ${paymentMethod === 'cod' ? 'selected' : ''}`}
                onClick={() => setPaymentMethod('cod')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <CheckCircle2 size={18} style={{ color: 'var(--text-muted)' }} />
                  <span style={{ fontWeight: 700 }}>Cash on Delivery</span>
                </div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Pay upon parcel arrival</span>
              </div>
            </div>
          </div>

          {/* Right Column: Order Review & Placement */}
          <div>
            <div className="checkout-card" style={{ position: 'sticky', top: 'calc(var(--header-height) + 1.5rem)' }}>
              <h3 className="checkout-card-title">Order Items ({cartItems.length})</h3>

              <div style={{ maxHeight: 240, overflowY: 'auto', marginBottom: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {cartItems.map((item) => (
                  <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.88rem' }}>
                    <img
                      src={item.image_url}
                      alt={item.name}
                      style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.name}
                      </div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                        Qty: {item.quantity} × ${Number(item.price).toFixed(2)}
                      </div>
                    </div>
                    <div style={{ fontWeight: 700 }}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem', fontSize: '0.92rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                  <span>Subtotal</span>
                  <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>${subtotal.toFixed(2)}</span>
                </div>

                {discountAmount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--success)' }}>
                    <span>Promo Discount ({promoCode})</span>
                    <span style={{ fontWeight: 700 }}>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                  <span>Estimated Tax (8%)</span>
                  <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>${tax.toFixed(2)}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                  <span>Shipping Fee</span>
                  <span>
                    {shippingFee === 0 ? (
                      <strong style={{ color: 'var(--success)' }}>FREE</strong>
                    ) : (
                      `$${shippingFee.toFixed(2)}`
                    )}
                  </span>
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '1.4rem',
                  fontWeight: 800,
                  color: 'var(--text-main)',
                  borderTop: '2px solid var(--border-color)',
                  paddingTop: '0.85rem',
                  marginTop: '0.4rem'
                }}>
                  <span>Total Amount</span>
                  <span>${grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="submit"
                className="btn-checkout"
                style={{ width: '100%', marginTop: '1.5rem' }}
                disabled={submitting || cartItems.length === 0}
                id="place-order-btn"
              >
                <ShieldCheck size={18} />
                <span>{submitting ? 'Validating & Placing Order...' : `Place Order ($${grandTotal.toFixed(2)})`}</span>
              </button>

              <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-light)' }}>
                By placing this demo order, stock quantities will be updated in MongoDB and a real order confirmation will be generated.
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
