import React from 'react';
import { useEffect, useState } from 'react';
import { fetchCompanies } from '../utils/api';
import { CompanyRow } from '../types';
import { Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { Hero } from '../components/Hero';
import { CategoriesSection } from '../components/Category';
import { Cards } from '../components/Cards';
import MetricsBanner from '../components/MetricsBanner';
import { useMetrics } from '../utils/useMetrics';
import { Footer } from '../components/Footer';

export default function Home() {
  const [companies, setCompanies] = useState<CompanyRow[]>([]);
  const [search, setSearch] = useState('');
  const metrics = useMetrics();


  useEffect(() => {
    fetchCompanies().then(data => setCompanies(data));
  }, []);

  const filtered = companies.filter(c =>
    (c.name ?? '').toLowerCase().includes(search.toLowerCase())
  );

  // For the “Sélection du mois” section, we’ll just pick the first 9 companies:
  const selectionOfTheMonth = companies.slice(0, 9);

  return (
    <>
      <Header onSearch={setSearch} />
      <Hero onSearch={setSearch} />
      <CategoriesSection />

      <main className="container, banner-container">
      
        
      {metrics ? (
        <MetricsBanner
          totalSoftwares={metrics.totalSoftwares}
          totalCategories={metrics.totalCategories}
          visitsPerMonth={metrics.visitsPerMonth}
          frenchPercentage={metrics.frenchPercentage}
        />
      ) : (
        <p>Chargement des métriques…</p>
      )}

         <section className="selection-month">
          {/* Header row: title + “Voir tous les logiciels” */}
          <div className="selection-header">
            <h2 className="selection-title">Sélection du mois</h2>
            {/* 
              We use a simple <Link> styled as plain text (blue) 
              Replace `to="/all-softwares"` with whichever route shows “all softwares.” 
            */}
            <Link to="/all-softwares" className="selection-see-all">
              Voir tous les logiciels
            </Link>
          </div>

          {/* Grid of 3×3 cards */}
          <div className="selection-grid">
            {selectionOfTheMonth.map(company => (
              <Cards key={company.id} company={company} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
