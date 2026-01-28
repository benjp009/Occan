import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { fetchCompetitors } from '../utils/api';
import { CompetitorRow } from '../types';
import Skeleton from 'react-loading-skeleton';
import { Link } from 'react-router-dom';
import { sanitizeHTML } from '../utils/sanitize';

interface AllAlternativesProps {
  initialCompetitors?: CompetitorRow[] | null;
}

export default function AllAlternatives({ initialCompetitors }: AllAlternativesProps) {
  const [competitors, setCompetitors] = useState<CompetitorRow[] | null>(
    initialCompetitors ?? null,
  );

  useEffect(() => {
    if (!initialCompetitors) {
      fetchCompetitors().then((data) => {
        const sortedData = data.sort((a, b) =>
          a.competitor_name.localeCompare(b.competitor_name, 'fr', { sensitivity: 'base' })
        );
        setCompetitors(sortedData);
      });
    }
  }, [initialCompetitors]);

  return (
    <>
      <Helmet>
        <title>Toutes les alternatives françaises | Logiciel France</title>
        <meta name="description" content="Découvrez les alternatives françaises aux logiciels internationaux. Remplacez vos outils par des solutions Made in France : souveraineté, RGPD, support local." />
        <meta name="keywords" content="alternatives françaises, logiciels français, remplacer logiciel américain, solutions souveraines, Made in France" />
        <meta property="og:title" content="Toutes les alternatives françaises | Logiciel France" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://logicielfrance.com/alternatives" />
        <meta property="og:description" content="Découvrez les alternatives françaises aux logiciels internationaux. Solutions Made in France." />
      </Helmet>
      <Header />
      <main className="container-all-usecases">
        {/* Breadcrumbs */}
        <nav className="breadcrumb">
          <Link to="/" className="breadcrumb-link">Accueil</Link>
          <span className="breadcrumb-separator"> / </span>
          <span className="breadcrumb-current">Toutes les alternatives</span>
        </nav>
        <h1 className="page-title">Toutes les alternatives françaises</h1>
        <p className="page-subtitle">Remplacez vos logiciels par des solutions Made in France</p>
        <div className="usecases-section">
          <div className="usecases-grid">
            {(competitors || Array.from({ length: 12 })).map((competitor, idx) => {
              if (competitors) {
                const comp = competitor as CompetitorRow;
                const truncatedDescription =
                  comp.description.length > 100
                    ? comp.description.slice(0, 100).trimEnd() + '…'
                    : comp.description;
                return (
                  <Link
                    key={comp.slug}
                    className="usecase-card"
                    to={`/alternative/${comp.slug}`}
                  >
                    <h3 className="usecase-card__title">Alternative à {comp.competitor_name}</h3>
                    <p
                      className="usecase-card__desc"
                      dangerouslySetInnerHTML={{ __html: sanitizeHTML(truncatedDescription) }}
                    />
                    <span className="usecase-card__link">
                      Voir les alternatives →
                    </span>
                  </Link>
                );
              } else {
                return (
                  <div key={idx} className="usecase-card">
                    <h3 className="usecase-card__title"><Skeleton width={180} /></h3>
                    <p className="usecase-card__desc"><Skeleton width={250} height={40} /></p>
                    <span className="usecase-card__link"><Skeleton width={120} /></span>
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
