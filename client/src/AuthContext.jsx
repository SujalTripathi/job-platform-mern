import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the AuthContext
const AuthContext = createContext();

// AuthProvider component to wrap the app and provide auth state
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Simulate checking for existing auth token on mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      // Here you would typically verify the token with your backend
      // For simplicity, assume it's valid and set a mock user
      setUser({ id: 1, name: 'User' });
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (credentials) => {
    // Implement login logic, e.g., API call
    // For demo, simulate success
    const mockUser = { id: 1, name: 'User' };
    localStorage.setItem('authToken', 'mock-token');
    setUser(mockUser);
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};