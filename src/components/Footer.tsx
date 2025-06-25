import logo from '../logo.svg';
import { Link } from 'react-router-dom';

import React from 'react';

export function Footer() {
  const categories = ['Finance', 'Marketing', 'Vente', 'Contenu', 'Logistique'];
  const resources = [
    { label: 'À propos', path: '/a-propos' },
    { label: 'Blog', path: '/blog' },
    { label: 'Contact', path: '/contact' }
  ];
  const legal      = [
    { label: 'Mentions légales', path: '/mentions-legales' },
    { label: 'Politique de confidentialité', path: '/politique-de-confidentialite' },
    { label: "Conditions d'utilisation", path: '/conditions-utilisation' }
  ];
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="column">
        {/* Column 1: Logo + Tagline */}
        <div className="logo-container">
           <Link to="/">
          <img
            src={logo}
            alt="Occan logo"
            className="logo"
          />
          </Link>
          <p>Le répertoire le plus complet des logiciels français.</p>
        </div>

        {/* Column 2: Catégories */}
        <div>
          <h4>Catégories</h4>
          <ul>
            {categories.map(cat => (
              <li key={cat} className="link">{cat}</li>
            ))}
          </ul>
        </div>

        {/* Column 3: Ressources */}
        <div>
          <h4>Ressources</h4>
          <ul>
            {resources.map(item => (
              <li key={item.path} className="link">
                <Link to={item.path}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 4: Légal */}
        <div>
          <h4>Légal</h4>
          <ul>
            {legal.map(item => (
              <li key={item.path} className="link">
                <Link to={item.path}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="copyright">
       © {currentYear} Logiciel France 🇫🇷 - Tous droits réservés.
      </div>
    </footer>
  );
}
