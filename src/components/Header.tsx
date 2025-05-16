import React from 'react';
import { Link } from 'react-router-dom';

export function Header({ onSearch }: { onSearch: (query: string) => void }) {
  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo placeholder */}
        <div className="text-xl font-bold">Logo</div>
        {/* Search bar */}
        <div className="flex-1 mx-6">
          <input
            type="text"
            placeholder="Rechercher un produit..."
            onChange={e => onSearch(e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>
        {/* CTA */}
        <Link
          to="/admin"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Ajouter votre produit
        </Link>
      </div>
    </header>
  );
}