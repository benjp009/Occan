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
        <link rel="canonical" href="https://logicielfrance.com/categories" />
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
        <div className="all-categories-grid">
          {(categories || Array.from({ length: 10 })).map((category, idx) => (
            categories ? (
              <Link
                key={(category as CategoryRow).id}
                className="categories-card"
                to={`/categorie/${slugify((category as CategoryRow).name)}`}
              >
                <span className="categories-name">{(category as CategoryRow).name}</span>
                <span className="categories-count">{(category as CategoryRow).count} logiciels</span>
              </Link>
            ) : (
              <div key={idx} className="categories-card">
                <span className="categories-name"><Skeleton width={120} /></span>
                <span className="categories-count"><Skeleton width={80} /></span>
              </div>
            )
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
