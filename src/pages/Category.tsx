import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { slugify } from '../utils/slugify';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { fetchCategories, fetchCompanies } from '../utils/api';
import { CategoryRow, CompanyRow } from '../types';
import { Cards } from '../components/Cards';
import Company from '../components/Company';

export default function Category() {
  const { slug } = useParams<{ slug: string }>();
  const [category, setCategory] = useState<CategoryRow | null>(null);
  const [companies, setCompanies] = useState<CompanyRow[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<CompanyRow | null>(null);

  useEffect(() => {
    fetchCategories().then(cats => {
      const found = cats.find(
        c => c.id === slug || slugify(c.name) === slug
      );
      setCategory(found || null);
    });
    fetchCompanies().then(setCompanies);
  }, [slug]);

  const filteredCompanies = category
    ? companies.filter(co => {
        if (!co.categories) return false;
        return co.categories
          .split(',')
          .map(c => c.trim().toLowerCase())
          .includes(category.name.toLowerCase());
      })
    : [];

  const openModal = (company: CompanyRow) => {
    setSelectedCompany(company);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setSelectedCompany(null);
    setIsModalOpen(false);
  };

  return (
    <>
      <Header />
      <main className="container-category">
        <nav className="breadcrumbs">
          <Link to="/">Accueil</Link> /{' '}
          <Link to="/all-categories">toutes les catégories</Link> /{' '}
          <span>{category?.name || slug}</span>
        </nav>
        {category && (
          <>
            <h1>{category.name}</h1>
            <p className="category-description">{category.description}</p>
          </>
        )}
        <div className="selection-grid">
          {filteredCompanies.map(company => (
            <div
              key={company.id}
              className="card-wrapper"
              onClick={() => openModal(company)}
            >
              <Cards company={company} />
            </div>
          ))}
        </div>
      </main>
      {isModalOpen && selectedCompany && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close-button" onClick={closeModal}>
              ✕
            </button>
            <Company company={selectedCompany} />
          </div>
        </div>
      )}
      <Footer />
    </>
  );
}