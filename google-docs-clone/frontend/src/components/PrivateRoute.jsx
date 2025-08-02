// src/components/PrivateRoute.jsx
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);
  const { isDark } = useTheme();

  if (loading) return (
    <div className={`flex items-center justify-center min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'}`}>
      <div className="text-lg">Loading...</div>
    </div>
  );

  return isAuthenticated ? children : <Navigate to="/" replace />;
};

export default PrivateRoute;

