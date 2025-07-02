import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Header } from '../src/components/Header';
import { Footer } from '../src/components/Footer';
import { fetchCompanies } from '../src/utils/api';
import { filterCompanies } from '../src/utils/search';
import { CompanyRow } from '../src/types';
import { Cards } from '../src/components/Cards';
import { slugify } from '../src/utils/slugify';
import CardSkeleton from '../src/components/CardSkeleton';

export default function SearchResults() {
  const [companies, setCompanies] = useState<CompanyRow[] | null>(null);
  const router = useRouter();
  const query = typeof router.query.q === 'string' ? router.query.q : '';

  useEffect(() => {
    fetchCompanies().then(setCompanies);
  }, []);

  const results = companies ? filterCompanies(query, companies) : [];

  const openCompanyPage = (company: CompanyRow) => {
    router.push(`/logiciel/${slugify(company.name)}`);
  };

  return (
    <>
      <Header />
      <main className="container-category">
        <nav className="breadcrumbs">
          <Link href="/">Accueil</Link> / <span>Recherche</span>
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
              <a
                key={company.id}
                className="card-wrapper"
                href={`/logiciel/${slugify(company.name)}`}
                onClick={e => {
                  e.preventDefault();
                  openCompanyPage(company);
                }}
              >
                <Cards company={company} highlight={query} />
              </a>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
