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


interface HomeProps {
  initialCompanies?: CompanyRow[] | null;
}

export default function Home({ initialCompanies }: HomeProps) {
  const [companies, setCompanies] = useState<CompanyRow[] | null>(
    initialCompanies ?? null,
  );
  const metrics = useMetrics();


  useEffect(() => {
    if (!initialCompanies) {
      fetchCompanies().then(data => setCompanies(data));
    }
  }, [initialCompanies]);


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
