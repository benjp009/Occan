import React from 'react';
import { useEffect, useState } from 'react';
import { fetchCompanies } from '../utils/api';
import { CompanyRow } from '../types';
import { Header } from '../components/Header';
import { Hero } from '../components/Hero';
import { CategoriesSection } from '../components/Category';
import MetricsBanner from '../components/MetricsBanner';
import { useMetrics } from '../utils/useMetrics';
import { SelectionOfTheMonth } from '../components/SelectionOfTheMonth';
import ClockLoader from '../components/ClockLoader';
import { Footer } from '../components/Footer';


export default function Home() {
  const [companies, setCompanies] = useState<CompanyRow[]>([]);
  const metrics = useMetrics();


  useEffect(() => {
    fetchCompanies().then(data => setCompanies(data));
  }, []);


  return (
    <>
      <Header />
      <Hero /> 
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
        <ClockLoader />
      )}

      <SelectionOfTheMonth companies={companies} />
      </main>
      <Footer />
    </>
  );
}
