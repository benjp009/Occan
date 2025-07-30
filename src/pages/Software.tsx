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
        <title>{company.name} - Logiciel français | Logiciel France</title>
        {company.meta_description && (
          <meta name="description" content={company.meta_description} />
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
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": company.name,
            "description": company.meta_description || company.description,
            "url": company.website,
            "applicationCategory": company.categories?.split(',')[0]?.trim(),
            "operatingSystem": "Web",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "EUR"
            },
            "provider": {
              "@type": "Organization",
              "name": company.name,
              "url": company.website,
              ...(company.logo && { "logo": company.logo }),
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
            })
          })}
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

