import React from 'react';

export function Footer() {
  const categories = ['Finance', 'Marketing', 'Vente', 'Contenu', 'Logistique'];
  const resources = ['À propos', 'Blog', 'Contact'];
  const legal = ['Mentions légales', 'Politique de confidentialité', 'Conditions d\'utilisation'];

  return (
    <footer className="bg-white border-t mt-20">
      <div className="container mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Column 1 */}
        <div>
          <div className="text-xl font-bold mb-2">Logo</div>
          <p>Le répertoire le plus complet des logiciels français.</p>
        </div>
        {/* Column 2: Categories */}
        <div>
          <h4 className="font-semibold mb-2">Catégories</h4>
          <ul className="space-y-1">
            {categories.map(cat => (
              <li key={cat} className="hover:underline cursor-pointer">{cat}</li>
            ))}
          </ul>
        </div>
        {/* Column 3: Ressources */}
        <div>
          <h4 className="font-semibold mb-2">Ressources</h4>
          <ul className="space-y-1">
            {resources.map(res => (
              <li key={res} className="hover:underline cursor-pointer">{res}</li>
            ))}
          </ul>
        </div>
        {/* Column 4: Légal */}
        <div>
          <h4 className="font-semibold mb-2">Légal</h4>
          <ul className="space-y-1">
            {legal.map(item => (
              <li key={item} className="hover:underline cursor-pointer">{item}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="bg-gray-50 text-center py-4">
        © 2025 Occan. Tous droits réservés.
      </div>
    </footer>
  );
}