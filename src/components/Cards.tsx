import React from 'react';
import { CompanyRow } from '../types';

interface CardsProps {
  company: CompanyRow;
  highlight?: string;
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

export function Cards({ company, highlight }: CardsProps) {
  const truncatedDescription =
    company.description.length > 80
      ? company.description.slice(0, 80).trimEnd() + '…'
      : company.description;

  return (
    <div className="card">
      <div className="card-header">
        {company.logo && (
          <div className="company-logo">
            <img
              src={company.logo}
              alt={`${company.name} logo`}
              className="company-logo-img"
            />
          </div>
        )}

          <h2 className="subtitle">{highlightText(company.name, highlight)}</h2>

        <a
          href={company.website}
          target="_blank"
          rel="noreferrer"
          className="visit-button"
          onClick={e => {
            e.stopPropagation();
            window.open(company.website, '_blank', 'noopener,noreferrer');
          }}
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
