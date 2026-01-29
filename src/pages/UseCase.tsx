import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { fetchUseCases, fetchCompanies } from '../utils/api';
import { UseCaseRow, CompanyRow } from '../types';
import { Cards } from '../components/Cards';
import { slugify } from '../utils/slugify';
import CardSkeleton from '../components/CardSkeleton';
import Skeleton from 'react-loading-skeleton';

interface UseCaseProps {
  initialUseCase?: UseCaseRow | null;
  initialCompanies?: CompanyRow[] | null;
}

export default function UseCase({ initialUseCase, initialCompanies }: UseCaseProps) {
  const { slug } = useParams<{ slug: string }>();
  const [useCase, setUseCase] = useState<UseCaseRow | null>(initialUseCase ?? null);
  const [filteredCompanies, setFilteredCompanies] = useState<CompanyRow[] | null>(initialCompanies ?? null);

  useEffect(() => {
    if (!initialUseCase) {
      fetchUseCases().then(useCases => {
        const found = useCases.find(u => u.slug === slug);
        setUseCase(found || null);
      });
    }
    if (!initialCompanies) {
      Promise.all([fetchUseCases(), fetchCompanies()]).then(([useCases, companies]) => {
        const uc = useCases.find(u => u.slug === slug);
        if (uc) {
          const useCaseCategories = uc.categories.split(',').map(c => c.trim().toLowerCase());
          const filtered = companies.filter(company => {
            if (!company.categories) return false;
            const companyCategories = company.categories.split(',').map(c => c.trim().toLowerCase());
            return useCaseCategories.some(cat => companyCategories.includes(cat));
          });
          setFilteredCompanies(filtered);
        }
      });
    }
  }, [slug, initialUseCase, initialCompanies]);

  const formattedName = useCase?.usecase_name || slug?.replace(/-/g, ' ') || '';

  return (
    <>
      <Helmet>
        <title>
          {useCase
            ? `Meilleur logiciel pour ${useCase.usecase_name} | Logiciel France`
            : `Meilleur logiciel français | Logiciel France`
          }
        </title>
        <meta
          name="description"
          content={useCase
            ? `Découvrez les meilleurs logiciels français pour ${useCase.usecase_name}. Solutions Made in France adaptées à vos besoins.`
            : `Découvrez les meilleurs logiciels français pour vos besoins professionnels.`
          }
        />
        <meta name="keywords" content={`meilleur logiciel ${formattedName}, logiciel français, made in france, ${useCase?.categories || ''}`} />

        <meta property="og:title" content={`Meilleur logiciel pour ${formattedName}`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://logicielfrance.com/meilleur-logiciel-pour/${slug}`} />
        <meta property="og:description" content={useCase ? `Meilleurs logiciels français pour ${useCase.usecase_name}` : 'Meilleurs logiciels français'} />
        <meta property="og:site_name" content="Logiciel France" />
        <meta property="og:locale" content="fr_FR" />

        {useCase && filteredCompanies && (
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "CollectionPage",
              "name": `Meilleurs logiciels pour ${useCase.usecase_name}`,
              "description": `Découvrez les meilleurs logiciels français pour ${useCase.usecase_name}`,
              "url": `https://logicielfrance.com/meilleur-logiciel-pour/${slug}`,
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
        {useCase && (
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Accueil", "item": "https://logicielfrance.com" },
                { "@type": "ListItem", "position": 2, "name": `Meilleur logiciel pour ${useCase.usecase_name}`, "item": `https://logicielfrance.com/meilleur-logiciel-pour/${slug}` }
              ]
            })}
          </script>
        )}
      </Helmet>

      <Header />

      <main className="container-category usecase-page">
        <nav className="breadcrumbs">
          <Link to="/">Accueil</Link> /{' '}
          <span>Meilleur logiciel pour {formattedName}</span>
        </nav>

        {useCase ? (
          <>
            <h1>Meilleur logiciel pour {useCase.usecase_name}</h1>
            <p className="category-description">
              {useCase.description || `Découvrez les meilleurs logiciels français pour ${useCase.usecase_name}. Des solutions Made in France adaptées à vos besoins professionnels.`}
            </p>
          </>
        ) : (
          <>
            <h1><Skeleton width={350} /></h1>
            <p className="category-description"><Skeleton count={2} /></p>
          </>
        )}

        <div className="selection-grid">
          {filteredCompanies === null ? (
            Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="card-wrapper">
                <CardSkeleton />
              </div>
            ))
          ) : filteredCompanies.length === 0 ? (
            <p>Aucun logiciel français trouvé pour ce cas d'usage.</p>
          ) : (
            filteredCompanies.map(company => (
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
