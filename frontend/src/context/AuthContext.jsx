import React, {createContext, useState, useEffect} from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await api.get('/users/profile');
          if (response.data && response.data.success) {
            setUser(response.data.data);
          }
        } 
        catch (error) {
          console.error('Boot authorization fetch failed:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };

    initializeAuth();

    const handleAuthExpired = () => {
      setUser(null);
    };
    window.addEventListener('auth-expired', handleAuthExpired);
    return () => window.removeEventListener('auth-expired', handleAuthExpired);
  }, []);

  //  1.login
  const login = async (email, password) => {
    try {
      const response = await api.post('/users/login', {email,password});
      if (response.data && response.data.success) {
        const { token, ...profile } = response.data.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(profile));
        setUser(profile);
        return { success: true, user: profile };
      }
      return { success: false, error: response.data.message || 'Login failed' };
    } catch (error) {
      const message = error.response?.data?.message || 'Network error during login';
      return { success: false, error: message };
    }
  };

  // 2.Registration
  const register = async (userData) => {
    try {
      const response = await api.post('/users/register', userData);
      if (response.data && response.data.success) {
        const { token, ...profile } = response.data.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(profile));
        setUser(profile);
        return { success: true, user: profile };
      }
      return {success: false, error: response.data.message || 'Registration failed' };
    } 
    catch (error) {
      const message = error.response?.data?.message || 'Network error during registration';
      return { success: false, error: message };
    }
  };

  // Profile update 
  const updateProfile = async (profileData) => {
    try {
      const response = await api.put('/users/profile', profileData);
      if (response.data && response.data.success) {
        const updatedProfile = response.data.data;
        localStorage.setItem('user', JSON.stringify(updatedProfile));
        setUser(updatedProfile);
        return { success: true, user: updatedProfile };
      }
      return { success: false, error: response.data.message || 'Profile update failed' };
    } 
    catch (error) {
      const message = error.response?.data?.message || 'Network error updating profile';
      return { success: false, error: message };
    }
  };

  // Logout session 
  const logout = async () => {
    try {
      await api.post('/users/logout');
    } 
    catch (error) {
      console.error('Logout API notification failed:', error);
    } 
    finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, updateProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
