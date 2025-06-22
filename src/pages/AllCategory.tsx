import React, { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { fetchCategories } from '../utils/api';
import { CategoryRow } from '../types';
import Skeleton from 'react-loading-skeleton';
import { Link, useNavigate } from 'react-router-dom';
import { slugify } from '../utils/slugify';



export default function AllCategory() {
  const [categories, setCategories] = useState<CategoryRow[] | null>(null);
  const navigate = useNavigate();


  useEffect(() => {
    fetchCategories().then((data) => {
      const sortedData = data.sort((a, b) => a.name.localeCompare(b.name));
      setCategories(sortedData);
    });
  }, []);

  return (
    <>
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
              <div
                key={(category as CategoryRow).id}
                className="categories-card"
                onClick={() => navigate(`/categorie/${slugify((category as CategoryRow).name)}`)}
              >
                <div className="categories-card" key={(category as CategoryRow).id}>
                  <span className="categories-name">{(category as CategoryRow).name}</span>
                  <span className="categories-count">{(category as CategoryRow).count} logiciels</span>
                </div>
              </div>
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
