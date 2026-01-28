import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { fetchCompetitors, fetchCompanies } from '../utils/api';
import { CompetitorRow, CompanyRow } from '../types';
import { Cards } from '../components/Cards';
import { slugify } from '../utils/slugify';
import CardSkeleton from '../components/CardSkeleton';
import Skeleton from 'react-loading-skeleton';

interface AlternativeProps {
  initialCompetitor?: CompetitorRow | null;
  initialAlternatives?: CompanyRow[] | null;
}

export default function Alternative({ initialCompetitor, initialAlternatives }: AlternativeProps) {
  const { slug } = useParams<{ slug: string }>();
  const [competitor, setCompetitor] = useState<CompetitorRow | null>(initialCompetitor ?? null);
  const [alternatives, setAlternatives] = useState<CompanyRow[] | null>(initialAlternatives ?? null);

  useEffect(() => {
    if (!initialCompetitor) {
      fetchCompetitors().then(competitors => {
        const found = competitors.find(c => c.slug === slug);
        setCompetitor(found || null);
      });
    }
    if (!initialAlternatives) {
      Promise.all([fetchCompetitors(), fetchCompanies()]).then(([competitors, companies]) => {
        const comp = competitors.find(c => c.slug === slug);
        if (comp) {
          const competitorCategories = comp.categories.split(',').map(c => c.trim().toLowerCase());
          const filtered = companies.filter(company => {
            if (!company.categories) return false;
            const companyCategories = company.categories.split(',').map(c => c.trim().toLowerCase());
            return competitorCategories.some(cat => companyCategories.includes(cat));
          });
          setAlternatives(filtered);
        }
      });
    }
  }, [slug, initialCompetitor, initialAlternatives]);

  return (
    <>
      <Helmet>
        <title>
          {competitor
            ? `Alternative française a ${competitor.competitor_name} | Logiciel France`
            : `Alternative française | Logiciel France`
          }
        </title>
        <meta
          name="description"
          content={competitor
            ? `Découvrez les meilleures alternatives françaises à ${competitor.competitor_name}. Solutions Made in France pour remplacer ${competitor.competitor_name}.`
            : `Découvrez les meilleures alternatives françaises aux logiciels étrangers.`
          }
        />
        <meta name="keywords" content={`alternative ${competitor?.competitor_name || ''}, logiciel français, made in france, ${competitor?.categories || ''}`} />

        <meta property="og:title" content={`Alternative française à ${competitor?.competitor_name || 'logiciels étrangers'}`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://logicielfrance.com/alternative/${slug}`} />
        <meta property="og:description" content={competitor ? `Alternatives françaises a ${competitor.competitor_name}` : 'Alternatives françaises'} />
        <meta property="og:site_name" content="Logiciel France" />
        <meta property="og:locale" content="fr_FR" />

        {competitor && alternatives && (
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "CollectionPage",
              "name": `Alternatives françaises a ${competitor.competitor_name}`,
              "description": `Découvrez les meilleures alternatives françaises à ${competitor.competitor_name}`,
              "url": `https://logicielfrance.com/alternative/${slug}`,
              "mainEntity": {
                "@type": "ItemList",
                "itemListElement": alternatives.slice(0, 10).map((company, index) => ({
                  "@type": "ListItem",
                  "position": index + 1,
                  "name": company.name,
                  "url": `https://logicielfrance.com/logiciel/${slugify(company.name)}`
                }))
              }
            })}
          </script>
        )}
        {competitor && (
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Accueil", "item": "https://logicielfrance.com" },
                { "@type": "ListItem", "position": 2, "name": "Alternatives", "item": "https://logicielfrance.com/alternative" },
                { "@type": "ListItem", "position": 3, "name": `Alternative à ${competitor.competitor_name}`, "item": `https://logicielfrance.com/alternative/${slug}` }
              ]
            })}
          </script>
        )}
      </Helmet>

      <Header />

      <main className="container-category alternative-page">
        <nav className="breadcrumbs">
          <Link to="/">Accueil</Link> /{' '}
          <span>Alternative a {competitor?.competitor_name || slug}</span>
        </nav>

        {competitor ? (
          <>
            <h1>Alternative française à {competitor.competitor_name}</h1>
            <p className="category-description">
              {competitor.description || `Découvrez les meilleures alternatives françaises à ${competitor.competitor_name}. Des solutions Made in France pour remplacer ce logiciel étranger.`}
            </p>
          </>
        ) : (
          <>
            <h1><Skeleton width={300} /></h1>
            <p className="category-description"><Skeleton count={2} /></p>
          </>
        )}

        <div className="selection-grid">
          {alternatives === null ? (
            Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="card-wrapper">
                <CardSkeleton />
              </div>
            ))
          ) : alternatives.length === 0 ? (
            <p>Aucune alternative française trouvée pour le moment.</p>
          ) : (
            alternatives.map(company => (
              <div key={company.id} className="card-wrapper">
                <Cards
                  company={company}
                  internalTo={`/logiciel/${slugify(company.name)}`}
                />
              </div>
            ))
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
