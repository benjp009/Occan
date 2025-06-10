import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CompanyRow } from '../types';
import { Cards } from './Cards';
import Company from './Company';

interface SelectionOfTheMonthProps {
  /** 
   * The full array of companies. 
   * This component will pick out (e.g.) the first 9 for display. 
   * You can replace this logic with any “top 9” or curated list.
   */
  companies: CompanyRow[];
}

export const SelectionOfTheMonth: React.FC<SelectionOfTheMonthProps> = ({ companies }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<CompanyRow | null>(null);
  
  // For now, just take the first 9. Adjust logic as needed.
  const topNine = companies.slice(0, 9);
  
  // Open & Close Modal 
  const openModal = (company: CompanyRow) => {
    setSelectedCompany(company);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCompany(null);
  };

  // Close on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        closeModal();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isModalOpen]);

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
            className={`card-wrapper ${selectedCompany?.id === company.id && isModalOpen ? 'active' : ''}`}
            onClick={() => openModal(company)}
          >
            <Cards company={company} />
          </div>
        ))}
      </div>

      {isModalOpen && selectedCompany && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3 className="modal-company-name">{selectedCompany.name}</h3>
            <Company company={selectedCompany} />
            <button className="modal-close-button" onClick={closeModal}>
              ✕
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
