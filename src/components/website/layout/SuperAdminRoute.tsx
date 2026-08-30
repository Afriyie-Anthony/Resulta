import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { useToast } from '../../ui/Toast';

interface SuperAdminRouteProps {
  children: React.ReactNode;
}

/**
 * Route guard for SUPER_ADMIN-only pages.
 * ADMIN users are redirected to /admin/overview with a toast notification.
 * Unauthenticated users are redirected to /admin/login.
 */
const SuperAdminRoute: React.FC<SuperAdminRouteProps> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();
  const { addToast } = useToast();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (user?.role !== 'SUPER_ADMIN') {
    addToast({
      title: 'Access Restricted',
      message: 'This section requires Super Admin privileges. Contact your system administrator.',
      type: 'error',
    });
    return <Navigate to="/admin/overview" replace />;
  }

  return <>{children}</>;
};

export default SuperAdminRoute;
