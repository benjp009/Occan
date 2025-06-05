import logo from '../logo.svg';
import React from 'react';

export function Footer() {
  const categories = ['Finance', 'Marketing', 'Vente', 'Contenu', 'Logistique'];
  const resources  = ['À propos', 'Blog', 'Contact'];
  const legal      = ['Mentions légales', 'Politique de confidentialité', 'Conditions d\'utilisation'];

  return (
    <footer className="footer">
      <div className="column">
        {/* Column 1: Logo + Tagline */}
        <div className="logo-container">
           <img
            src={logo}
            alt="Occan logo"
            className="logo logo-footer"
          />
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
            {resources.map(res => (
              <li key={res} className="link">{res}</li>
            ))}
          </ul>
        </div>

        {/* Column 4: Légal */}
        <div>
          <h4>Légal</h4>
          <ul>
            {legal.map(item => (
              <li key={item} className="link">{item}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="copyright">
        © 2025 Occan. Tous droits réservés.
      </div>
    </footer>
  );
}
