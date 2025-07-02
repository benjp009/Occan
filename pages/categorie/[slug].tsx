import { useRouter } from 'next/router';
import Link from 'next/link';
import type { GetStaticPaths, GetStaticProps } from 'next';
import { fetchCategories, fetchCompanies } from '../../src/utils/api';
import { CategoryRow, CompanyRow } from '../../src/types';
import { slugify } from '../../src/utils/slugify';
import { Header } from '../../src/components/Header';
import { Footer } from '../../src/components/Footer';
import { Cards } from '../../src/components/Cards';
import CardSkeleton from '../../src/components/CardSkeleton';
import Skeleton from 'react-loading-skeleton';

interface Props {
  category: CategoryRow | null;
  companies: CompanyRow[];
}

export const getStaticPaths: GetStaticPaths = async () => {
  const categories = await fetchCategories();
  const paths = categories.map(c => ({ params: { slug: slugify(c.name) } }));
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const slug = params?.slug as string;
  const categories = await fetchCategories();
  const companies = await fetchCompanies();
  const category = categories.find(c => c.id === slug || slugify(c.name) === slug) || null;
  return { props: { category, companies }, revalidate: 86400 };
};

export default function CategoryPage({ category, companies }: Props) {
  const router = useRouter();
  const filteredCompanies = category
    ? companies.filter(co => {
        if (!co.categories) return false;
        return co.categories
          .split(',')
          .map(c => c.trim().toLowerCase())
          .includes(category.name.toLowerCase());
      })
    : [];

  const openCompanyPage = (company: CompanyRow) => {
    router.push(`/logiciel/${slugify(company.name)}`);
  };

  return (
    <>
      <Header />
      <main className="container-category category-page">
        <nav className="breadcrumbs">
          <Link href="/">Accueil</Link> /{' '}
          <Link href="/toutes-categories">Toutes les catégories</Link> /{' '}
          <span>{category?.name || router.query.slug}</span>
        </nav>
        {category ? (
          <>
            <h1>{category.name}</h1>
            <p className="category-description" dangerouslySetInnerHTML={{ __html: category.description }} />
          </>
        ) : (
          <>
            <h1><Skeleton width={200} /></h1>
            <p className="category-description"><Skeleton count={2} /></p>
          </>
        )}
        <div className="selection-grid">
          {(companies ? filteredCompanies : Array.from({ length: 6 })).map((company, idx) => (
            company ? (
              <a
                key={(company as CompanyRow).id}
                className="card-wrapper"
                href={`/logiciel/${slugify((company as CompanyRow).name)}`}
                onClick={e => {
                  e.preventDefault();
                  openCompanyPage(company as CompanyRow);
                }}
              >
                <Cards company={company as CompanyRow} />
              </a>
            ) : (
              <div key={idx} className="card-wrapper">
                <CardSkeleton />
              </div>
            )
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
