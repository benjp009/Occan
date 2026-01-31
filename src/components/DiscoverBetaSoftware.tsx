import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CompanyRow } from '../types';
import { slugify } from '../utils/slugify';
import { Cards } from './Cards';
import { fetchBetaCompanies } from '../utils/api';

interface DiscoverBetaSoftwareProps {
  /**
   * This component fetches and displays beta companies from the "Beta DB" tab.
   */
}

export const DiscoverBetaSoftware: React.FC<DiscoverBetaSoftwareProps> = () => {
  const [betaCompanies, setBetaCompanies] = useState<CompanyRow[] | null>(null);

  useEffect(() => {
    fetchBetaCompanies().then(data => {
      setBetaCompanies(data);
    });
  }, []);

  // Display beta companies, sorted by date_added (newest first), limited to 6
  const betaSoftware: (CompanyRow | null)[] = betaCompanies
    ? betaCompanies
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
