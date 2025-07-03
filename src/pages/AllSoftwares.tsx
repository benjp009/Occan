import React, { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { fetchCompanies } from '../utils/api';
import { CompanyRow } from '../types';
import { Cards } from '../components/Cards';
import { slugify } from '../utils/slugify';
import { Link, useNavigate } from 'react-router-dom';
import CardSkeleton from '../components/CardSkeleton';

export default function AllSoftwares() {
  const [companies, setCompanies] = useState<CompanyRow[] | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCompanies().then(data => setCompanies(data));
  }, []);

  const openCompanyPage = (company: CompanyRow) => {
    navigate(`/logiciel/${slugify(company.name)}`);
  };

  return (
    <>
      <Header />
      <main className="container-category">
        <nav className="breadcrumbs">
          <Link to="/">Accueil</Link> / <span>Tous les logiciels</span>
        </nav>
        <h1>Tous les logiciels</h1>
        <div className="selection-grid">
          {(companies || Array.from({ length: 9 })).map((company, idx) => (
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
