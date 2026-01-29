import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { fetchCategories } from '../utils/api';
import { CategoryRow } from '../types';
import Skeleton from 'react-loading-skeleton';
import { Link } from 'react-router-dom';
import { slugify } from '../utils/slugify';
import { sanitizeHTML } from '../utils/sanitize';
import { getCategoryIconUrl } from '../utils/imageUtils';



interface AllCategoryProps {
  initialCategories?: CategoryRow[] | null;
}

export default function AllCategory({ initialCategories }: AllCategoryProps) {
  const [categories, setCategories] = useState<CategoryRow[] | null>(
    initialCategories ?? null,
  );


  useEffect(() => {
    if (!initialCategories) {
      fetchCategories().then((data) => {
        const sortedData = data.sort((a, b) => a.name.localeCompare(b.name));
        setCategories(sortedData);
      });
    }
  }, [initialCategories]);

  return (
    <>
      <Helmet>
        <title>Toutes les catégories - Logiciels français | Logiciel France</title>
        <meta name="description" content="Explorez toutes les catégories de logiciels français. Marketing, CRM, comptabilité, design... Trouvez la solution parfaite pour votre entreprise." />
        <meta name="keywords" content="catégories logiciels français, types de logiciels, software categories france, solutions entreprise" />
        <meta property="og:title" content="Toutes les catégories - Logiciels français | Logiciel France" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://logicielfrance.com/categorie" />
        <meta property="og:description" content="Explorez toutes les catégories de logiciels français. Trouvez la solution parfaite pour votre entreprise." />
      </Helmet>
      <Header />
      <main className="container-all-categories">
        {/* Breadcrumbs */}
        <nav className="breadcrumb">
          <Link to="/" className="breadcrumb-link">Accueil</Link>
          <span className="breadcrumb-separator"> / </span>
          <span className="breadcrumb-current">Toutes les catégories</span>
        </nav>
        <h1 className="page-title">Toutes les catégories de logiciels français</h1>
        <div className="categories-section">
          <div className="categories-grid">
            {(categories || Array.from({ length: 10 })).map((category, idx) => {
              if (categories) {
                const truncatedDescription =
                  (category as CategoryRow).description.length > 50
                    ? (category as CategoryRow).description.slice(0, 50).trimEnd() + '…'
                    : (category as CategoryRow).description;
                return (
                  <Link
                    key={(category as CategoryRow).id}
                    className="category-card"
                    to={`/categorie/${slugify((category as CategoryRow).name)}`}
                  >
                    <img
                      src={getCategoryIconUrl((category as CategoryRow).icon)}
                      alt={`${(category as CategoryRow).name} icon`}
                      className="category-card__icon"
                      loading="lazy"
                    />
                    <h3 className="category-card__title">{(category as CategoryRow).name}</h3>
                    <p
                      className="category-card__desc"
                      dangerouslySetInnerHTML={{ __html: sanitizeHTML(truncatedDescription) }}
                    />
                    <p className="category-card__count">
                      {(category as CategoryRow).count} logiciels
                    </p>
                  </Link>
                );
              } else {
                return (
                  <div key={idx} className="category-card">
                    <div className="category-card__icon"><Skeleton width={40} height={40} /></div>
                    <h3 className="category-card__title"><Skeleton width={120} /></h3>
                    <p className="category-card__desc"><Skeleton width={150} height={40} /></p>
                    <p className="category-card__count"><Skeleton width={80} /></p>
                  </div>
                );
              }
            })}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
