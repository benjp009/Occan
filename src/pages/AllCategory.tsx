import React, { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { fetchCategories } from '../utils/api';
import { CategoryRow } from '../types';
import { Link } from 'react-router-dom';


export default function AllCategory() {
  const [categories, setCategories] = useState<CategoryRow[]>([]);

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
          {categories.map((category) => (
            <div className="categories-card" key={category.id}>
              <span className="categories-name">{category.name}</span>
              <span className="categories-count">{category.count} logiciels</span>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
