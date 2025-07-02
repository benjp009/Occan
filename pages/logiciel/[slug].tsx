import Link from 'next/link';
import type { GetStaticPaths, GetStaticProps } from 'next';
import { fetchCompanies } from '../../src/utils/api';
import { CompanyRow } from '../../src/types';
import { slugify } from '../../src/utils/slugify';
import { Header } from '../../src/components/Header';
import { Footer } from '../../src/components/Footer';
import Company from '../../src/components/Company';
import CompanySkeleton from '../../src/components/CompanySkeleton';

interface Props {
  company: CompanyRow | null;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const companies = await fetchCompanies();
  const paths = companies.map(c => ({ params: { slug: slugify(c.name) } }));
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const slug = params?.slug as string;
  const companies = await fetchCompanies();
  const company = companies.find(c => slugify(c.name) === slug || c.id === slug) || null;
  return { props: { company }, revalidate: 86400 };
};

export default function SoftwarePage({ company }: Props) {
  if (company === null) {
    return (
      <>
        <Header />
        <main className="container-category">
          <p>Logiciel introuvable.</p>
        </main>
        <Footer />
      </>
    );
  }

  if (!company) {
    return (
      <>
        <Header />
        <main className="container-category">
          <CompanySkeleton />
        </main>
        <Footer />
      </>
    );
  }

  const firstCategory = company.categories ? company.categories.split(',')[0].trim() : '';

  return (
    <>
      <Header />
      <main className="container-category">
        <nav className="breadcrumbs">
          <Link href="/">Accueil</Link> /{' '}
          {firstCategory && (
            <>
              <Link href={`/categorie/${slugify(firstCategory)}`}>{firstCategory}</Link> /{' '}
            </>
          )}
          <span>{company.name}</span>
        </nav>
        <Company company={company} />
      </main>
      <Footer />
    </>
  );
}
