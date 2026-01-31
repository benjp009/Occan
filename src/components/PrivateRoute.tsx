import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface PrivateRouteProps {
  children: React.ReactNode;
}

// Original PrivateRoute for legacy admin system (password-based)
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

// New Firebase-based PrivateRoute for publisher dashboard
interface FirebasePrivateRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export function FirebasePrivateRoute({ children, requireAdmin = false }: FirebasePrivateRouteProps) {
  const { user, userProfile, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="loading-page">
        <p>Chargement...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/espace-editeur" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return (
      <div className="unauthorized-page">
        <div className="unauthorized-container">
          <h1>Accès non autorisé</h1>
          <p>Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
          <a href="/dashboard" className="btn btn-primary">Retour au tableau de bord</a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
