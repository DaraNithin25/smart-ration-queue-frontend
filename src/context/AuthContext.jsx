import React, { createContext, useContext, useState, useEffect } from 'react';
import * as authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => authService.getCurrentUser());
  const [token, setToken] = useState(() => authService.getToken());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = authService.getToken();
    const storedUser = authService.getCurrentUser();

    if (storedToken && storedUser) {
      setUser(storedUser);
      setToken(storedToken);
    } else {
      setUser(null);
      setToken(null);
    }
    setLoading(false);

    const handleSessionExpiry = () => {
      setUser(null);
      setToken(null);
    };

    window.addEventListener('srq-session-expired', handleSessionExpiry);
    return () => {
      window.removeEventListener('srq-session-expired', handleSessionExpiry);
    };
  }, []);

  const login = async (mobile, password) => {
    const result = await authService.login(mobile, password);
    setToken(result.token);
    setUser(result.user);
    return result;
  };

  const register = async (name, mobile, password, cardNumber = '', shopCode = '') => {
    const result = await authService.register(name, mobile, password, cardNumber, shopCode);
    if (result.token && result.user) {
      setToken(result.token);
      setUser(result.user);
    }
    return result;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
