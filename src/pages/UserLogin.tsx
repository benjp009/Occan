import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../contexts/AuthContext';

export default function UserLogin() {
  const { user, loading, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !loading) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      navigate('/dashboard');
    } catch (error) {
      console.error('Erreur de connexion:', error);
    }
  };

  if (loading) {
    return (
      <div className="user-login-page">
        <div className="login-container">
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Connexion Éditeur | Logiciel France</title>
        <meta name="description" content="Connectez-vous pour gérer la page de votre logiciel sur Logiciel France." />
      </Helmet>

      <div className="user-login-page">
        <div className="login-container">
          <div className="login-header">
            <h1>Espace Éditeur</h1>
            <p>Gérez la page de votre logiciel sur Logiciel France</p>
          </div>

          <div className="login-benefits">
            <h2>Pourquoi créer un compte ?</h2>
            <ul>
              <li>
                <span className="benefit-icon">✏️</span>
                <span>Modifier les informations de votre logiciel</span>
              </li>
              <li>
                <span className="benefit-icon">📊</span>
                <span>Consulter les statistiques de votre page</span>
              </li>
              <li>
                <span className="benefit-icon">🏆</span>
                <span>Gérer vos promotions et mises en avant</span>
              </li>
              <li>
                <span className="benefit-icon">➕</span>
                <span>Ajouter de nouveaux logiciels</span>
              </li>
            </ul>
          </div>

          <button
            className="google-signin-btn"
            onClick={handleGoogleSignIn}
          >
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continuer avec Google
          </button>

          <p className="login-note">
            En vous connectant, vous acceptez nos{' '}
            <a href="/conditions-utilisation">conditions d'utilisation</a> et notre{' '}
            <a href="/politique-de-confidentialite">politique de confidentialité</a>.
          </p>
        </div>
      </div>
    </>
  );
}
