import React from 'react';
import { CompanyRow } from '../types';

interface SEOExternalLinksProps {
  companies: CompanyRow[] | null;
  title?: string;
  limit?: number;
}

/**
 * SEO-friendly component that renders external links directly in HTML
 * for better crawlability by search engines
 */
export const SEOExternalLinks: React.FC<SEOExternalLinksProps> = ({ 
  companies, 
  title = "Logiciels français recommandés",
  limit = 9 
}) => {
  if (!companies || companies.length === 0) {
    return null;
  }

  // Get companies with websites, prioritizing month_choice selections
  const companiesWithWebsites = companies
    .filter(company => company.website && company.website.trim() !== '')
    .sort((a, b) => {
      // Prioritize month_choice companies
      if (a.month_choice?.toLowerCase() === 'yes' && b.month_choice?.toLowerCase() !== 'yes') {
        return -1;
      }
      if (b.month_choice?.toLowerCase() === 'yes' && a.month_choice?.toLowerCase() !== 'yes') {
        return 1;
      }
      return 0;
    })
    .slice(0, limit);

  if (companiesWithWebsites.length === 0) {
    return null;
  }

  return (
    <section className="seo-external-links" style={{ 
      padding: '20px 0', 
      borderTop: '1px solid #eee',
      margin: '40px 0 20px 0' 
    }}>
      <h2 style={{ 
        fontSize: '1.2rem', 
        marginBottom: '15px',
        color: '#333'
      }}>
        {title}
      </h2>
      <div style={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: '12px',
        lineHeight: '1.4'
      }}>
        {companiesWithWebsites.map((company) => (
          <a
            key={company.id}
            href={company.website}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              padding: '8px 12px',
              backgroundColor: '#f8f9fa',
              border: '1px solid #e9ecef',
              borderRadius: '4px',
              textDecoration: 'none',
              color: '#495057',
              fontSize: '14px',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#e9ecef';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#f8f9fa';
            }}
          >
            {company.name}
          </a>
        ))}
      </div>
      <p style={{ 
        fontSize: '12px', 
        color: '#6c757d', 
        marginTop: '10px',
        fontStyle: 'italic'
      }}>
        Découvrez ces solutions logicielles françaises pour votre entreprise
      </p>
    </section>
  );
};