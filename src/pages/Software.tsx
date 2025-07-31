import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, Link } from 'react-router-dom';
import { fetchCompanies } from '../utils/api';
import { CompanyRow } from '../types';
import { slugify } from '../utils/slugify';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import Company from '../components/Company';
import CompanySkeleton from '../components/CompanySkeleton';

interface SoftwareProps {
  initialCompany?: CompanyRow | null;
}

export default function Software({ initialCompany }: SoftwareProps) {
  const { slug } = useParams<{ slug: string }>();
  const [company, setCompany] = useState<CompanyRow | null | undefined>(
    initialCompany === undefined ? undefined : initialCompany
  );

  useEffect(() => {
    if (
      !initialCompany ||
      (initialCompany &&
        slug &&
        slugify(initialCompany.name) !== slug &&
        initialCompany.id !== slug)
    ) {
      fetchCompanies().then(data => {
        const found = data.find(
          c => slugify(c.name) === slug || c.id === slug
        );
        setCompany(found || null);
      });
    }
  }, [slug, initialCompany]);

  if (company === undefined) {
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

  const firstCategory = company.categories
    ? company.categories.split(',')[0].trim()
    : '';

  return (
    <>
      <Helmet>
        <title>{company.name && typeof company.name === 'string' ? `${company.name} - Logiciel français | Logiciel France` : 'Logiciel français | Logiciel France'}</title>
        {company.meta_description ? (
          <meta name="description" content={company.meta_description.length > 160 ? `${company.meta_description.substring(0, 157)}...` : company.meta_description} />
        ) : (
          <meta name="description" content={`Découvrez ${company.name}, logiciel français${firstCategory ? ` de ${firstCategory.toLowerCase()}` : ''}. Solution innovante développée en France.`} />
        )}
        {company.keywords && (
          <meta name="keywords" content={company.keywords} />
        )}
        
        {/* Open Graph tags for social media */}
        <meta property="og:title" content={`${company.name} - Logiciel français`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://logicielfrance.com/logiciel/${slugify(company.name)}`} />
        {company.meta_description && (
          <meta property="og:description" content={company.meta_description} />
        )}
        {company.logo && (
          <meta property="og:image" content={company.logo} />
        )}
        <meta property="og:site_name" content="Logiciel France" />
        <meta property="og:locale" content="fr_FR" />
        
        {/* Canonical URL and hreflang */}
        <link rel="canonical" href={`https://logicielfrance.com/logiciel/${slugify(company.name)}`} />
        <link rel="alternate" hrefLang="fr" href={`https://logicielfrance.com/logiciel/${slugify(company.name)}`} />
        <link rel="alternate" hrefLang="x-default" href={`https://logicielfrance.com/logiciel/${slugify(company.name)}`} />
        
        {/* Preload hints for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {company.logo && (
          <link rel="preload" as="image" href={company.logo} />
        )}
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${company.name} - Logiciel français`} />
        {company.meta_description && (
        <meta name="twitter:description" content={company.meta_description} />
        )}
        {company.logo && (
          <meta name="twitter:image" content={company.logo} />
        )}
        
        {/* Additional SEO meta tags */}
        <meta name="author" content="Logiciel France" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="fr" />
        {company.categories && (
          <meta name="category" content={company.categories.split(',')[0].trim()} />
        )}
        
        {/* JSON-LD Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": company.name,
              "description": company.meta_description || company.description,
              "url": company.website,
              "applicationCategory": company.categories?.split(',')[0]?.trim(),
              "operatingSystem": "Web",
              "inLanguage": "fr-FR",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "EUR",
                "availability": "https://schema.org/InStock"
              },
              "provider": {
                "@type": "Organization",
                "name": company.name,
                "url": company.website,
                "foundingLocation": {
                  "@type": "Place",
                  "name": "France"
                },
                ...(company.logo && { 
                  "logo": {
                    "@type": "ImageObject",
                    "url": company.logo,
                    "caption": `Logo de ${company.name}`
                  }
                }),
                ...(company.email && { "email": company.email }),
                ...(company.phone && { "telephone": company.phone }),
                ...(company.hq_address && {
                  "address": {
                    "@type": "PostalAddress",
                    "streetAddress": company.hq_address,
                    "postalCode": company.hq_zip,
                    "addressLocality": company.hq_city,
                    "addressCountry": company.hq_country || "FR"
                  }
                })
              },
              ...(company.keywords && {
                "keywords": company.keywords.split(',').map(k => k.trim())
              }),
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.5",
                "reviewCount": "1"
              }
            },
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Accueil",
                  "item": "https://logicielfrance.com"
                },
                ...(firstCategory ? [{
                  "@type": "ListItem",
                  "position": 2,
                  "name": firstCategory,
                  "item": `https://logicielfrance.com/categorie/${slugify(firstCategory)}`
                }] : []),
                {
                  "@type": "ListItem",
                  "position": firstCategory ? 3 : 2,
                  "name": company.name,
                  "item": `https://logicielfrance.com/logiciel/${slugify(company.name)}`
                }
              ]
            }
          ])}
        </script>
      </Helmet>
      <Header />
      <main className="container-category">
        <nav className="breadcrumbs">
          <Link to="/">Accueil</Link> /{' '}
          {firstCategory && (
            <>
              <Link to={`/categorie/${slugify(firstCategory)}`}>{firstCategory}</Link> /{' '}
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

