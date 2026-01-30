import { useEffect, useState, useCallback } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { fetchCompanies, fetchBetaCompanies, fetchSponsors, getRandomSponsor } from '../utils/api';
import { CompanyRow, SponsorRow } from '../types';
import { slugify } from '../utils/slugify';
import { Helmet } from 'react-helmet-async';
import SponsorAd from '../components/SponsorAd';

const COUNTDOWN_SECONDS = 3;

export default function Refer() {
  const { slug } = useParams<{ slug: string }>();
  const [company, setCompany] = useState<CompanyRow | null | undefined>(undefined);
  const [sponsor, setSponsor] = useState<SponsorRow | null>(null);
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  // Track GA4 events
  const trackEvent = useCallback((eventName: string, params: Record<string, string>) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', eventName, params);
    }
  }, []);

  // Handle the redirect
  const performRedirect = useCallback((targetCompany: CompanyRow) => {
    if (targetCompany.website) {
      const firstCategory = targetCompany.categories
        ? targetCompany.categories.split(',')[0].trim()
        : 'Uncategorized';

      trackEvent('outbound_click', {
        'software_name': targetCompany.name,
        'category': firstCategory,
        'destination_url': targetCompany.website
      });

      trackEvent('redirect_complete', {
        'software_name': targetCompany.name,
        'sponsor_shown': sponsor?.name || 'none'
      });

      window.location.replace(targetCompany.website);
    }
  }, [sponsor, trackEvent]);

  // Load company and sponsor data
  useEffect(() => {
    if (!slug) {
      setCompany(null);
      return;
    }

    // Load sponsors
    fetchSponsors().then(sponsors => {
      const randomSponsor = getRandomSponsor(sponsors);
      setSponsor(randomSponsor);

      // Track impression
      trackEvent('sponsor_ad_impression', {
        'sponsor_name': randomSponsor.name,
        'sponsor_url': randomSponsor.url
      });
    });

    // Find the company
    fetchCompanies().then(data => {
      const found = data.find(
        c => slugify(c.name) === slug || c.id === slug
      );

      if (found) {
        setCompany(found);
      } else {
        fetchBetaCompanies().then(betaData => {
          const betaFound = betaData.find(
            c => slugify(c.name) === slug || c.id === slug
          );

          if (betaFound) {
            setCompany(betaFound);
          } else {
            setCompany(null);
          }
        });
      }
    });
  }, [slug, trackEvent]);

  // Countdown timer
  useEffect(() => {
    if (!company || !sponsor) return;

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setShouldRedirect(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [company, sponsor]);

  // Perform redirect when countdown finishes
  useEffect(() => {
    if (shouldRedirect && company) {
      performRedirect(company);
    }
  }, [shouldRedirect, company, performRedirect]);

  // Skip button handler
  const handleSkip = () => {
    if (company) {
      trackEvent('sponsor_ad_skip', {
        'sponsor_name': sponsor?.name || 'none',
        'seconds_remaining': countdown.toString()
      });
      performRedirect(company);
    }
  };

  // Sponsor click handler
  const handleSponsorClick = () => {
    if (sponsor) {
      trackEvent('sponsor_ad_click', {
        'sponsor_name': sponsor.name,
        'sponsor_url': sponsor.url
      });
    }
  };

  // Loading state - waiting for company data
  if (company === undefined) {
    return (
      <>
        <Helmet>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <div className="refer-page">
          <div className="refer-loading">Chargement...</div>
        </div>
      </>
    );
  }

  // Company not found - redirect to 404
  if (company === null) {
    return <Navigate to="/404" replace />;
  }

  // Main refer page with sponsor ad
  return (
    <>
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
        <title>Redirection vers {company.name} | Logiciel France</title>
      </Helmet>
      <div className="refer-page">
        <div className="refer-container">
          {sponsor && (
            <SponsorAd sponsor={sponsor} onSponsorClick={handleSponsorClick} />
          )}

          <div className="refer-redirect-info">
            <p className="refer-destination">
              Redirection vers <strong>{company.name}</strong>
            </p>
            <div className="refer-countdown">
              Redirection dans {countdown}...
            </div>
            <button className="refer-skip" onClick={handleSkip}>
              Passer →
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
