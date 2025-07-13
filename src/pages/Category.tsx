import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { slugify } from '../utils/slugify';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { fetchCategories, fetchCompanies } from '../utils/api';
import { CategoryRow, CompanyRow } from '../types';
import { Cards } from '../components/Cards';
import CardSkeleton from '../components/CardSkeleton';
import Skeleton from 'react-loading-skeleton';

interface CategoryProps {
  initialCategory?: CategoryRow | null;
  initialCompanies?: CompanyRow[] | null;
}

export default function Category({ initialCategory, initialCompanies }: CategoryProps) {
  const { slug } = useParams<{ slug: string }>();
  const [category, setCategory] = useState<CategoryRow | null>(initialCategory ?? null);
  const [companies, setCompanies] = useState<CompanyRow[] | null>(initialCompanies ?? null);


  useEffect(() => {
    if (!initialCategory || (initialCategory && initialCategory.id !== slug && slugify(initialCategory.name) !== slug)) {
      fetchCategories().then(cats => {
        const found = cats.find(
          c => c.id === slug || slugify(c.name) === slug
        );
        setCategory(found || null);
      });
    }
    if (!initialCompanies) {
      fetchCompanies().then(setCompanies);
    }
  }, [slug, initialCategory, initialCompanies]);

  const filteredCompanies = category && companies
    ? companies.filter(co => {
        if (!co.categories) return false;
        return co.categories
          .split(',')
          .map(c => c.trim().toLowerCase())
          .includes(category.name.toLowerCase());
      })
    : [];


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
          <p>
            <Link to={`/comparatif/${slugify(category.name)}`}>Comparer ces logiciels</Link>
          </p>
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
              <Link
                key={(company as CompanyRow).id}
                className="card-wrapper"
                to={`/logiciel/${slugify((company as CompanyRow).name)}`}
              >
                <Cards company={company as CompanyRow} />
              </Link>
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

