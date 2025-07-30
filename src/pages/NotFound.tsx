import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export default function NotFound() {
  return (
    <>
      <Helmet>
        <title>Page non trouvée - 404 | Logiciel France</title>
        <meta name="description" content="La page que vous recherchez n'existe pas. Découvrez notre annuaire des logiciels français et trouvez votre solution." />
        <meta name="robots" content="noindex, follow" />
        
        <link rel="canonical" href="https://logicielfrance.com/404" />
        
        <meta property="og:title" content="Page non trouvée - 404" />
        <meta property="og:description" content="La page que vous recherchez n'existe pas sur Logiciel France." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://logicielfrance.com/404" />
        <meta property="og:site_name" content="Logiciel France" />
        <meta property="og:locale" content="fr_FR" />
        
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Page non trouvée - 404" />
        <meta name="twitter:description" content="La page que vous recherchez n'existe pas sur Logiciel France." />
      </Helmet>
      
      <Header />
      
      <main className="container-category">
        <div className="not-found-container">
          <div className="not-found-content">
            <div className="not-found-number">4🇫🇷4</div>
            
            <h1 className="not-found-title">Oups ! Page introuvable</h1>
            
            <p className="not-found-description">
              La page que vous cherchez n'existe pas ou a été déplacée. 
              Peut-être qu'un logiciel français peut vous aider à retrouver votre chemin ? 🚀
            </p>
            
            <div className="not-found-buttons">
              <Link to="/" className="not-found-btn-primary">
                🏠 Retour à l'accueil
              </Link>
              
              <Link to="/tous-les-logiciels" className="not-found-btn-secondary">
                📋 Voir tous les logiciels
              </Link>
            </div>
            
            <div className="not-found-suggestions">
              <h2 className="not-found-suggestions-title">🔍 Suggestions populaires</h2>
              <div className="not-found-tags">
                <Link to="/toutes-categories" className="not-found-tag">
                  Toutes les catégories
                </Link>
                <Link to="/ajouter-un-nouveau-logiciel" className="not-found-tag">
                  Ajouter un logiciel
                </Link>
                <Link to="/a-propos" className="not-found-tag">
                  À propos
                </Link>
              </div>
            </div>
            
            <p className="not-found-tip">
              💡 Astuce : Utilisez la barre de recherche en haut de la page pour trouver rapidement un logiciel français !
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
}