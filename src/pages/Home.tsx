import React from 'react';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
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
import { SEOExternalLinks } from '../components/SEOExternalLinks';


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
      <Helmet>
        <title>Logiciel France 🇫🇷 - Annuaire des logiciels français</title>
        <meta name="description" content="Découvrez les meilleurs logiciels français. Annuaire complet des solutions software made in France pour tous vos besoins professionnels." />
        <meta name="keywords" content="logiciel français, software france, annuaire logiciel, made in france" />
        <link rel="canonical" href="https://logicielfrance.com/" />
        <meta property="og:title" content="Logiciel France - Annuaire des logiciels français" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://logicielfrance.com/" />
        <meta property="og:description" content="Découvrez les meilleurs logiciels français. Annuaire complet des solutions software made in France." />
      </Helmet>
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
      
      {/* SEO External Links - Crawlable by search engines */}
      <SEOExternalLinks companies={companies} />
      </main>
      <Footer />
    </>
  );
}
