import React from 'react';
import { useEffect, useState } from 'react';
import { fetchCompanies } from '../utils/api';
import { filterCompanies } from '../utils/search';
import { CompanyRow } from '../types';
import { Header } from '../components/Header';
import { Hero } from '../components/Hero';
import { CategoriesSection } from '../components/Category';
import MetricsBanner from '../components/MetricsBanner';
import { useMetrics } from '../utils/useMetrics';
import { SelectionOfTheMonth } from '../components/SelectionOfTheMonth';
import { Footer } from '../components/Footer';


export default function Home() {
  const [companies, setCompanies] = useState<CompanyRow[]>([]);
  const [search, setSearch] = useState('');
  const metrics = useMetrics();


  useEffect(() => {
    fetchCompanies().then(data => setCompanies(data));
  }, []);

  const filteredCompanies = filterCompanies(search, companies);

  return (
    <>
      <Header
      search={search}
      onSearch={setSearch}
      results={filteredCompanies}   // ⬅️ new prop
      />
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

      <SelectionOfTheMonth companies={filteredCompanies} />
      </main>
      <Footer />
    </>
  );
}
