import React from 'react';
import { Link } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import { CompanyRow } from '../types';
import { OptimizedImage, getLocalAssetPaths } from '../utils/imageUtils';
import { slugify } from '../utils/slugify';
import { sanitizeHTML } from '../utils/sanitize';

interface CardsProps {
  company?: CompanyRow;
  isLoading?: boolean;
  highlight?: string;
  internalTo?: string;
  showBadge?: boolean;
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

export function Cards({ company, isLoading = false, highlight, internalTo, showBadge }: CardsProps) {
  const description = company?.description || '';
  const truncatedDescription =
    description.length > 80
      ? description.slice(0, 80).trimEnd() + '…'
      : description;

  return (
    <div className={`card${showBadge ? ' card--partner' : ''}`}>
      {showBadge && <span className="card-badge">Partenaire</span>}
      <div className="card-header">
        <div className="company-logo">
          {isLoading ? (
            <Skeleton width={80} height={80} />
          ) : company?.logo ? (
            <OptimizedImage
              src={company.logo}
              alt={`${company.name} logo`}
              className="company-logo-img"
              fallbackSrcs={getLocalAssetPaths(company.name, 'logo')}
            />
          ) : null}
        </div>

        <h2 className="subtitle">
          {isLoading ? (
            <Skeleton width={150} />
          ) : internalTo && company ? (
            <Link to={internalTo} className="card-title-link">
              {highlightText(company.name, highlight)}
            </Link>
          ) : (
            company && highlightText(company.name, highlight)
          )}
        </h2>

        {isLoading ? (
          <div className="visit-button" style={{ pointerEvents: 'none' }}>
            <Skeleton width={50} />
          </div>
        ) : company && (
          <a
            href={`/refer/${slugify(company.name)}`}
            target="_blank"
            rel="nofollow sponsored noopener noreferrer"
            className="visit-button"
          >
            Visite
          </a>
        )}
      </div>

      <p className="text">
        {isLoading ? (
          <Skeleton count={3} />
        ) : (
          <span dangerouslySetInnerHTML={{ __html: sanitizeHTML(truncatedDescription) }} />
        )}
      </p>
    </div>
  );
}
