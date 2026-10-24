import React from 'react';
import { CheckCircle2, Package, Truck, ArrowRight, ShoppingBag, Copy, Check } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export default function OrderSuccessPage({ order, onNavigateToOrders, onNavigateToShop }) {
  const { showToast } = useToast();
  const [copied, setCopied] = React.useState(false);

  if (!order) {
    return (
      <div className="container" style={{ margin: '4rem auto', textAlign: 'center' }}>
        <h2>No Order Details Found</h2>
        <button className="btn-primary" onClick={onNavigateToShop} style={{ marginTop: '1rem', background: 'var(--primary)', color: 'white' }}>
          Go to Shop
        </button>
      </div>
    );
  }

  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(order.id);
    setCopied(true);
    showToast('Order ID copied to clipboard!', 'info');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="container" style={{ margin: '3rem auto 6rem', maxWidth: 780 }}>
      <div style={{
        background: 'white',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-xl)',
        padding: '3rem 2.5rem',
        boxShadow: 'var(--shadow-lg)',
        textAlign: 'center'
      }}>
        {/* Success Icon */}
        <div style={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: 'var(--success-bg)',
          color: 'var(--success)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem',
          boxShadow: '0 0 0 10px rgba(16, 185, 129, 0.12)'
        }}>
          <CheckCircle2 size={44} />
        </div>

        <span className="badge-status status-processing" style={{ display: 'inline-block', marginBottom: '0.75rem' }}>
          {order.order_status || 'Processing'}
        </span>

        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.4rem', fontWeight: 800, marginBottom: '0.65rem' }}>
          Thank You! Your Order is Confirmed
        </h1>

        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: 540, margin: '0 auto 2rem' }}>
          We have received your order and stored it in MongoDB. A confirmation email has been dispatched to <strong>{order.customer_email}</strong>.
        </p>

        {/* Order Reference Box */}
        <div style={{
          background: 'var(--bg-subtle)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          padding: '1rem 1.5rem',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '2.5rem'
        }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Order Reference ID</div>
            <div style={{ fontFamily: 'monospace', fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {order.id}
            </div>
          </div>
          <button
            onClick={handleCopyOrderId}
            style={{ padding: '0.45rem', borderRadius: 'var(--radius-sm)', background: 'white', border: '1px solid var(--border-color)' }}
            title="Copy ID"
          >
            {copied ? <Check size={16} color="var(--success)" /> : <Copy size={16} />}
          </button>
        </div>

        {/* Shipping & Delivery Preview */}
        <div style={{
          textAlign: 'left',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.75rem',
          marginBottom: '2rem',
          background: '#fafafa'
        }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Truck size={18} style={{ color: 'var(--primary)' }} />
            <span>Delivery Destination</span>
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', fontSize: '0.92rem' }}>
            <div>
              <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{order.shipping_address?.full_name}</div>
              <div style={{ color: 'var(--text-muted)' }}>{order.shipping_address?.address}</div>
              <div style={{ color: 'var(--text-muted)' }}>
                {order.shipping_address?.city}, {order.shipping_address?.state} {order.shipping_address?.postal_code}
              </div>
              <div style={{ color: 'var(--text-muted)' }}>{order.shipping_address?.country}</div>
              <div style={{ color: 'var(--text-muted)', marginTop: 4 }}>Phone: {order.shipping_address?.phone}</div>
            </div>

            <div>
              <div style={{ color: 'var(--text-muted)' }}>Payment Method:</div>
              <strong style={{ color: 'var(--text-main)' }}>{order.payment_method}</strong>
              <div style={{ marginTop: '0.65rem', color: 'var(--text-muted)' }}>Estimated Delivery:</div>
              <strong style={{ color: 'var(--success)' }}>3-5 Business Days</strong>
            </div>
          </div>
        </div>

        {/* Order Items Review */}
        <div style={{ textAlign: 'left', marginBottom: '2.5rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem' }}>Purchased Items</h3>
          <div style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
            {order.items?.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', borderBottom: idx < order.items.length - 1 ? '1px solid var(--border-color)' : 'none', background: 'white' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <img src={item.image_url} alt={item.name} style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{item.name}</div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Qty: {item.quantity} × ${Number(item.price).toFixed(2)}</div>
                  </div>
                </div>
                <div style={{ fontWeight: 800 }}>${(item.price * item.quantity).toFixed(2)}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem', fontSize: '1.25rem', fontWeight: 800 }}>
            <span>Total Paid: ${Number(order.total_amount).toFixed(2)}</span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            className="btn-primary"
            style={{ background: 'var(--primary)', color: 'white', padding: '0.85rem 1.75rem' }}
            onClick={onNavigateToOrders}
            id="success-view-orders-btn"
          >
            <Package size={18} />
            <span>View in My Orders</span>
          </button>

          <button
            className="btn-secondary"
            style={{ color: 'var(--text-main)', border: '1px solid var(--border-color)', padding: '0.85rem 1.75rem' }}
            onClick={onNavigateToShop}
            id="success-continue-shopping-btn"
          >
            <ShoppingBag size={18} />
            <span>Continue Shopping</span>
          </button>
        </div>
      </div>
    </div>
  );
}
