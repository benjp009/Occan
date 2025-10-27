import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchCompanies } from '../utils/api';
import { filterCompanies } from '../utils/search';
import { slugify } from '../utils/slugify';
import { CompanyRow } from '../types';

export function Header() {
  const [companies, setCompanies] = useState<CompanyRow[]>([]);
  const [search, setSearch] = useState('');
  const [active, setActive] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearchIconClick = () => {
    setMobileSearchOpen(true);
  };

  useEffect(() => {
    fetchCompanies().then(data => setCompanies(data));
  }, []);

  useEffect(() => {
    function handleClickAway(e: MouseEvent) {
      // Don't close if clicking inside the search modal
      const target = e.target as HTMLElement;
      if (target.closest('.search-modal-content')) {
        return;
      }
      setActive(false);
    }
    document.addEventListener('click', handleClickAway);
    return () => document.removeEventListener('click', handleClickAway);
  }, []);


  const results = filterCompanies(search, companies);
  const show = search.trim() && results.length > 0;

  return (
    <header className="header-new" data-state={mobileMenuOpen ? 'open' : 'close'}>
      <div className="header-wrapper">
        <div className="header-inner">
          {/* Left section: Hamburger + Logo */}
          <div className="header-left">
            <button
              type="button"
              className="hamburger-button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg
                viewBox="0 0 100 100"
                aria-label="Menu"
                role="img"
                className={`hamburger-icon ${mobileMenuOpen ? 'open' : ''}`}
              >
                <path
                  className="hamburger-line hamburger-line-top"
                  d="m 70,33 h -40 c 0,0 -8.5,-0.149796 -8.5,8.5 0,8.649796 8.5,8.5 8.5,8.5 h 20 v -20"
                />
                <path
                  className="hamburger-line hamburger-line-middle"
                  d="m 55,50 h -25"
                />
                <path
                  className="hamburger-line hamburger-line-bottom"
                  d="m 30,67 h 40 c 0,0 8.5,0.149796 8.5,-8.5 0,-8.649796 -8.5,-8.5 -8.5,-8.5 h -20 v 20"
                />
              </svg>
            </button>
            <Link to="/" className="header-logo-link">
              <img
                src="/logolong.svg"
                alt="Logiciel France"
                className="header-logo-img"
              />
            </Link>
          </div>

          {/* Center section: Navigation */}
          <nav className="header-nav">
            <Link to="/categorie" className="nav-link nav-link-active">
              Catégories
            </Link>
            <Link to="/tous-les-logiciels" className="nav-link">
              Logiciels
            </Link>
            <Link to="/blog" className="nav-link">
              Blog
            </Link>
          </nav>

          {/* Right section: Search + Submit button */}
          <div className="header-right">
            <div className="header-actions">
              <button
                className="action-button"
                onClick={handleSearchIconClick}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m21 21-4.34-4.34"></path>
                  <circle cx="11" cy="11" r="8"></circle>
                </svg>
              </button>
            </div>
            <Link to="/ajouter-un-nouveau-logiciel" className="submit-button">
              <span className="submit-text">Ajouter</span>
            </Link>
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className={`mobile-nav ${mobileMenuOpen ? 'open' : ''}`}>
          <Link to="/tous-les-logiciels" className="mobile-nav-link">
            Logiciels
          </Link>
          <Link to="/categorie" className="mobile-nav-link">
            Catégories
          </Link>
          <Link to="/blog" className="mobile-nav-link">
            Blog
          </Link>
          <Link to="/ajouter-un-nouveau-logiciel" className="mobile-nav-link">
            Ajouter
          </Link>
        </nav>
      </div>

      {/* Search Modal */}
      {mobileSearchOpen && (
        <div
          className="search-modal-overlay"
          onClick={() => {
            setMobileSearchOpen(false);
            setSearch('');
          }}
        >
          <div className="search-modal-content">
            <div
              className="search-modal-input-wrapper"
              onClick={e => e.stopPropagation()}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m21 21-4.34-4.34"></path>
                <circle cx="11" cy="11" r="8"></circle>
              </svg>
              <input
                autoFocus
                className="search-modal-input"
                type="text"
                placeholder="Rechercher un logiciel..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && search.trim()) {
                    navigate(`/recherche?q=${encodeURIComponent(search)}`);
                    setMobileSearchOpen(false);
                    setSearch('');
                  }
                }}
              />
            </div>

            {/* Search Results Dropdown */}
            {show && (
              <div
                className="search-modal-results"
                onClick={e => e.stopPropagation()}
              >
                <ul className="search-results-list">
                  {results.slice(0, 10).map(row => (
                    <li key={row.id} className="search-result-item">
                      <Link
                        to={`/logiciel/${slugify(row.name)}`}
                        onClick={() => {
                          setMobileSearchOpen(false);
                          setSearch('');
                        }}
                      >
                        <strong>{row.name}</strong>
                      </Link>
                    </li>
                  ))}
                  {results.length > 10 && (
                    <li className="search-result-more">
                      …{results.length - 10} autres résultats
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}