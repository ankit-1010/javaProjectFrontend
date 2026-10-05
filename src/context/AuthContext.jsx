import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { getAuthToken, setAuthToken, getStoredUser, setStoredUser, clearAuthSession } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Check stored authenticated session from localStorage
  const [currentUser, setCurrentUser] = useState(() => {
    const token = getAuthToken();
    const stored = getStoredUser();
    if (token && stored) {
      return stored;
    }
    return null;
  });

  const [loadingSession, setLoadingSession] = useState(false);

  const [notifications, setNotifications] = useState([
    { id: 1, text: 'Welcome to MapFinance! Track your expenses with ease.', time: 'Just now', unread: true }
  ]);

  const isAdmin = currentUser?.role?.toUpperCase() === 'ADMIN';
  const isAuthenticated = !!currentUser;

  const login = async (email, password) => {
    const res = await authService.login(email, password);
    if (res.token && res.user) {
      setAuthToken(res.token);
      setStoredUser(res.user);
      setCurrentUser(res.user);
      return { success: true, user: res.user };
    }
    return { success: false, message: res.message || 'Login failed' };
  };

  const adminLogin = async (email, password) => {
    const res = await authService.adminLogin(email, password);
    if (res.token && res.user) {
      setAuthToken(res.token);
      setStoredUser(res.user);
      setCurrentUser(res.user);
      return { success: true, user: res.user };
    }
    return { success: false, message: res.message || 'Admin authentication failed' };
  };

  const register = async (fullName, email, password, phone) => {
    const res = await authService.register(fullName, email, password, phone);
    if (res.token && res.user) {
      setAuthToken(res.token);
      setStoredUser(res.user);
      setCurrentUser(res.user);
      return { success: true, user: res.user };
    }
    return { success: false, message: res.message || 'Registration failed' };
  };

  const logout = () => {
    clearAuthSession();
    setCurrentUser(null);
  };

  const updateCurrentUser = (updatedUser) => {
    const merged = { ...currentUser, ...updatedUser };
    setStoredUser(merged);
    setCurrentUser(merged);
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      currentAdmin: isAdmin ? currentUser : null,
      isAdmin,
      isAuthenticated,
      loadingSession,
      notifications,
      setNotifications,
      login,
      adminLogin,
      register,
      logout,
      setCurrentUser: updateCurrentUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
