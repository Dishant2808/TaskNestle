import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          // Set token in API headers
          authAPI.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
          
          // Verify token and get user profile
          const response = await authAPI.get('/auth/profile');
          if (response.data.success) {
            setUser(response.data.data.user);
            setToken(storedToken);
          } else {
            // Invalid token, clear storage
            localStorage.removeItem('token');
            delete authAPI.defaults.headers.common['Authorization'];
          }
        } catch (error) {
          console.error('Auth initialization error:', error);
          // Invalid token, clear storage
          localStorage.removeItem('token');
          delete authAPI.defaults.headers.common['Authorization'];
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authAPI.post('/auth/login', { email, password });
      
      if (response.data.success) {
        const { user: userData, token: authToken } = response.data.data;
        
        // Store token and user data
        localStorage.setItem('token', authToken);
        authAPI.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
        
        setUser(userData);
        setToken(authToken);
        
        return { success: true, user: userData };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await authAPI.post('/auth/register', { name, email, password });
      
      if (response.data.success) {
        const { user: userData, token: authToken } = response.data.data;
        
        // Store token and user data
        localStorage.setItem('token', authToken);
        authAPI.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
        
        setUser(userData);
        setToken(authToken);
        
        return { success: true, user: userData };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    // Clear local storage
    localStorage.removeItem('token');
    
    // Remove token from API headers
    delete authAPI.defaults.headers.common['Authorization'];
    
    // Clear state
    setUser(null);
    setToken(null);
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await authAPI.put('/auth/profile', profileData);
      
      if (response.data.success) {
        setUser(response.data.data.user);
        return { success: true, user: response.data.data.user };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.error('Profile update error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Profile update failed' 
      };
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      const response = await authAPI.put('/auth/change-password', {
        currentPassword,
        newPassword
      });
      
      if (response.data.success) {
        return { success: true };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.error('Password change error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Password change failed' 
      };
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
