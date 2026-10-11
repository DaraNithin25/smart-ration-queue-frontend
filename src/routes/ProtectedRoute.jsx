import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/Loading';

export const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loading fullScreen text="Verifying authentication session..." />;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const userRole = user.role;

  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    if (userRole === 'ADMIN') return <Navigate to="/admin" replace />;
    if (userRole === 'DEALER') return <Navigate to="/dealer" replace />;
    return <Navigate to="/beneficiary" replace />;
  }

  return children;
};

export default ProtectedRoute;
