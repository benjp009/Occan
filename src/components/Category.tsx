import React, { useEffect, useState } from 'react'
import { fetchCategories } from '../utils/api';
import { CategoryRow } from '../types';
import { NavLink, Link } from 'react-router-dom';
import { slugify } from '../utils/slugify';


export function CategoriesSection() {

  const [categories, setCategories] = useState<CategoryRow[]>([]);

  useEffect(() => {
    fetchCategories().then((cats) => setCategories(cats));
  }, []);

  // Ensure count is treated as a number: sort descending and take top 8
  const topCategories = [...categories]
    .filter(cat => cat.id && cat.name) // Filter out invalid categories
    .sort((a, b) => Number(b.count || 0) - Number(a.count || 0))
    .slice(0, 8);

  return (
    <section className="categories-section">
      <div className="categories-header">
        <h2>Catégories populaires</h2>
          <NavLink
          to="/toutes-categories"
          className="secondary-button"
        >
          Voir toutes les catégories
        </NavLink>
      </div>

      <div className="categories-grid">
        {topCategories.map((cat) => {
          // Safety check for undefined description
          if (!cat.id || !cat.name) {
            return null;
          }
          
          const description = cat.description || '';
          const truncatedDescription =
            description.length > 50
              ? description.slice(0, 50).trimEnd() + '…'
              : description;
          return (
              <Link
                key={cat.id}
                className="category-card"
                to={`/categorie/${slugify(cat.name)}`}
              >
              <img
                src={`/icons/${cat.icon || 'default.webp'}`}
                alt={`${cat.name} icon`}
                className="category-card__icon"
              />
              <h3 className="category-card__title">{cat.name}</h3>
              <p
                className="category-card__desc"
                dangerouslySetInnerHTML={{ __html: truncatedDescription }}
              />
              <p className="category-card__count">
                {cat.count || '0'} logiciels
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export {};