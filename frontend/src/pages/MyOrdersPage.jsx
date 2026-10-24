import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Clock, 
  MapPin, 
  ChevronRight, 
  ShoppingBag, 
  LogIn, 
  CheckCircle2, 
  Truck, 
  Box, 
  AlertCircle 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function MyOrdersPage({ onNavigateToShop }) {
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    async function loadOrders() {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const res = await api.get('/orders/my-orders');
        if (res.success && res.data?.orders) {
          setOrders(res.data.orders);
        }
      } catch (err) {
        console.error('Failed to load user orders:', err);
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="container" style={{ margin: '4rem auto 6rem' }}>
        <div className="empty-state">
          <div className="empty-state-icon">
            <LogIn size={36} />
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.85rem', fontWeight: 700, marginBottom: '0.65rem' }}>
            Sign In to View Your Orders
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.75rem' }}>
            Please sign in with your account or use the demo fast-fill button to view your order history and track shipments.
          </p>
          <button
            className="btn-primary"
            style={{ background: 'var(--primary)', color: 'white' }}
            onClick={() => openAuthModal('login')}
          >
            Sign In Now
          </button>
        </div>
      </div>
    );
  }

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return 'status-delivered';
      case 'shipped': return 'status-shipped';
      case 'processing': return 'status-processing';
      case 'cancelled': return 'status-cancelled';
      default: return 'status-pending';
    }
  };

  const getStepProgress = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return 4;
      case 'shipped': return 3;
      case 'processing': return 2;
      case 'cancelled': return 0;
      default: return 1;
    }
  };

  return (
    <div className="container" style={{ margin: '2.5rem auto 6rem', maxWidth: 960 }}>
      <div style={{ marginBottom: '2.25rem' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 800 }}>
          My Order History
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Track past purchases, view order details, and check real-time fulfillment statuses.
        </p>
      </div>

      {loading ? (
        <div className="loading-spinner"></div>
      ) : orders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <Package size={36} />
          </div>
          <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>No Orders Placed Yet</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
            You haven't completed any purchases with this account. Browse our catalog and place your first demo order!
          </p>
          <button
            className="btn-primary"
            style={{ background: 'var(--primary)', color: 'white' }}
            onClick={onNavigateToShop}
          >
            <ShoppingBag size={16} />
            <span>Start Shopping</span>
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {orders.map((order) => {
            const step = getStepProgress(order.order_status);
            const isCancelled = order.order_status?.toLowerCase() === 'cancelled';

            return (
              <div key={order.id} className="order-card" id={`order-card-${order.id}`}>
                <div className="order-header">
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Order Placed on {new Date(order.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </div>
                    <div className="order-id-tag">
                      ID: {order.id}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span className={`badge-status ${getStatusClass(order.order_status)}`}>
                      {order.order_status}
                    </span>
                    <strong style={{ fontSize: '1.25rem', color: 'var(--text-main)' }}>
                      ${Number(order.total_amount).toFixed(2)}
                    </strong>
                  </div>
                </div>

                {/* Tracking Progress Timeline Bar */}
                {!isCancelled && (
                  <div style={{ padding: '0.5rem 0 1.25rem', borderBottom: '1px solid var(--border-color)', marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', margin: '0 1rem' }}>
                      <div style={{
                        position: 'absolute',
                        top: 14,
                        left: 0,
                        right: 0,
                        height: 3,
                        background: '#e2e8f0',
                        zIndex: 1
                      }}>
                        <div style={{
                          width: `${((step - 1) / 3) * 100}%`,
                          height: '100%',
                          background: 'var(--primary)',
                          transition: 'width 0.4s ease'
                        }} />
                      </div>

                      {[
                        { num: 1, label: 'Order Placed', icon: Box },
                        { num: 2, label: 'Processing', icon: Clock },
                        { num: 3, label: 'Shipped', icon: Truck },
                        { num: 4, label: 'Delivered', icon: CheckCircle2 }
                      ].map((s) => {
                        const Icon = s.icon;
                        const isDone = step >= s.num;
                        return (
                          <div key={s.num} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 2 }}>
                            <div style={{
                              width: 30,
                              height: 30,
                              borderRadius: '50%',
                              background: isDone ? 'var(--primary)' : 'white',
                              color: isDone ? 'white' : 'var(--text-light)',
                              border: `2px solid ${isDone ? 'var(--primary)' : '#e2e8f0'}`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              marginBottom: 4
                            }}>
                              <Icon size={14} />
                            </div>
                            <span style={{ fontSize: '0.75rem', fontWeight: isDone ? 700 : 500, color: isDone ? 'var(--text-main)' : 'var(--text-light)' }}>
                              {s.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Items in this Order */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {order.items?.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                        <img
                          src={item.image_url}
                          alt={item.name}
                          style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
                        />
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{item.name}</div>
                          <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                            Qty: {item.quantity} × ${Number(item.price).toFixed(2)}
                          </div>
                        </div>
                      </div>
                      <div style={{ fontWeight: 700 }}>
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Shipping Destination Footer */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <MapPin size={15} style={{ color: 'var(--primary)' }} />
                    <span>
                      Shipping to: <strong>{order.shipping_address?.full_name}</strong> ({order.shipping_address?.city}, {order.shipping_address?.country})
                    </span>
                  </div>
                  <div>
                    Payment: <strong>{order.payment_method}</strong>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
