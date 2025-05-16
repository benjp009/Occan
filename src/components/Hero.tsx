// Description: Footer component for the website
const popularTags = [
  'Finance', 'Marketing', 'Vente', 'Contenu', 'Logistique'
];

export function Hero({ onSearch }: { onSearch: (query: string) => void }) {
  return (
    <section>
      <div className="container">
        <h1 className="title">
          Le répertoire des solutions web françaises
        </h1>
        <p className="text">
          Découvrez les meilleures solutions logicielles françaises pour votre entreprise, organisées par catégorie.
        </p>
        <div>
          <input
            type="text"
            placeholder="Rechercher un produit..."
            onKeyDown={e => {
              if (e.key === 'Enter') onSearch((e.target as HTMLInputElement).value);
            }}
          />
        </div>
        <div>
          {popularTags.map(tag => (
            <button
              key={tag}
              onClick={() => onSearch(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}