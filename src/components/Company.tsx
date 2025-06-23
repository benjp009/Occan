import React from 'react';
import { CompanyRow } from '../types';

interface CompanyProps {
  company: CompanyRow;
}

const Company: React.FC<CompanyProps> = ({ company }) => {
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
          <h2 className="company-name">{company.name}</h2>
        </div>
      
      
      

          <div className="company-buttons">
            {company.website && (
              <a href={company.website} target="_blank" rel="noopener noreferrer">
                <button type="button" className="button modal-button">Le site</button>
              </a>
            )}
            {company.email && (
              <a href={`mailto:${company.email}`}>
                <button type="button" className="button modal-button">Le courriel</button>
              </a>
            )}
            {company.phone && (
              <a href={`tel:${company.phone}`}>
                <button type="button" className="button modal-button">Le téléphone</button>
              </a>
            )}
          </div>
        </div>

      <p
        className="company-description"
        dangerouslySetInnerHTML={{ __html: company.description }}
      />

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
