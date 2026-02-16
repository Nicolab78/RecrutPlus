import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types/User';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Chargement...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.mustChangePassword && location.pathname !== '/change-password') {
    console.log('Changement de mot de passe requis, redirection à change-password');
    return <Navigate to="/change-password" replace />;
  }

  if (allowedRoles && user?.role && !allowedRoles.includes(user.role)) {
  console.log('Accès refusé, redirection à home');
  return <Navigate to="/home" replace />;
}



  return <>{children}</>;
};

export default ProtectedRoute;