import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
  children: React.ReactNode;
}

export function PrivateRoute({ children }: PrivateRouteProps) {
  const [authState, setAuthState] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading');

  useEffect(() => {
    fetch('/api/admin/verify', { credentials: 'include' })
      .then(res => {
        setAuthState(res.ok ? 'authenticated' : 'unauthenticated');
      })
      .catch(() => {
        setAuthState('unauthenticated');
      });
  }, []);

  if (authState === 'loading') {
    return (
      <div className="container mx-auto p-6 text-center">
        <p>Vérification de l'authentification...</p>
      </div>
    );
  }

  return authState === 'authenticated' ? <>{children}</> : <Navigate to="/login" replace />;
}