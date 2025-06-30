import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { slugify } from '../utils/slugify';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { fetchCategories, fetchCompanies } from '../utils/api';
import { CategoryRow, CompanyRow } from '../types';
import { Cards } from '../components/Cards';
import CardSkeleton from '../components/CardSkeleton';
import Skeleton from 'react-loading-skeleton';

export default function Category() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [category, setCategory] = useState<CategoryRow | null>(null);
  const [companies, setCompanies] = useState<CompanyRow[] | null>(null);


  useEffect(() => {
    fetchCategories().then(cats => {
      const found = cats.find(
        c => c.id === slug || slugify(c.name) === slug
      );
      setCategory(found || null);
    });
    fetchCompanies().then(setCompanies);
  }, [slug]);

  const filteredCompanies = category && companies
    ? companies.filter(co => {
        if (!co.categories) return false;
        return co.categories
          .split(',')
          .map(c => c.trim().toLowerCase())
          .includes(category.name.toLowerCase());
      })
    : [];

  const openCompanyPage = (company: CompanyRow) => {
    navigate(`/logiciel/${slugify(company.name)}`);
  };

  return (
    <>
      <Header />
      <main className="container-category category-page">
        <nav className="breadcrumbs">
          <Link to="/">Accueil</Link> /{' '}
          <Link to="/toutes-categories">Toutes les catégories</Link> /{' '}
          <span>{category?.name || slug}</span>
        </nav>
        {category ? (
          <>
            <h1>{category.name}</h1>
            <p
              className="category-description"
              dangerouslySetInnerHTML={{ __html: category.description }}
            />
          </>
          ) : (
          <>
            <h1><Skeleton width={200} /></h1>
            <p className="category-description"><Skeleton count={2} /></p>
          </>
        )}
        <div className="selection-grid">
          {(companies ? filteredCompanies : Array.from({ length: 6 })).map((company, idx) => (
            companies ? (
              <a
                key={(company as CompanyRow).id}
                className="card-wrapper"
                href={`/logiciel/${slugify((company as CompanyRow).name)}`}
                onClick={e => {
                  e.preventDefault();
                  openCompanyPage(company as CompanyRow);
                }}
              >
                <Cards company={company as CompanyRow} />
              </a>
            ) : (
              <div key={idx} className="card-wrapper">
                <CardSkeleton />
              </div>
            )
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}