import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, Link } from 'react-router-dom';
import { fetchCompanies } from '../utils/api';
import { CompanyRow } from '../types';
import { slugify } from '../utils/slugify';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import Company from '../components/Company';
import CompanySkeleton from '../components/CompanySkeleton';

export default function Software() {
  const { slug } = useParams<{ slug: string }>();
  const [company, setCompany] = useState<CompanyRow | null | undefined>(undefined);

  useEffect(() => {
    fetchCompanies().then(data => {
      const found = data.find(
        c => slugify(c.name) === slug || c.id === slug
      );
      setCompany(found || null);
    });
  }, [slug]);

  if (company === undefined) {
    return (
      <>
        <Header />
        <main className="container-category">
          <CompanySkeleton />
        </main>
        <Footer />
      </>
    );
  }

  if (company === null) {
    return (
      <>
        <Header />
        <main className="container-category">
          <p>Logiciel introuvable.</p>
        </main>
        <Footer />
      </>
    );
  }

  const firstCategory = company.categories
    ? company.categories.split(',')[0].trim()
    : '';

  return (
    <>
      <Helmet>
        {company.meta_description && (
          <meta name="description" content={company.meta_description} />
        )}
      </Helmet>
      <Header />
      <main className="container-category">
        <nav className="breadcrumbs">
          <Link to="/">Accueil</Link> /{' '}
          {firstCategory && (
            <>
              <Link to={`/categorie/${slugify(firstCategory)}`}>{firstCategory}</Link> /{' '}
            </>
          )}
          <span>{company.name}</span>
        </nav>
        <Company company={company} />
      </main>
      <Footer />
    </>
  );
}