import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { fetchCompanies } from '../utils/api';
import { filterCompanies } from '../utils/search';
import { CompanyRow } from '../types';
import { Cards } from '../components/Cards';
import { slugify } from '../utils/slugify';
import CardSkeleton from '../components/CardSkeleton';

export default function SearchResults() {
  const [companies, setCompanies] = useState<CompanyRow[] | null>(null);
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  useEffect(() => {
    fetchCompanies().then(setCompanies);
  }, []);

  const results = companies ? filterCompanies(query, companies) : [];


  return (
    <>
      <Header />
      <main className="container-category">
        <nav className="breadcrumbs">
          <Link to="/">Accueil</Link> / <span>Recherche</span>
        </nav>
        <h1>Résultats pour «{query}»</h1>
        {companies === null ? (
          <div className="selection-grid">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="card-wrapper">
                <CardSkeleton />
              </div>
            ))}
          </div>
        ) : results.length === 0 ? (
          <p>Aucun résultat trouvé.</p>
        ) : (
          <div className="selection-grid">
            {results.map(company => (
              <Link
                key={company.id}
                className="card-wrapper"
                to={`/logiciel/${slugify(company.name)}`}
              >
                <Cards company={company} highlight={query} />
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}