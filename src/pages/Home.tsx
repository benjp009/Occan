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
import { Footer } from '../components/Footer';
import Skeleton from 'react-loading-skeleton';


export default function Home() {
  const [companies, setCompanies] = useState<CompanyRow[] | null>(null);
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
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Skeleton height={80} width={150} />
          <Skeleton height={80} width={150} />
          <Skeleton height={80} width={150} />
          <Skeleton height={80} width={150} />
        </div>
      )}

      <SelectionOfTheMonth companies={companies} />
      </main>
      <Footer />
    </>
  );
}
