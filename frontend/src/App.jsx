import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import AuthModal from './components/AuthModal';

import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import MyOrdersPage from './pages/MyOrdersPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';

import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

function MainApp() {
  const [currentRoute, setCurrentRoute] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [placedOrder, setPlacedOrder] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [promoCode, setPromoCode] = useState('');

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentRoute('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewProductDetails = (product) => {
    setSelectedProduct(product);
    setCurrentRoute('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOrderSuccess = (order) => {
    setPlacedOrder(order);
    setCurrentRoute('order-success');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Navbar
        currentRoute={currentRoute}
        setCurrentRoute={setCurrentRoute}
        onSearch={handleSearch}
      />

      <main className="main-content">
        {currentRoute === 'home' && (
          <HomePage
            setCurrentRoute={setCurrentRoute}
            setSelectedCategory={setSelectedCategory}
            onViewProductDetails={handleViewProductDetails}
          />
        )}

        {currentRoute === 'shop' && (
          <ShopPage
            initialSearch={searchQuery}
            initialCategory={selectedCategory}
            onViewProductDetails={handleViewProductDetails}
          />
        )}

        {currentRoute === 'product-detail' && (
          <ProductDetailPage
            product={selectedProduct}
            onBackToShop={() => setCurrentRoute('shop')}
            onNavigateToCheckout={() => setCurrentRoute('checkout')}
            onViewProductDetails={handleViewProductDetails}
          />
        )}

        {currentRoute === 'cart' && (
          <CartPage
            onNavigateToShop={() => setCurrentRoute('shop')}
            onNavigateToCheckout={() => setCurrentRoute('checkout')}
            promoCode={promoCode}
            setPromoCode={setPromoCode}
          />
        )}

        {currentRoute === 'checkout' && (
          <CheckoutPage
            promoCode={promoCode}
            onOrderSuccess={handleOrderSuccess}
            onNavigateToShop={() => setCurrentRoute('shop')}
          />
        )}

        {currentRoute === 'order-success' && (
          <OrderSuccessPage
            order={placedOrder}
            onNavigateToOrders={() => setCurrentRoute('orders')}
            onNavigateToShop={() => setCurrentRoute('shop')}
          />
        )}

        {currentRoute === 'orders' && (
          <MyOrdersPage
            onNavigateToShop={() => setCurrentRoute('shop')}
          />
        )}

        {currentRoute === 'admin' && (
          <AdminDashboardPage />
        )}

        {currentRoute === 'about' && (
          <AboutPage
            onNavigateToShop={() => setCurrentRoute('shop')}
          />
        )}

        {currentRoute === 'contact' && (
          <ContactPage />
        )}
      </main>

      {/* Global Shopping Cart Side Drawer */}
      <CartDrawer
        onNavigateToCheckout={() => setCurrentRoute('checkout')}
        onNavigateToCart={() => setCurrentRoute('cart')}
      />

      {/* Global Auth Modal for Login & Register */}
      <AuthModal />

      <Footer setCurrentRoute={setCurrentRoute} />
    </>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <MainApp />
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
