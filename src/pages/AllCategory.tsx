import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { fetchCategories } from '../utils/api';
import { CategoryRow } from '../types';
import Skeleton from 'react-loading-skeleton';
import { Link } from 'react-router-dom';
import { slugify } from '../utils/slugify';



export default function AllCategory() {
  const [categories, setCategories] = useState<CategoryRow[] | null>(null);


  useEffect(() => {
    fetchCategories().then((data) => {
      const sortedData = data.sort((a, b) => a.name.localeCompare(b.name));
      setCategories(sortedData);
    });
  }, []);

  return (
    <>
      <Helmet>
        <title>Toutes les catégories - Logiciels français | Logiciel France</title>
        <meta name="description" content="Explorez toutes les catégories de logiciels français. Marketing, CRM, comptabilité, design... Trouvez la solution parfaite pour votre entreprise." />
        <meta name="keywords" content="catégories logiciels français, types de logiciels, software categories france, solutions entreprise" />
        <meta property="og:title" content="Toutes les catégories - Logiciels français | Logiciel France" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://logicielfrance.com/categories" />
        <meta property="og:description" content="Explorez toutes les catégories de logiciels français. Trouvez la solution parfaite pour votre entreprise." />
      </Helmet>
      <Header />
      <main className="container-all-categories">
        {/* Breadcrumbs */}
        <nav className="breadcrumb">
          <Link to="/" className="breadcrumb-link">Accueil</Link>
          <span className="breadcrumb-separator"> / </span>
          <span className="breadcrumb-current">Toutes les catégories</span>
        </nav>
        <h1 className="page-title">Toutes les catégories de logiciels français</h1>
        <div className="categories-section">
          <div className="categories-grid">
            {(categories || Array.from({ length: 10 })).map((category, idx) => {
              if (categories) {
                const categoryTyped = category as CategoryRow;
                
                // Safety checks for undefined fields
                if (!categoryTyped.id || !categoryTyped.name) {
                  return null;
                }
                
                const description = categoryTyped.description || '';
                const truncatedDescription =
                  description.length > 50
                    ? description.slice(0, 50).trimEnd() + '…'
                    : description;
                return (
                  <Link
                    key={categoryTyped.id}
                    className="category-card"
                    to={`/categorie/${slugify(categoryTyped.name)}`}
                  >
                    <img
                      src={`/icons/${categoryTyped.icon || 'default.webp'}`}
                      alt={`${categoryTyped.name} icon`}
                      className="category-card__icon"
                    />
                    <h3 className="category-card__title">{categoryTyped.name}</h3>
                    <p
                      className="category-card__desc"
                      dangerouslySetInnerHTML={{ __html: truncatedDescription }}
                    />
                    <p className="category-card__count">
                      {categoryTyped.count || '0'} logiciels
                    </p>
                  </Link>
                );
              } else {
                return (
                  <div key={idx} className="category-card">
                    <div className="category-card__icon"><Skeleton width={40} height={40} /></div>
                    <h3 className="category-card__title"><Skeleton width={120} /></h3>
                    <p className="category-card__desc"><Skeleton width={150} height={40} /></p>
                    <p className="category-card__count"><Skeleton width={80} /></p>
                  </div>
                );
              }
            })}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
