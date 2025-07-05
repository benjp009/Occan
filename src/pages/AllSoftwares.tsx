import React, { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { fetchCompanies } from '../utils/api';
import { CompanyRow } from '../types';
import { Cards } from '../components/Cards';
import { slugify } from '../utils/slugify';
import { Link } from 'react-router-dom';
import CardSkeleton from '../components/CardSkeleton';
import AlphabetNav from '../components/AlphabetNav';

export default function AllSoftwares() {
  const [companies, setCompanies] = useState<CompanyRow[] | null>(null);

  useEffect(() => {
    fetchCompanies().then(data => {
      const sorted = data.sort((a, b) =>
        a.name.localeCompare(b.name, 'fr', { sensitivity: 'base' }),
      );
      setCompanies(sorted);
    });
  }, []);


  return (
    <>
      <Header />
      <main className="container-category">
        <nav className="breadcrumbs">
          <Link to="/">Accueil</Link> / <span>Tous les logiciels</span>
        </nav>
        <h1>Tous les logiciels</h1>
        <p>Retrouvez la liste exhaustive de tout les logiciels français disponible.</p>
        <p>La liste est mise à jour quotidiennement.</p>
        <div>
          {companies && <AlphabetNav companies={companies} />}
          <div className="selection-grid software-list-grid">
            {(companies || Array.from({ length: 9 })).map((company, idx) => (
              companies ? (
                <Link
                  key={(company as CompanyRow).id}
                  className="card-wrapper"
                  to={`/logiciel/${slugify((company as CompanyRow).name)}`}
                  id={(() => {
                    const letter = (company as CompanyRow).name
                      .charAt(0)
                      .toUpperCase();
                    const prev = idx > 0
                      ? (companies as CompanyRow[])[idx - 1].name
                          .charAt(0)
                          .toUpperCase()
                      : '';
                    return letter !== prev ? `letter-${letter}` : undefined;
                  })()}
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
        </div>
      </main>
      <Footer />
    </>
  );
}