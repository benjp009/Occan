// src/components/Cards.tsx
import { CompanyRow } from '../types';

export function Cards({ company }: { company: CompanyRow }) {
  // Truncate description to 100 characters + "…" if longer
  const truncatedDescription =
    company.description.length > 80
      ? company.description.slice(0, 80).trimEnd() + '…'
      : company.description;

  return (
    <div className="card">
      {/* ─── Header: logo + title + “Visite” button ──────────────────────── */}
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

        <h2 className="subtitle">{company.name}</h2>

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
      <p className="text">{truncatedDescription}</p>
    </div>
  );
}
