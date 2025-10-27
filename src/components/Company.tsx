import React from 'react';
import { CompanyRow } from '../types';
import { OptimizedImage } from '../utils/imageUtils';
import { slugify } from '../utils/slugify';

interface CompanyProps {
  company: CompanyRow;
}

const Company: React.FC<CompanyProps> = ({ company }) => {
  const showLong = company.long_content?.toLowerCase() === 'yes';
  return (
    <article className="company" itemScope itemType="https://schema.org/SoftwareApplication">
      <div className="company-header">
        <div>
          {company.logo && (
          <OptimizedImage
            src={company.logo}
            alt={`${company.name} logo`}
            className="company-logo modal-logo"
            itemProp="image"
          />
          )}
          <h1 className="company-name" itemProp="name">{company.name}</h1>
        </div>




          <div className="company-buttons">
            {company.website && (
              <a
                href={`/refer/${slugify(company.name)}`}
                target="_blank"
                rel="nofollow sponsored noopener noreferrer"
                itemProp="url"
              >
                <button type="button" className="button modal-button">Visite {company.name}</button>
              </a>
            )}
            {company.email && (
              <a href={`mailto:${company.email}`}>
                <button type="button" className="button modal-button">E-mail</button>
              </a>
            )}
            {company.phone && (
              <a href={`tel:${company.phone}`}>
                <button type="button" className="button modal-button">Téléphone</button>
              </a>
            )}
          </div>
        </div>

        {showLong ? (
          <div className="company-long-content">
            {company.asset_1 && (
              <OptimizedImage src={company.asset_1} alt="asset 1" className="company-asset" />
            )}
            {company.description_1 && (
              <p dangerouslySetInnerHTML={{ __html: company.description_1 }} />
            )}
            {company.asset_2 && (
              <OptimizedImage src={company.asset_2} alt="asset 2" className="company-asset" />
            )}
            {company.description_2 && (
              <p dangerouslySetInnerHTML={{ __html: company.description_2 }} />
            )}
            {company.asset_3 && (
              <OptimizedImage src={company.asset_3} alt="asset 3" className="company-asset" />
            )}
            {company.description_3 && (
              <p dangerouslySetInnerHTML={{ __html: company.description_3 }} />
            )}
          </div>
        ) : (
          <div
            className="company-description"
            itemProp="description"
            dangerouslySetInnerHTML={{ __html: company.description }}
          />
        )}
      <div className="company-info">
        {company.siret && (
          <p>
            <strong>SIRET:</strong>{' '}
            {company.pappers ? (
              <a
                href={company.pappers}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#000091', textDecoration: 'underline' }}
              >
                {company.siret}
              </a>
            ) : (
              company.siret
            )}
          </p>
        )}
        {company.revenue2023 && <p><strong>Revenue (2023):</strong> {company.revenue2023}</p>}
        {company.categories && <p><strong>Categories:</strong> {company.categories}</p>}
        {company.keywords && <p><strong>Keywords:</strong> {company.keywords}</p>}
      </div>
    </article>
  );
};

export default Company;
