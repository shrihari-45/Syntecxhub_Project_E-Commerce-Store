import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('shophub_token') || localStorage.getItem('syntec_token'));
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login'); // 'login' | 'register'
  const { showToast } = useToast();

  const openAuthModal = useCallback((mode = 'login') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setAuthModalOpen(false);
  }, []);

  // Hydrate user from backend token on mount
  useEffect(() => {
    async function loadUser() {
      const storedToken = localStorage.getItem('shophub_token') || localStorage.getItem('syntec_token');
      if (!storedToken) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const response = await api.get('/auth/me');
        if (response.success && response.data?.user) {
          setUser(response.data.user);
        } else {
          // Token invalid or user not found
          localStorage.removeItem('shophub_token');
          localStorage.removeItem('syntec_token');
          setToken(null);
          setUser(null);
        }
      } catch (err) {
        console.warn('Failed to hydrate user session:', err);
        localStorage.removeItem('shophub_token');
        localStorage.removeItem('syntec_token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.success && res.data) {
        const { user: userData, token: jwtToken } = res.data;
        localStorage.setItem('shophub_token', jwtToken);
        setToken(jwtToken);
        setUser(userData);
        showToast(`Welcome back, ${userData.name}!`, 'success');
        closeAuthModal();
        return { success: true };
      }
    } catch (err) {
      const errorMsg = err.data?.message || err.message || 'Login failed';
      showToast(errorMsg, 'error');
      return { success: false, message: errorMsg };
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await api.post('/auth/register', { name, email, password });
      if (res.success && res.data) {
        const { user: userData, token: jwtToken } = res.data;
        localStorage.setItem('shophub_token', jwtToken);
        setToken(jwtToken);
        setUser(userData);
        showToast(`Welcome to ShopHub, ${userData.name}!`, 'success');
        closeAuthModal();
        return { success: true };
      }
    } catch (err) {
      const errorMsg = err.data?.message || err.message || 'Registration failed';
      showToast(errorMsg, 'error');
      return { success: false, message: errorMsg };
    }
  };

  const logout = () => {
    localStorage.removeItem('shophub_token');
    localStorage.removeItem('syntec_token');
    setToken(null);
    setUser(null);
    showToast('You have been logged out successfully.', 'info');
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout,
    authModalOpen,
    authModalMode,
    openAuthModal,
    closeAuthModal,
    setAuthModalMode
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
