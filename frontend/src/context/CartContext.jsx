import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useToast } from './ToastContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('syntec_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { showToast } = useToast();

  // Save to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem('syntec_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.warn('Failed to save cart to localStorage', e);
    }
  }, [cartItems]);

  const addToCart = useCallback((product, qty = 1) => {
    const productId = product.id || product._id;
    const maxStock = product.stock !== undefined ? product.stock : 99;

    setCartItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === productId);

      if (existingIndex > -1) {
        const currentQty = prev[existingIndex].quantity;
        const newQty = currentQty + qty;

        if (newQty > maxStock) {
          showToast(`Only ${maxStock} items available in stock!`, 'warning');
          return prev;
        }

        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty
        };
        showToast(`Updated "${product.name}" quantity (${newQty})`, 'success');
        return updated;
      } else {
        if (qty > maxStock) {
          showToast(`Only ${maxStock} items available in stock!`, 'warning');
          return prev;
        }

        const newItem = {
          id: productId,
          name: product.name,
          price: Number(product.price),
          original_price: Number(product.original_price || product.price),
          discount: Number(product.discount || 0),
          image_url: product.image_url,
          category: product.category,
          stock: maxStock,
          quantity: qty
        };

        showToast(`Added "${product.name}" to your cart!`, 'success');
        return [...prev, newItem];
      }
    });
  }, [showToast]);

  const removeFromCart = useCallback((productId) => {
    setCartItems((prev) => {
      const item = prev.find((i) => i.id === productId);
      if (item) {
        showToast(`Removed "${item.name}" from cart`, 'info');
      }
      return prev.filter((i) => i.id !== productId);
    });
  }, [showToast]);

  const updateQuantity = useCallback((productId, qty) => {
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems((prev) => {
      return prev.map((item) => {
        if (item.id === productId) {
          if (qty > item.stock) {
            showToast(`Cannot exceed available stock (${item.stock})`, 'warning');
            return { ...item, quantity: item.stock };
          }
          return { ...item, quantity: qty };
        }
        return item;
      });
    });
  }, [removeFromCart, showToast]);

  const clearCart = useCallback(() => {
    setCartItems([]);
    localStorage.removeItem('syntec_cart');
  }, []);

  const openDrawer = useCallback(() => setIsDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartCount,
    subtotal: Number(subtotal.toFixed(2)),
    isDrawerOpen,
    openDrawer,
    closeDrawer
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
