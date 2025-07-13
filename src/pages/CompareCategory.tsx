import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { fetchCategories, fetchCompanies } from '../utils/api';
import { CategoryRow, CompanyRow } from '../types';
import { slugify } from '../utils/slugify';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import Skeleton from 'react-loading-skeleton';

export default function CompareCategory() {
  const { slug } = useParams<{ slug: string }>();
  const [category, setCategory] = useState<CategoryRow | null>(null);
  const [companies, setCompanies] = useState<CompanyRow[] | null>(null);

  useEffect(() => {
    fetchCategories().then(cats => {
      const found = cats.find(c => c.id === slug || slugify(c.name) === slug);
      setCategory(found || null);
    });
    fetchCompanies().then(setCompanies);
  }, [slug]);

  const filtered = category && companies
    ? companies.filter(co => {
        if (!co.categories) return false;
        return co.categories
          .split(',')
          .map(c => c.trim().toLowerCase())
          .includes(category.name.toLowerCase());
      })
    : [];

  const title = category
    ? `Comparer les logiciels de ${category.name}`
    : 'Comparateur de logiciels';
  const description = category
    ? `Comparez les logiciels français pour la catégorie ${category.name}.`
    : 'Comparez les logiciels français.';
  const canonical = `https://logicielfrance.com/comparatif/${slug}`;

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonical} />
      </Helmet>
      <Header />
      <main className="container-category compare-page">
        <nav className="breadcrumbs">
          <Link to="/">Accueil</Link> /{' '}
          {category && (
            <>
              <Link to={`/categorie/${slugify(category.name)}`}>{category.name}</Link>
              {' / '}
            </>
          )}
          <span>Comparatif</span>
        </nav>
        <h1>{category ? `Comparer ${category.name}` : <Skeleton width={200} />}</h1>
        {companies ? (
          <table className="compare-table">
            <thead>
              <tr>
                <th>Logiciel</th>
                <th>Description</th>
                <th>Site web</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(company => (
                <tr key={company.id}>
                  <td>
                    <Link to={`/logiciel/${slugify(company.name)}`}>{company.name}</Link>
                  </td>
                  <td dangerouslySetInnerHTML={{ __html: company.description }} />
                  <td>
                    {company.website && (
                      <a href={company.website} target="_blank" rel="noopener noreferrer">
                        {company.website.replace(/^https?:\/\//, '')}
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <Skeleton count={5} />
        )}
      </main>
      <Footer />
    </>
  );
}
