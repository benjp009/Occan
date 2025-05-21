import { useEffect, useState } from 'react';
import { fetchCategories } from '../utils/api';
import { CategoryRow } from '../types';

export function CategoriesSection() {
  const [categories, setCategories] = useState<CategoryRow[]>([]);

  useEffect(() => {
    fetchCategories().then((cats) => setCategories(cats));
  }, []);

  return (
    <section className="categories-section">
      <div className="categories-header">
        <h2>Catégories populaires</h2>
        <button
          className="categories-header__button"
          onClick={() => {
            /* navigate to /categories or open modal */
          }}
        >
          Voir toutes les catégories
        </button>
      </div>

      <div className="categories-grid">
        {categories.map((cat) => (
          <div key={cat.id} className="category-card">
             <img
              src={`/icons/${cat.icon}`}
              alt={`${cat.name} icon`}
              className="category-card__icon"
            />
            <h3 className="category-card__title">{cat.name}</h3>
            <p className="category-card__desc">{cat.description}</p>
            <p className="category-card__count">
              {cat.count} logiciels
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export {};