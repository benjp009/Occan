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

type FocusSource = 'header' | 'hero' | null;

export default function Home() {
  const [companies, setCompanies] = useState<CompanyRow[]>([]);
  const [search, setSearch] = useState('');
  const [focusSource, setFocusSource] = useState<FocusSource>(null);
  const metrics = useMetrics();


  useEffect(() => {
    fetchCompanies().then(data => setCompanies(data));
  }, []);

// ▸ close dropdowns when user clicks outside any search container
  useEffect(() => {
    function handleClickAway() {
    setFocusSource(null);      // hide dropdowns
  }

  document.addEventListener('click', handleClickAway);
  return () => document.removeEventListener('click', handleClickAway);
}, []);

  const filteredCompanies = filterCompanies(search, companies);

  return (
    <>
      <Header
        search={search}
        onSearch={setSearch}
        results={filteredCompanies}   // ⬅️ new prop
        onFocus={() => setFocusSource('header')}
        active={focusSource === 'header'}
      />
      <Hero
        search={search}
        onSearch={setSearch}
        results={filteredCompanies}
        onFocus={() => setFocusSource('hero')}
        active={focusSource === 'hero'}
      /> 
      <CategoriesSection />

      <main className="banner-container">

        
      {metrics ? (
        <MetricsBanner
          totalSoftwares={metrics.totalSoftwares}
          totalCategories={metrics.totalCategories}
          visitsPerMonth={metrics.visitsPerMonth}
          frenchPercentage={metrics.frenchPercentage}
        />
      ) : (
        <p>Chargement des données</p>
      )}

      <SelectionOfTheMonth companies={filteredCompanies} />
      </main>
      <Footer />
    </>
  );
}
