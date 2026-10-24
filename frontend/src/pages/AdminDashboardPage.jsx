import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  DollarSign, 
  ShoppingBag, 
  Package, 
  Users, 
  Plus, 
  Edit3, 
  Trash2, 
  Search, 
  CheckCircle, 
  AlertTriangle,
  RotateCcw,
  LogIn
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import AdminProductModal from '../components/AdminProductModal';
import api from '../services/api';

export default function AdminDashboardPage() {
  const { user, isAuthenticated, isAdmin, openAuthModal } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('products');
  const [stats, setStats] = useState({
    total_sales: 0,
    total_orders: 0,
    total_products: 0,
    total_customers: 0
  });

  // Data lists
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Modals
  const [productSearch, setProductSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Delete confirm modal state
  const [deletingProductId, setDeletingProductId] = useState(null);

  const fetchDashboardData = async () => {
    if (!isAdmin) return;
    setLoading(true);
    try {
      // 1. Fetch Summary Stats
      const statsRes = await api.get('/admin/dashboard');
      if (statsRes.success && statsRes.data?.stats) {
        setStats(statsRes.data.stats);
      }

      // 2. Fetch Products
      const prodsRes = await api.get('/products', { limit: 100 });
      if (prodsRes.success && prodsRes.data?.products) {
        setProducts(prodsRes.data.products);
      }

      // 3. Fetch Orders
      const ordersRes = await api.get('/admin/orders');
      if (ordersRes.success && ordersRes.data?.orders) {
        setOrders(ordersRes.data.orders);
      }

      // 4. Fetch Users
      const usersRes = await api.get('/admin/users');
      if (usersRes.success && usersRes.data?.users) {
        setCustomers(usersRes.data.users);
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
      showToast('Error loading dashboard analytics', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [isAdmin]);

  // Auth Guards
  if (!isAuthenticated) {
    return (
      <div className="container" style={{ margin: '4rem auto 6rem' }}>
        <div className="empty-state">
          <div className="empty-state-icon">
            <ShieldCheck size={36} />
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.85rem', fontWeight: 700, marginBottom: '0.65rem' }}>
            Administrator Access Required
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.75rem' }}>
            Please log in with the Administrator account credentials to access this management console.
          </p>
          <button
            className="btn-primary"
            style={{ background: 'var(--primary)', color: 'white' }}
            onClick={() => openAuthModal('login')}
          >
            <LogIn size={16} />
            <span>Admin Login</span>
          </button>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container" style={{ margin: '4rem auto 6rem' }}>
        <div className="empty-state" style={{ borderColor: 'var(--danger)' }}>
          <div className="empty-state-icon" style={{ background: 'var(--danger-bg)', color: 'var(--danger)' }}>
            <AlertTriangle size={36} />
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.85rem', fontWeight: 700, color: 'var(--danger)', marginBottom: '0.65rem' }}>
            403 Forbidden • Access Denied
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.75rem' }}>
            Your account ({user.email}) does not possess the administrator role privileges. Log in as <strong>admin@syntecxhub.com</strong> to administer products and orders.
          </p>
        </div>
      </div>
    );
  }

  // Handle Product Actions
  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setIsProductModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setIsProductModalOpen(true);
  };

  const handleDeleteProduct = async (id) => {
    try {
      const res = await api.delete(`/products/${id}`);
      if (res.success) {
        showToast('Product deleted from database successfully', 'success');
        setDeletingProductId(null);
        fetchDashboardData();
      }
    } catch (err) {
      showToast(err.message || 'Failed to delete product', 'error');
    }
  };

  // Handle Order Status Change
  const handleOrderStatusChange = async (orderId, newStatus) => {
    try {
      const res = await api.put(`/admin/orders/${orderId}/status`, { status: newStatus });
      if (res.success) {
        showToast(`Order status updated to "${newStatus}"`, 'success');
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, order_status: newStatus } : o))
        );
      }
    } catch (err) {
      showToast(err.message || 'Failed to update order status', 'error');
    }
  };

  // Filtered views
  const filteredProducts = products.filter((p) =>
    p.name?.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.category?.toLowerCase().includes(productSearch.toLowerCase())
  );

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.id?.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customer_name?.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customer_email?.toLowerCase().includes(orderSearch.toLowerCase());

    const matchesStatus =
      orderStatusFilter === 'all' || o.order_status === orderStatusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="container admin-container">
      {/* Header */}
      <div className="admin-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-purple)', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.25rem' }}>
            <ShieldCheck size={18} />
            <span>SYNTECXHUB BACKOFFICE CONSOLE</span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.4rem', fontWeight: 800 }}>
            Admin Dashboard
          </h1>
        </div>

        <button
          className="btn-primary"
          style={{ background: 'var(--primary)', color: 'white', padding: '0.75rem 1.5rem' }}
          onClick={handleOpenAddModal}
          id="admin-add-product-btn"
        >
          <Plus size={18} />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Analytics KPI Stat Cards */}
      <div className="admin-stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#ecfdf5', color: '#059669' }}>
            <DollarSign size={26} />
          </div>
          <div>
            <div className="stat-val">${stats.total_sales.toFixed(2)}</div>
            <div className="stat-label">Total Revenue</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#e0e7ff', color: '#4338ca' }}>
            <Package size={26} />
          </div>
          <div>
            <div className="stat-val">{stats.total_orders}</div>
            <div className="stat-label">Total Orders Placed</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fef3c7', color: '#d97706' }}>
            <ShoppingBag size={26} />
          </div>
          <div>
            <div className="stat-val">{stats.total_products}</div>
            <div className="stat-label">Products in Catalog</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#ede9fe', color: '#7c3aed' }}>
            <Users size={26} />
          </div>
          <div>
            <div className="stat-val">{stats.total_customers}</div>
            <div className="stat-label">Registered Customers</div>
          </div>
        </div>
      </div>

      {/* Nav Tabs */}
      <div className="admin-nav-tabs">
        <button
          className={`admin-tab-btn ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
          id="admin-tab-products"
        >
          Product Catalog ({products.length})
        </button>
        <button
          className={`admin-tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
          id="admin-tab-orders"
        >
          Customer Orders ({orders.length})
        </button>
        <button
          className={`admin-tab-btn ${activeTab === 'customers' ? 'active' : ''}`}
          onClick={() => setActiveTab('customers')}
          id="admin-tab-customers"
        >
          Customers Directory ({customers.length})
        </button>
      </div>

      {/* TAB 1: PRODUCT MANAGEMENT */}
      {activeTab === 'products' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', width: 340 }}>
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder="Search products by title or category..."
                className="search-input"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
              />
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Showing {filteredProducts.length} of {products.length} products
            </div>
          </div>

          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Rating</th>
                  <th>Featured</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                        <img
                          src={p.image_url}
                          alt={p.name}
                          style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                        />
                        <div style={{ fontWeight: 700, maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {p.name}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="brand-badge">{p.category}</span>
                    </td>
                    <td style={{ fontWeight: 700 }}>
                      ${Number(p.price).toFixed(2)}
                    </td>
                    <td>
                      {p.stock <= 5 ? (
                        <span style={{ color: 'var(--danger)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                          <AlertTriangle size={14} />
                          {p.stock} units
                        </span>
                      ) : (
                        <span style={{ fontWeight: 600 }}>{p.stock} units</span>
                      )}
                    </td>
                    <td>★ {p.rating ? p.rating.toFixed(1) : '4.5'}</td>
                    <td>{p.is_featured ? <span style={{ color: 'var(--success)', fontWeight: 700 }}>Yes</span> : 'No'}</td>
                    <td>
                      <div className="action-btn-group">
                        <button
                          className="btn-action-icon"
                          title="Edit product"
                          onClick={() => handleOpenEditModal(p)}
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          className="btn-action-icon delete"
                          title="Delete product"
                          onClick={() => setDeletingProductId(p.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: ORDER MANAGEMENT */}
      {activeTab === 'orders' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', gap: '0.85rem', flex: 1, maxWidth: 600 }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Search size={18} className="search-icon" />
                <input
                  type="text"
                  placeholder="Search by customer name, email, or order ID..."
                  className="search-input"
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                />
              </div>

              <select
                className="sort-select"
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
              >
                <option value="all">All Order Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Showing {filteredOrders.length} orders
            </div>
          </div>

          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order Reference</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total Amount</th>
                  <th>Fulfillment Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((ord) => (
                  <tr key={ord.id}>
                    <td>
                      <div style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.85rem' }}>
                        {ord.id}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 700 }}>{ord.customer_name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{ord.customer_email}</div>
                    </td>
                    <td>
                      <span style={{ fontWeight: 600 }}>{ord.items?.length || 0} items</span>
                    </td>
                    <td style={{ fontWeight: 800, color: 'var(--text-main)' }}>
                      ${Number(ord.total_amount).toFixed(2)}
                    </td>
                    <td>
                      <select
                        value={ord.order_status}
                        onChange={(e) => handleOrderStatusChange(ord.id, e.target.value)}
                        className="sort-select"
                        style={{
                          fontSize: '0.82rem',
                          padding: '0.35rem 0.65rem',
                          fontWeight: 700,
                          borderRadius: 'var(--radius-full)'
                        }}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {new Date(ord.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: CUSTOMER DIRECTORY */}
      {activeTab === 'customers' && (
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Customer Name</th>
                <th>Email Address</th>
                <th>Role</th>
                <th>Orders Placed</th>
                <th>Joined Date</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id}>
                  <td style={{ fontWeight: 700 }}>{c.name}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{c.email}</td>
                  <td>
                    <span className="dropdown-role-tag" style={{ margin: 0 }}>
                      {c.role}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600 }}>{c.orders_count || 0}</td>
                  <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {new Date(c.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Product Add/Edit Modal */}
      <AdminProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        productToEdit={editingProduct}
        onSaved={fetchDashboardData}
      />

      {/* Delete Confirmation Modal */}
      {deletingProductId && (
        <div className="modal-backdrop" onClick={() => setDeletingProductId(null)}>
          <div className="modal-card" style={{ maxWidth: 440 }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--danger)' }}>
              Confirm Product Deletion
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '1.5rem' }}>
              Are you sure you want to delete this product? This action will permanently remove it from MongoDB and the store catalog.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button
                className="btn-secondary"
                style={{ color: 'var(--text-main)', border: '1px solid var(--border-color)', background: 'var(--bg-subtle)' }}
                onClick={() => setDeletingProductId(null)}
              >
                Cancel
              </button>
              <button
                className="btn-primary"
                style={{ background: 'var(--danger)', color: 'white' }}
                onClick={() => handleDeleteProduct(deletingProductId)}
                id="confirm-delete-product-btn"
              >
                Delete Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
