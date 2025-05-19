
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
        <button className="container" >
          Ajouter votre produit
        </button>
      </div>
    </header>
  );
}