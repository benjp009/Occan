import { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { fetchCompanies } from '../utils/api';
import { CompanyRow } from '../types';
import { slugify } from '../utils/slugify';
import { Helmet } from 'react-helmet-async';

export default function Refer() {
  const { slug } = useParams<{ slug: string }>();
  const [company, setCompany] = useState<CompanyRow | null | undefined>(undefined);

  useEffect(() => {
    if (!slug) {
      setCompany(null);
      return;
    }

    fetchCompanies().then(data => {
      const found = data.find(
        c => slugify(c.name) === slug || c.id === slug
      );
      setCompany(found || null);

      // Track outbound click with gtag
      if (found && found.website) {
        // Get first category for tracking
        const firstCategory = found.categories
          ? found.categories.split(',')[0].trim()
          : 'Uncategorized';

        // Track with Google Analytics
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'outbound_click', {
            'software_name': found.name,
            'category': firstCategory,
            'destination_url': found.website
          });
        }

        // 301 Redirect to the external website
        window.location.replace(found.website);
      }
    });
  }, [slug]);

  // Loading state
  if (company === undefined) {
    return (
      <>
        <Helmet>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          fontFamily: 'Inter, sans-serif'
        }}>
          Redirection en cours...
        </div>
      </>
    );
  }

  // Company not found - redirect to 404
  if (company === null) {
    return <Navigate to="/404" replace />;
  }

  // Fallback (should not reach here due to window.location.replace)
  return null;
}
