import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  /** Required role. Defaults to 'ADMIN' for the admin panel. */
  requiredRole?: 'SUPER_ADMIN' | 'ADMIN' | 'AFFILIATE';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole = 'ADMIN',
}) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  // Not logged in → redirect to login, preserving intended destination
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Logged in but wrong role (e.g. an affiliate hitting the admin panel)
  // Both SUPER_ADMIN and ADMIN are allowed into the admin panel if requiredRole is ADMIN
  if (requiredRole === 'ADMIN' && user?.role !== 'ADMIN' && user?.role !== 'SUPER_ADMIN') {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  } else if (requiredRole !== 'ADMIN' && user?.role !== requiredRole) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;