import React from 'react';

const popularTags = [
  'Finance', 'Marketing', 'Vente', 'Contenu', 'Logistique'
];

export function Hero({ onSearch }: { onSearch: (query: string) => void }) {
  return (
    <section className="bg-gray-100 py-20">
      <div className="container mx-auto px-6 text-center">
        <h1 className="text-4xl font-extrabold mb-4">
          Le répertoire des solutions web françaises
        </h1>
        <p className="text-lg mb-6">
          Découvrez les meilleures solutions logicielles françaises pour votre entreprise, organisées par catégorie.
        </p>
        <div className="max-w-md mx-auto mb-4">
          <input
            type="text"
            placeholder="Rechercher un produit..."
            onKeyDown={e => {
              if (e.key === 'Enter') onSearch((e.target as HTMLInputElement).value);
            }}
            className="w-full border rounded p-3"
          />
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {popularTags.map(tag => (
            <button
              key={tag}
              onClick={() => onSearch(tag)}
              className="px-3 py-1 border rounded hover:bg-blue-50"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}