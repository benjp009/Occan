import React from 'react';
import { Link } from 'react-router-dom';
import { CompanyRow } from '../types';
import { slugify } from '../utils/slugify';
import { Cards } from './Cards';

interface SelectionOfTheMonthProps {
  /** 
   * The full array of companies. 
   * This component will pick out (e.g.) the first 9 for display. 
   * You can replace this logic with any “top 9” or curated list.
   */
  companies: CompanyRow[] | null;
}

export const SelectionOfTheMonth: React.FC<SelectionOfTheMonthProps> = ({ companies }) => {

  const monthName = new Date().toLocaleString('fr-FR', { month: 'long' });

  const topNine: (CompanyRow | null)[] = companies
    ? companies.filter(c => c.month_choice?.toLowerCase() === 'yes').slice(0, 9)
    : Array.from({ length: 9 }, () => null);



  return (
    <section className="selection-month">
      <div className="selection-header">
        <h2 className="selection-title">{`Sélection du mois de ${monthName}`}</h2>
        <Link to="/tous-les-logiciels" className="secondary-button">
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
          <div key={company ? company.id : idx} className="card-wrapper">
            <Cards
              company={company || undefined}
              isLoading={!company}
              internalTo={company ? `/logiciel/${slugify(company.name)}` : undefined}
            />
          </div>
        ))}
      </div>
    </section>
  );
};
