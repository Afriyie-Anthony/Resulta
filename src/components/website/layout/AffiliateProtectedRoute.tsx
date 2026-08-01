import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';

interface AffiliateProtectedRouteProps {
  children: React.ReactNode;
}

const AffiliateProtectedRoute: React.FC<AffiliateProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/affiliate/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default AffiliateProtectedRoute;
