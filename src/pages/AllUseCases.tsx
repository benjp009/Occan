import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { fetchUseCases } from '../utils/api';
import { UseCaseRow } from '../types';
import Skeleton from 'react-loading-skeleton';
import { Link } from 'react-router-dom';
import { sanitizeHTML } from '../utils/sanitize';

interface AllUseCasesProps {
  initialUseCases?: UseCaseRow[] | null;
}

export default function AllUseCases({ initialUseCases }: AllUseCasesProps) {
  const [useCases, setUseCases] = useState<UseCaseRow[] | null>(
    initialUseCases ?? null,
  );

  useEffect(() => {
    if (!initialUseCases) {
      fetchUseCases().then((data) => {
        const sortedData = data.sort((a, b) =>
          a.usecase_name.localeCompare(b.usecase_name, 'fr', { sensitivity: 'base' })
        );
        setUseCases(sortedData);
      });
    }
  }, [initialUseCases]);

  return (
    <>
      <Helmet>
        <title>Tous les cas d'usage - Logiciels français | Logiciel France</title>
        <meta name="description" content="Découvrez tous les cas d'usage des logiciels français. Trouvez le meilleur logiciel pour chaque besoin : gestion de projet, marketing, comptabilité, et plus encore." />
        <meta name="keywords" content="cas d'usage logiciels, meilleur logiciel pour, solutions françaises, logiciels par besoin" />
        <meta property="og:title" content="Tous les cas d'usage - Logiciels français | Logiciel France" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://logicielfrance.com/cas-d-usage" />
        <meta property="og:description" content="Découvrez tous les cas d'usage des logiciels français. Trouvez le meilleur logiciel pour chaque besoin." />
      </Helmet>
      <Header />
      <main className="container-all-usecases">
        {/* Breadcrumbs */}
        <nav className="breadcrumb">
          <Link to="/" className="breadcrumb-link">Accueil</Link>
          <span className="breadcrumb-separator"> / </span>
          <span className="breadcrumb-current">Tous les cas d'usage</span>
        </nav>
        <h1 className="page-title">Tous les cas d'usage</h1>
        <p className="page-subtitle">Trouvez le meilleur logiciel français pour chaque besoin</p>
        <div className="usecases-section">
          <div className="usecases-grid">
            {(useCases || Array.from({ length: 12 })).map((useCase, idx) => {
              if (useCases) {
                const uc = useCase as UseCaseRow;
                const truncatedDescription =
                  uc.description.length > 100
                    ? uc.description.slice(0, 100).trimEnd() + '…'
                    : uc.description;
                return (
                  <Link
                    key={uc.slug}
                    className="usecase-card"
                    to={`/meilleur-logiciel-pour/${uc.slug}`}
                  >
                    <h3 className="usecase-card__title">{uc.usecase_name}</h3>
                    <p
                      className="usecase-card__desc"
                      dangerouslySetInnerHTML={{ __html: sanitizeHTML(truncatedDescription) }}
                    />
                    <span className="usecase-card__link">
                      Voir les logiciels →
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
