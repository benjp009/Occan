import type { GetStaticProps } from 'next';
import { fetchCompanies } from '../src/utils/api';
import { CompanyRow } from '../src/types';
import { Header } from '../src/components/Header';
import { Hero } from '../src/components/Hero';
import { CategoriesSection } from '../src/components/Category';
import MetricsBanner from '../src/components/MetricsBanner';
import { useMetrics } from '../src/utils/useMetrics';
import { SelectionOfTheMonth } from '../src/components/SelectionOfTheMonth';
import ClockLoader from '../src/components/ClockLoader';
import { Footer } from '../src/components/Footer';

interface HomeProps {
  companies: CompanyRow[];
}

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const companies = await fetchCompanies();
  return {
    props: { companies },
    revalidate: 86400,
  };
};

export default function Home({ companies }: HomeProps) {
  const metrics = useMetrics();
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
