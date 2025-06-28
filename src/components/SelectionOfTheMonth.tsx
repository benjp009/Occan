import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CompanyRow } from '../types';
import { slugify } from '../utils/slugify';
import { Cards } from './Cards';
import CardSkeleton from './CardSkeleton';
import { fetchMonthlySelection } from '../utils/api';

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
  const [topNine, setTopNine] = useState<(CompanyRow | undefined)[]>(
    Array.from({ length: 9 })
  );

  useEffect(() => {
    if (!companies) return;

    fetchMonthlySelection(monthName).then(names => {
      const nameMap = new Map(
        companies.map(c => [c.name.toLowerCase(), c])
      );
      const selected = names
        .map(n => nameMap.get(n.toLowerCase()))
        .filter(Boolean) as CompanyRow[];
      if (selected.length > 0) {
        setTopNine(selected.slice(0, 9));
      } else {
        setTopNine(companies.slice(0, 9));
      }
    });
  }, [companies, monthName]);

const openCompanyPage = (company: CompanyRow) => {
  navigate(`/logiciel/${slugify(company.name)}`);
};

  return (
    <section className="selection-month">
      <div className="selection-header">
        <h2 className="selection-title">{`Sélection du ${monthName}`}</h2>
        <p className="selection-description">
          Découvrez les logiciels mis en avant ce mois-ci.
        </p>
        <Link to="/all-softwares" className="secondary-button">
          Voir tous les logiciels
        </Link>
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
