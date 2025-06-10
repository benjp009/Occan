import React, { useEffect, useState } from 'react';
import { fetchCompanies } from '../utils/api';
import { CompanyRow } from '../types';

interface CompanyData {
  logo: string;
  name: string;
  description: string;
  website: string;
  email: string;
  phone: string;
  siren: string;
  revenue2023: string;
  categories: string;
  keywords: string;
}

const Company: React.FC = () => {
  const [company, setCompany] = useState<CompanyData | null>(null);

  useEffect(() => {
    fetchCompanies().then((companies: CompanyRow[]) => {
      if (companies.length > 0) {
        const row = companies[0];
        // Map API row to our CompanyData shape
        const mapped: CompanyData = {
          logo: row.logo || '',
          name: row.name || '',
          description: row.description || '',
          website: row.website || '',
          email: row.email || '',
          phone: row.phone || '',
          siren: row.siret || '',
          revenue2023: row.revenue2023 ||  '',
          categories: row.categories || '',
          keywords: row.keywords || '',
        };
        setCompany(mapped);
      }
    });
  }, []);

  if (!company) {
    return <div className="company">Loading...</div>;
  }

  return (
    <div className="company">
      <img src={company.logo} alt={`${company.name} logo`} className="company-logo" />
      <h2 className="company-name">{company.name}</h2>
      <p className="company-description">{company.description}</p>
      <div className="company-buttons">
        <a href={company.website} target="_blank" rel="noopener noreferrer">
          <button type="button">Visit Website</button>
        </a>
        <a href={`mailto:${company.email}`}> 
          <button type="button">Send Email</button>
        </a>
        <a href={`tel:${company.phone}`}> 
          <button type="button">Call</button>
        </a>
      </div>
      <div className="company-info">
        <p><strong>SIREN:</strong> {company.siren}</p>
        <p><strong>Revenue (2023):</strong> {company.revenue2023}</p>
        <p><strong>Categories:</strong> {company.categories}</p>
        <p><strong>Keywords:</strong> {company.keywords}</p>
      </div>
    </div>
  );
};

export default Company;