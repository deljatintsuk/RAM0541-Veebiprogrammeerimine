import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../hooks/redux-hooks';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isLoggedIn } = useAppSelector((state) => state.auth);

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;