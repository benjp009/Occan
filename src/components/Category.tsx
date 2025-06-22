import React, { useEffect, useState } from 'react'
import { fetchCategories } from '../utils/api';
import { CategoryRow } from '../types';
import { NavLink, useNavigate } from 'react-router-dom';
import { slugify } from '../utils/slugify';
import Skeleton from 'react-loading-skeleton';


export function CategoriesSection() {

  const [categories, setCategories] = useState<CategoryRow[] | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories().then((cats) => setCategories(cats));
  }, []);

  // Ensure count is treated as a number: sort descending and take top 8
  const topCategories = categories
    ? [...categories]
        .sort((a, b) => Number(b.count) - Number(a.count))
        .slice(0, 8)
    : Array.from({ length: 8 });

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
        {topCategories.map((cat, idx) => {
          if (!categories) {
            return (
              <div key={idx} className="category-card">
                <Skeleton width={24} height={24} className="category-card__icon" />
                <h3 className="category-card__title">
                  <Skeleton />
                </h3>
                <p className="category-card__desc">
                  <Skeleton count={2} />
                </p>
                <p className="category-card__count">
                  <Skeleton width={80} />
                </p>
              </div>
            );
          }
          const truncatedDescription =
            cat!.description.length > 50
              ? cat!.description.slice(0, 50).trimEnd() + '…'
              : cat!.description;
          return (
            <div
              key={cat!.id}
              className="category-card"
              onClick={() => navigate(`/categorie/${slugify(cat!.name)}`)}
            >
              <img
                src={`/icons/${cat!.icon}`}
                alt={`${cat!.name} icon`}
                className="category-card__icon"
              />
              <h3 className="category-card__title">{cat!.name}</h3>
              <p className="category-card__desc">{truncatedDescription}</p>
              <p className="category-card__count">
                {cat!.count} logiciels
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export {};