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

  const monthName = new Date().toLocaleString('fr-FR', { month: 'long' });

  const topNine: (CompanyRow | null)[] = companies
    ? companies.filter(c => c.month_choice?.toLowerCase() === 'yes').slice(0, 9)
    : Array.from({ length: 9 }, () => null);


const openCompanyPage = (company: CompanyRow) => {
  navigate(`/logiciel/${slugify(company.name)}`);
};

  return (
    <section className="selection-month">
      <div className="selection-header">
        <h2 className="selection-title">{`Sélection du mois de ${monthName}`}</h2>
        <Link to="/all-softwares" className="secondary-button">
          Voir tous les logiciels
        </Link>
      </div>
      <div>
        <p className="selection-description">
          Découvrez dans cette catégorie tous les logiciels que nous avons sélectionné pour vous ce mois ci. 
        </p>
      </div>

      <div className="selection-grid">
        {topNine.map((company, idx) => (
           company ? (
            <a
              key={company.id}
              className="card-wrapper"
              href={`/logiciel/${slugify(company.name)}`}
              onClick={e => {
                e.preventDefault();
                openCompanyPage(company);
              }}
            >
              <Cards company={company} />
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
