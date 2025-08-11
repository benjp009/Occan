import React from 'react';
import { Link } from 'react-router-dom';
import { CompanyRow } from '../types';
import { slugify } from '../utils/slugify';
import { Cards } from './Cards';
import CardSkeleton from './CardSkeleton';

interface DiscoverBetaSoftwareProps {
  /** 
   * The full array of companies. 
   * This component will pick out recent companies or those marked as beta.
   */
  companies: CompanyRow[] | null;
}

export const DiscoverBetaSoftware: React.FC<DiscoverBetaSoftwareProps> = ({ companies }) => {
  // Filter companies explicitly tagged as beta via month_choice === 'beta'
  const betaSoftware: (CompanyRow | null)[] = companies
    ? companies
        .filter(c => (c.month_choice || '').toLowerCase().trim() === 'beta')
        .sort((a, b) => new Date(b.date_added).getTime() - new Date(a.date_added).getTime())
        .slice(0, 6)
    : Array.from({ length: 6 }, () => null);

  // Check if we have any actual companies (not just null placeholders)
  const hasRealCompanies = betaSoftware.some(company => company !== null);

  return (
    <section className="discover-beta">
      <div className="discover-beta-header">

        <h2 className="discover-beta-title">Logiciels français en bêta</h2>
        
      </div>
      <div className={`discover-beta-content ${!hasRealCompanies ? 'with-image' : ''}`}>
        <div className="discover-beta-text">
          <p className="discover-beta-description">
            Découvrir et soyez le premier à tester les logiciels français en version Beta. 
          </p>
          <p className="discover-beta-description">
            Explorez les derniers logiciels français récemment ajoutés à notre plateforme. 
            Ces solutions innovantes sont en phase de développement et méritent votre attention.
          </p>
          <div className="discover-beta-button">
            <Link to="/ajouter-un-nouveau-logiciel">
              <button className="button add-button" >
                <span className="add-text">Proposer votre logiciel</span>
                <span className="add-icon">+</span>
              </button>
            </Link>
          </div>
        </div>
        {!hasRealCompanies && (
          <div className="discover-beta-image">
            <img 
              src="/pages/home/homme_content_beta.webp" 
              alt="Découvrir les logiciels beta français"
            />
          </div>
        )}
      </div>

      <div className="discover-beta-grid">
        {betaSoftware.map((company, idx) => (
          company ? (
            <div key={company.id} className="card-wrapper">
              <Cards
                company={company}
                internalTo={`/logiciel/${slugify(company.name)}`}
              />
            </div>
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
