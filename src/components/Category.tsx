import { useEffect, useState } from 'react'
import { fetchCategories } from '../utils/api';
import { CategoryRow } from '../types';
import { NavLink, Link } from 'react-router-dom';
import { slugify } from '../utils/slugify';
import { sanitizeHTML } from '../utils/sanitize';
import { OptimizedImage, getCategoryIconUrl } from '../utils/imageUtils';


interface CategoriesSectionProps {
  initialCategories?: CategoryRow[] | null;
}

export function CategoriesSection({ initialCategories }: CategoriesSectionProps) {

  const [categories, setCategories] = useState<CategoryRow[]>(initialCategories || []);

  useEffect(() => {
    if (!initialCategories) {
      fetchCategories().then((cats) => setCategories(cats));
    }
  }, [initialCategories]);

  // Ensure count is treated as a number: sort descending and take top 8
  const topCategories = [...categories]
    .sort((a, b) => Number(b.count) - Number(a.count))
    .slice(0, 8);

  return (
    <section className="categories-section">
      <div className="categories-header">
        <h2>Catégories populaires</h2>
          <NavLink
          to="/categorie"
          className="secondary-button"
        >
          Voir toutes les catégories
        </NavLink>
      </div>

      <div className="categories-grid">
        {topCategories.map((cat) => {
          const truncatedDescription =
            cat.description.length > 50
              ? cat.description.slice(0, 50).trimEnd() + '…'
              : cat.description;
          return (
              <Link
                key={cat.id}
                className="category-card"
                to={`/categorie/${slugify(cat.name)}`}
              >
              <OptimizedImage
                src={getCategoryIconUrl(cat.icon)}
                alt={`${cat.name} icon`}
                className="category-card__icon"
                fallbackSrc={`/icons/category-${slugify(cat.name)}.webp`}
              />
              <h3 className="category-card__title">{cat.name}</h3>
              <p
                className="category-card__desc"
                dangerouslySetInnerHTML={{ __html: sanitizeHTML(truncatedDescription) }}
              />
              <p className="category-card__count">
                {cat.count} logiciels
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
