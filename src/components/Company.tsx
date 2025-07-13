import React from 'react';
import { CompanyRow } from '../types';

interface CompanyProps {
  company: CompanyRow;
}

const Company: React.FC<CompanyProps> = ({ company }) => {
  const showLong = company.long_content?.toLowerCase() === 'yes';
  return (
    <div className="company">
      <div className="company-header">
        <div>
          {company.logo && (
          <img
            src={company.logo}
            alt={`${company.name} logo`}
            className="company-logo modal-logo"
          />
          )}
          <h1 className="company-name">{company.name}</h1>
        </div>
      
      
      

          <div className="company-buttons">
            {company.website && (
              <a href={company.website} target="_blank" rel="noopener noreferrer">
                <button type="button" className="button modal-button">Le site</button>
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
              <img src={company.asset_1} alt="asset 1" className="company-asset" />
            )}
            {company.description_1 && (
              <p dangerouslySetInnerHTML={{ __html: company.description_1 }} />
            )}
            {company.asset_2 && (
              <img src={company.asset_2} alt="asset 2" className="company-asset" />
            )}
            {company.description_2 && (
              <p dangerouslySetInnerHTML={{ __html: company.description_2 }} />
            )}
            {company.asset_3 && (
              <img src={company.asset_3} alt="asset 3" className="company-asset" />
            )}
          </div>
        ) : (
          /*
          <p
            className="company-description"
            dangerouslySetInnerHTML={{ __html: company.description }}
          />
          */
        )}
      <div className="company-info">
        {company.siret && <p><strong>SIRET:</strong> {company.siret}</p>}
        {company.revenue2023 && <p><strong>Revenue (2023):</strong> {company.revenue2023}</p>}
        {company.categories && <p><strong>Categories:</strong> {company.categories}</p>}
        {company.keywords && <p><strong>Keywords:</strong> {company.keywords}</p>}
      </div>
    </div>
  );
};

export default Company;
