import { Link } from 'react-router-dom';

export function Header({ onSearch }: { onSearch: (query: string) => void }) {
  return (
    <header className="header">
      <div className="container">
        {/* Logo placeholder */}
        <div>Logo</div>
        {/* Search bar */}
        <div>
          <input
            type="text"
            placeholder="Rechercher un produit..."
            onChange={e => onSearch(e.target.value)}
          />
        </div>
        {/* CTA */}
        <Link
          to="/admin"
        >
          Ajouter votre produit
        </Link>
      </div>
    </header>
  );
}