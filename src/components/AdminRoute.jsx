import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

// Check if user is admin
const isAdmin = () => {
  const userRole = sessionStorage.getItem('acceptopia-admin-role');
  const isAuthenticated = sessionStorage.getItem('acceptopia-admin-authenticated') === 'true';
  return isAuthenticated && userRole === 'admin';
};

const AdminRoute = ({ children }) => {
  const location = useLocation();
  const admin = isAdmin();
  const isAuthenticated = sessionStorage.getItem('acceptopia-admin-authenticated') === 'true';

  // If not authenticated, redirect to login page
  if (!isAuthenticated) {
    return <Navigate to="/admin-login" replace state={{ from: location }} />;
  }

  // If authenticated but not admin, redirect to login
  if (!admin) {
    return <Navigate to="/admin-login" replace state={{ from: location }} />;
  }

  return children;
};

export default AdminRoute;

