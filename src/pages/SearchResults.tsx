import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
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
      <Helmet>
        <title>{query ? `Recherche : ${query} - Logiciel France` : 'Recherche - Logiciel France'}</title>
        <meta name="description" content={query ? `Resultats de recherche pour "${query}" parmi les logiciels francais. Trouvez la solution ideale Made in France.` : 'Recherchez parmi les logiciels francais. Trouvez la solution ideale Made in France.'} />
        <meta name="robots" content="noindex, follow" />
        <meta property="og:title" content={query ? `Recherche : ${query}` : 'Recherche'} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://logicielfrance.com/recherche${query ? `?q=${encodeURIComponent(query)}` : ''}`} />
        <meta property="og:site_name" content="Logiciel France" />
        <meta property="og:locale" content="fr_FR" />
      </Helmet>
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
              <div key={company.id} className="card-wrapper">
                <Cards
                  company={company}
                  highlight={query}
                  internalTo={`/logiciel/${slugify(company.name)}`}
                />
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
