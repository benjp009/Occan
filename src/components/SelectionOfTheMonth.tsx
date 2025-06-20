import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CompanyRow } from '../types';
import { slugify } from '../utils/slugify';
import { Cards } from './Cards';

interface SelectionOfTheMonthProps {
  /** 
   * The full array of companies. 
   * This component will pick out (e.g.) the first 9 for display. 
   * You can replace this logic with any “top 9” or curated list.
   */
  companies: CompanyRow[];
}

export const SelectionOfTheMonth: React.FC<SelectionOfTheMonthProps> = ({ companies }) => {
  const navigate = useNavigate();

  
  // For now, just take the first 9. Adjust logic as needed.
  const topNine = companies.slice(0, 9);
  
const openCompanyPage = (company: CompanyRow) => {
  navigate(`/logiciel/${slugify(company.name)}`);
};

  return (
    <section className="selection-month">
      <div className="selection-header">
        <h2 className="selection-title">Sélection du mois</h2>
        <Link to="/all-softwares" className="secondary-button">
          Voir tous les logiciels
        </Link>
      </div>

      <div className="selection-grid">
        {topNine.map(company => (
          <div
            key={company.id}
            className="card-wrapper"
            onClick={() => openCompanyPage(company)}
          >
            <Cards company={company} />
          </div>
        ))}
      </div>
    </section>
  );
};
