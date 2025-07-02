import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Header } from '../src/components/Header';
import { Footer } from '../src/components/Footer';
import { fetchCategories } from '../src/utils/api';
import { CategoryRow } from '../src/types';
import Skeleton from 'react-loading-skeleton';
import { slugify } from '../src/utils/slugify';

export default function AllCategory() {
  const [categories, setCategories] = useState<CategoryRow[] | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchCategories().then(data => {
      const sortedData = data.sort((a, b) => a.name.localeCompare(b.name));
      setCategories(sortedData);
    });
  }, []);

  return (
    <>
      <Header />
      <main className="container-all-categories">
        <nav className="breadcrumb">
          <Link href="/" className="breadcrumb-link">Accueil</Link>
          <span className="breadcrumb-separator"> / </span>
          <span className="breadcrumb-current">Toutes les catégories</span>
        </nav>
        <h1 className="page-title">Toutes les catégories de logiciels français</h1>
        <div className="all-categories-grid">
          {(categories || Array.from({ length: 10 })).map((category, idx) => (
            categories ? (
              <div
                key={(category as CategoryRow).id}
                className="categories-card"
                onClick={() => router.push(`/categorie/${slugify((category as CategoryRow).name)}`)}
              >
                <div className="categories-card" key={(category as CategoryRow).id}>
                  <span className="categories-name">{(category as CategoryRow).name}</span>
                  <span className="categories-count">{(category as CategoryRow).count} logiciels</span>
                </div>
              </div>
            ) : (
              <div key={idx} className="categories-card">
                <span className="categories-name"><Skeleton width={120} /></span>
                <span className="categories-count"><Skeleton width={80} /></span>
              </div>
            )
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
