import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CompanyRow } from '../types';
import { slugify } from '../utils/slugify';
import { Cards } from './Cards';
import CardSkeleton from './CardSkeleton';

interface SelectionOfTheMonthProps {
  /** 
   * The full array of companies. 
   * This component will pick out (e.g.) the first 9 for display. 
   * You can replace this logic with any “top 9” or curated list.
   */
  companies: CompanyRow[] | null;
}

export const SelectionOfTheMonth: React.FC<SelectionOfTheMonthProps> = ({ companies }) => {
  const navigate = useNavigate();

  
  // For now, just take the first 9. Adjust logic as needed.
  const topNine = companies ? companies.slice(0, 9) : Array.from({ length: 9 });
  
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
        {topNine.map((company, idx) => (
            companies ? (
              <a
                key={(company as CompanyRow).id}
                className="card-wrapper"
                href={`/logiciel/${slugify((company as CompanyRow).name)}`}
                onClick={e => {
                  e.preventDefault();
                  openCompanyPage(company as CompanyRow);
                }}
              >
                <Cards company={company as CompanyRow} />
              </a>
            ) : (
              <div key={idx} className="card-wrapper">
                <CardSkeleton />
              </div>
            )
          ))}
      </div>
    </section>
  );
};
