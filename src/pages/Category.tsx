import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { slugify } from '../utils/slugify';
import { sanitizeHTML } from '../utils/sanitize';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { fetchCategories, fetchCompanies } from '../utils/api';
import { CategoryRow, CompanyRow, BlogPost } from '../types';
import { Cards } from '../components/Cards';
import CardSkeleton from '../components/CardSkeleton';
import Skeleton from 'react-loading-skeleton';
import RelatedArticles from '../components/RelatedArticles';

interface CategoryProps {
  initialCategory?: CategoryRow | null;
  initialCompanies?: CompanyRow[] | null;
  initialRelatedPosts?: BlogPost[] | null;
}

export default function Category({ initialCategory, initialCompanies, initialRelatedPosts }: CategoryProps) {
  const { slug } = useParams<{ slug: string }>();
  const [category, setCategory] = useState<CategoryRow | null>(initialCategory ?? null);
  const [companies, setCompanies] = useState<CompanyRow[] | null>(initialCompanies ?? null);


  useEffect(() => {
    if (!initialCategory || (initialCategory && initialCategory.id !== slug && slugify(initialCategory.name) !== slug)) {
      fetchCategories().then(cats => {
        const found = cats.find(
          c => c.id === slug || slugify(c.name) === slug
        );
        setCategory(found || null);
      });
    }
    if (!initialCompanies) {
      fetchCompanies().then(setCompanies);
    }
  }, [slug, initialCategory, initialCompanies]);

  const filteredCompanies = category && companies
    ? companies.filter(co => {
        if (!co.categories) return false;
        return co.categories
          .split(',')
          .map(c => c.trim().toLowerCase())
          .includes(category.name.toLowerCase());
      })
    : [];


  return (
    <>
      <Helmet>
        <title>
          {category && category.name && typeof category.name === 'string'
            ? `${category.name} - Logiciels français | Logiciel France`
            : slug && typeof slug === 'string'
            ? `${slug} - Logiciels français | Logiciel France`
            : 'Logiciels français | Logiciel France'
          }
        </title>
        {category?.meta_description && (
          <meta name="description" content={category.meta_description.replace(/<[^>]*>/g, '').slice(0, 160)} />
        )}
        <meta name="keywords" content={`${category?.name || slug}, logiciel français, software, France`} />
        
        
        <meta property="og:title" content={`${category?.name || slug} - Logiciels français`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://logicielfrance.com/categorie/${slug}`} />
        {category?.meta_description && (
          <meta property="og:description" content={category.meta_description.replace(/<[^>]*>/g, '').slice(0, 160)} />
        )}
        <meta property="og:site_name" content="Logiciel France" />
        <meta property="og:locale" content="fr_FR" />
        
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={`${category?.name || slug} - Logiciels français`} />
        {category?.meta_description && (
          <meta name="twitter:description" content={category.meta_description.replace(/<[^>]*>/g, '').slice(0, 160)} />
        )}
        {category && (
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "CollectionPage",
              "name": `${category.name} - Logiciels francais`,
              "description": category.meta_description?.replace(/<[^>]*>/g, '').slice(0, 160) || `Decouvrez les meilleurs logiciels francais de ${category.name}`,
              "url": `https://logicielfrance.com/categorie/${slug}`,
              "mainEntity": {
                "@type": "ItemList",
                "itemListElement": filteredCompanies.slice(0, 10).map((company, index) => ({
                  "@type": "ListItem",
                  "position": index + 1,
                  "name": company.name,
                  "url": `https://logicielfrance.com/logiciel/${slugify(company.name)}`
                }))
              }
            })}
          </script>
        )}
        {category && (
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Accueil",
                  "item": "https://logicielfrance.com"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Categories",
                  "item": "https://logicielfrance.com/categorie"
                },
                {
                  "@type": "ListItem",
                  "position": 3,
                  "name": category.name,
                  "item": `https://logicielfrance.com/categorie/${slug}`
                }
              ]
            })}
          </script>
        )}
      </Helmet>
      <Header />
      <main className="container-category category-page">
        <nav className="breadcrumbs">
          <Link to="/">Accueil</Link> /{' '}
          <Link to="/categorie">Toutes les catégories</Link> /{' '}
          <span>{category?.name || slug}</span>
        </nav>
        {category ? (
          <>
            <h1>{category.name}</h1>
            <p
              className="category-description"
              dangerouslySetInnerHTML={{ __html: sanitizeHTML(category.long_description || category.description) }}
            />
          </>
          ) : (
          <>
            <h1><Skeleton width={200} /></h1>
            <p className="category-description"><Skeleton count={2} /></p>
          </>
        )}
        <div className="selection-grid">
          {(companies ? filteredCompanies : Array.from({ length: 6 })).map((company, idx) => (
            companies ? (
              <div key={(company as CompanyRow).id} className="card-wrapper">
                <Cards
                  company={company as CompanyRow}
                  internalTo={`/logiciel/${slugify((company as CompanyRow).name)}`}
                />
              </div>
            ) : (
              <div key={idx} className="card-wrapper">
                <CardSkeleton />
              </div>
            )
          ))}
        </div>

        {/* Related articles section */}
        {category && (
          <RelatedArticles
            categoryName={category.name}
            initialPosts={initialRelatedPosts || undefined}
            limit={6}
          />
        )}
      </main>
      <Footer />
    </>
  );
}
