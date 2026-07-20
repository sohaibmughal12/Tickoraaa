import React, { createContext, useState, useEffect } from 'react';
import API from '../services/api.js';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user data on startup
  useEffect(() => {
    const storedToken = localStorage.getItem('tickora_token');
    const storedUser = localStorage.getItem('tickora_user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      
      // Sync user profile from backend on app load (runs in background)
      API.get('/auth/profile')
        .then((res) => {
          const freshUser = res.data.data;
          setUser(freshUser);
          localStorage.setItem('tickora_user', JSON.stringify(freshUser));
        })
        .catch((err) => {
          console.error('Failed to sync profile. Token might have expired:', err.message);
          logout();
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  // Login handler
  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await API.post('/auth/login', { email, password });
      const { token: userToken, ...userData } = res.data.data;
      
      setToken(userToken);
      setUser(userData);
      localStorage.setItem('tickora_token', userToken);
      localStorage.setItem('tickora_user', JSON.stringify(userData));
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      const msg = error.response?.data?.message || 'Login failed. Please check credentials.';
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  // Registration handler
  const signup = async (name, email, password) => {
    setLoading(true);
    try {
      const res = await API.post('/auth/signup', { name, email, password });
      const { token: userToken, ...userData } = res.data.data;
      
      setToken(userToken);
      setUser(userData);
      localStorage.setItem('tickora_token', userToken);
      localStorage.setItem('tickora_user', JSON.stringify(userData));
      
      return { success: true };
    } catch (error) {
      console.error('Signup error:', error);
      const msg = error.response?.data?.message || 'Signup failed. Please try again.';
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  // Update profile handler
  const updateProfile = async (profileData) => {
    try {
      const res = await API.put('/auth/profile', profileData);
      const { token: userToken, ...userData } = res.data.data;
      
      if (userToken) {
        setToken(userToken);
        localStorage.setItem('tickora_token', userToken);
      }
      setUser(userData);
      localStorage.setItem('tickora_user', JSON.stringify(userData));
      return { success: true };
    } catch (error) {
      console.error('Profile update error:', error);
      const msg = error.response?.data?.message || 'Update failed.';
      return { success: false, message: msg };
    }
  };

  // Logout handler
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('tickora_token');
    localStorage.removeItem('tickora_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        signup,
        logout,
        updateProfile,
        isAdmin: user?.role === 'admin'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
