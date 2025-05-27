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

        <h1 className="title">French SaaS Directory</h1>
        <div className="card">
          {filtered.map(company => (
            <Cards key={company.id} company={company} />
          ))}
        </div>

        <div className="admin">
          <Link to="/admin" className="link">
            Admin Login/Edit
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
