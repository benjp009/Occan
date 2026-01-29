import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { fetchGlossary } from '../utils/api';
import { GlossaryRow } from '../types';
import Skeleton from 'react-loading-skeleton';
import { Link } from 'react-router-dom';

interface AllGlossaryProps {
  initialGlossary?: GlossaryRow[] | null;
}

export default function AllGlossary({ initialGlossary }: AllGlossaryProps) {
  const [glossary, setGlossary] = useState<GlossaryRow[] | null>(
    initialGlossary ?? null,
  );
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!initialGlossary) {
      fetchGlossary().then((data) => {
        const sortedData = data.sort((a, b) =>
          a.term_name.localeCompare(b.term_name, 'fr', { sensitivity: 'base' })
        );
        setGlossary(sortedData);
      });
    }
  }, [initialGlossary]);

  const filteredGlossary = glossary?.filter(entry =>
    entry.term_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Helmet>
        <title>Glossaire - Definitions des termes logiciels | Logiciel France</title>
        <meta name="description" content="Decouvrez notre glossaire complet des termes logiciels : SaaS, CRM, ERP et plus encore. Definitions claires et exemples de solutions francaises." />
        <meta name="keywords" content="glossaire logiciel, definition SaaS, definition CRM, definition ERP, termes informatiques" />
        <meta property="og:title" content="Glossaire - Definitions des termes logiciels | Logiciel France" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://logicielfrance.com/glossaire" />
        <meta property="og:description" content="Decouvrez notre glossaire complet des termes logiciels : SaaS, CRM, ERP et plus encore." />
        <meta property="og:site_name" content="Logiciel France" />
        <meta property="og:locale" content="fr_FR" />

        {/* Canonical URL */}
        <link rel="canonical" href="https://logicielfrance.com/glossaire" />
        <link rel="alternate" hrefLang="fr" href="https://logicielfrance.com/glossaire" />
        <link rel="alternate" hrefLang="x-default" href="https://logicielfrance.com/glossaire" />

        {/* DefinedTermSet Schema */}
        {glossary && (
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "DefinedTermSet",
              "name": "Glossaire Logiciel France",
              "description": "Glossaire des termes logiciels et technologies",
              "url": "https://logicielfrance.com/glossaire",
              "hasDefinedTerm": glossary.map(entry => ({
                "@type": "DefinedTerm",
                "name": entry.term_name,
                "description": entry.short_definition,
                "url": `https://logicielfrance.com/glossaire/${entry.slug}`
              }))
            })}
          </script>
        )}

        {/* BreadcrumbList Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Accueil", "item": "https://logicielfrance.com" },
              { "@type": "ListItem", "position": 2, "name": "Glossaire", "item": "https://logicielfrance.com/glossaire" }
            ]
          })}
        </script>
      </Helmet>

      <Header />

      <main className="container-all-glossary">
        {/* Breadcrumbs */}
        <nav className="breadcrumb">
          <Link to="/" className="breadcrumb-link">Accueil</Link>
          <span className="breadcrumb-separator"> / </span>
          <span className="breadcrumb-current">Glossaire</span>
        </nav>

        <h1 className="page-title">Glossaire des termes logiciels</h1>
        <p className="page-subtitle">Definitions claires et exemples de solutions francaises</p>

        {/* Search */}
        <div className="glossary-search">
          <input
            type="text"
            placeholder="Rechercher un terme..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="glossary-search-input"
          />
        </div>

        <div className="glossary-section">
          <div className="glossary-grid">
            {(filteredGlossary || Array.from({ length: 8 })).map((entry, idx) => {
              if (filteredGlossary) {
                const g = entry as GlossaryRow;
                const truncatedDefinition =
                  g.short_definition.length > 120
                    ? g.short_definition.slice(0, 120).trimEnd() + '...'
                    : g.short_definition;
                return (
                  <Link
                    key={g.slug}
                    className="glossary-card"
                    to={`/glossaire/${g.slug}`}
                  >
                    <h3 className="glossary-card__title">{g.term_name}</h3>
                    <p className="glossary-card__desc">{truncatedDefinition}</p>
                    <span className="glossary-card__link">
                      Lire la definition
                    </span>
                  </Link>
                );
              } else {
                return (
                  <div key={idx} className="glossary-card">
                    <h3 className="glossary-card__title"><Skeleton width={150} /></h3>
                    <p className="glossary-card__desc"><Skeleton width={250} height={40} /></p>
                    <span className="glossary-card__link"><Skeleton width={120} /></span>
                  </div>
                );
              }
            })}
          </div>

          {filteredGlossary && filteredGlossary.length === 0 && (
            <p className="glossary-empty">Aucun terme trouve pour "{searchTerm}"</p>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
