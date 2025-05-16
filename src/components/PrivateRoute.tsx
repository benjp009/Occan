import React from 'react';
import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
  children: React.ReactNode;
}

export function PrivateRoute({ children }: PrivateRouteProps) {
  const loggedIn = !!localStorage.getItem('isAdmin');
  return loggedIn ? <>{children}</> : <Navigate to="/login" replace />;
}