import React from 'react';
import { Link } from 'react-router-dom';
import { CompanyRow } from '../types';
import { OptimizedImage } from '../utils/imageUtils';

interface CardsProps {
  company: CompanyRow;
  highlight?: string;
  internalTo?: string; // internal route for card click
}

function escapeRegExp(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function highlightText(text: string, query?: string) {
  if (!query) return text;
  const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi');
  return text.split(regex).map((part, i) =>
    part.toLowerCase() === query.toLowerCase() ? <mark key={i}>{part}</mark> : part
  );
}

export function Cards({ company, highlight, internalTo }: CardsProps) {
  const truncatedDescription =
    company.description.length > 80
      ? company.description.slice(0, 80).trimEnd() + '…'
      : company.description;

  return (
    <div className="card">
      <div className="card-header">
        {company.logo && (
          internalTo ? (
            <Link to={internalTo} className="company-logo" aria-label={company.name}>
              <OptimizedImage
                src={company.logo}
                alt={`${company.name} logo`}
                className="company-logo-img"
              />
            </Link>
          ) : (
            <div className="company-logo">
              <OptimizedImage
                src={company.logo}
                alt={`${company.name} logo`}
                className="company-logo-img"
              />
            </div>
          )
        )}

        {internalTo ? (
          <h2 className="subtitle">
            <Link to={internalTo} className="internal-title-link">
              {highlightText(company.name, highlight)}
            </Link>
          </h2>
        ) : (
          <h2 className="subtitle">{highlightText(company.name, highlight)}</h2>
        )}

        <a
          href={company.website}
          target="_blank"
          rel="noopener noreferrer"
          className="visit-button"
        >
          Visite
        </a>
      </div>

      {/* ─── Truncated description ──────────────────────────────────────── */}
      <p
        className="text"
        dangerouslySetInnerHTML={{ __html: truncatedDescription }}
      />
    </div>
  );
}
