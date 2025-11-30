import React, { useEffect, useState, useRef } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  const location = useLocation();
  const [isValidating, setIsValidating] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const hasValidated = useRef(false);

  useEffect(() => {
    // Prevent multiple validations
    if (hasValidated.current) return;
    
    const validateToken = async () => {
      hasValidated.current = true;
      const token = localStorage.getItem('acceptopia-admin-token') || sessionStorage.getItem('acceptopia-admin-token');
      
      if (!token) {
        setIsAuthorized(false);
        setIsValidating(false);
        return;
      }

      try {
        // Verify token with backend
        const response = await fetch('http://localhost:5002/api/admin/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            sessionStorage.setItem('acceptopia-admin-authenticated', 'true');
            sessionStorage.setItem('acceptopia-admin-role', data.data.role || 'admin');
            setIsAuthorized(true);
          } else {
            setIsAuthorized(false);
          }
        } else {
          setIsAuthorized(false);
        }
      } catch (error) {
        console.error('Token validation error:', error);
        setIsAuthorized(false);
      } finally {
        setIsValidating(false);
      }
    };

    validateToken();
  }, []); // Empty deps - only run once on mount

  if (isValidating) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!isAuthorized) {
    return <Navigate to="/admin-login" replace />;
  }

  return children;
};

export default AdminRoute;

