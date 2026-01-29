import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState, useRef, useCallback } from 'react';
import { fetchCompanies, fetchUseCases, fetchCompetitors } from '../utils/api';
import { filterCompanies } from '../utils/search';
import { slugify } from '../utils/slugify';
import { CompanyRow, UseCaseRow, CompetitorRow } from '../types';

export function Header() {
  const [companies, setCompanies] = useState<CompanyRow[]>([]);
  const [search, setSearch] = useState('');
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [useCases, setUseCases] = useState<UseCaseRow[]>([]);
  const [useCasesLoading, setUseCasesLoading] = useState(true);
  const [useCaseDropdownOpen, setUseCaseDropdownOpen] = useState(false);
  const [competitors, setCompetitors] = useState<CompetitorRow[]>([]);
  const [competitorsLoading, setCompetitorsLoading] = useState(true);
  const [competitorDropdownOpen, setCompetitorDropdownOpen] = useState(false);
  const [desktopUseCaseOpen, setDesktopUseCaseOpen] = useState(false);
  const [desktopCompetitorOpen, setDesktopCompetitorOpen] = useState(false);
  const useCaseDropdownRef = useRef<HTMLDivElement>(null);
  const competitorDropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const closeAllDesktopDropdowns = useCallback(() => {
    setDesktopUseCaseOpen(false);
    setDesktopCompetitorOpen(false);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        useCaseDropdownRef.current && !useCaseDropdownRef.current.contains(target) &&
        competitorDropdownRef.current && !competitorDropdownRef.current.contains(target)
      ) {
        closeAllDesktopDropdowns();
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [closeAllDesktopDropdowns]);

  const handleSearchIconClick = () => {
    setMobileSearchOpen(true);
  };

  useEffect(() => {
    // Use SSR data if available to avoid redundant fetch
    if (typeof window !== 'undefined' && (window as unknown as { __INITIAL_DATA__?: { companies?: CompanyRow[] } }).__INITIAL_DATA__?.companies) {
      setCompanies((window as unknown as { __INITIAL_DATA__: { companies: CompanyRow[] } }).__INITIAL_DATA__.companies);
    } else {
      fetchCompanies().then(data => setCompanies(data));
    }
  }, []);

  useEffect(() => {
    fetchUseCases()
      .then(data => {
        setUseCases(data);
        setUseCasesLoading(false);
      })
      .catch(() => setUseCasesLoading(false));
  }, []);

  useEffect(() => {
    fetchCompetitors()
      .then(data => {
        setCompetitors(data);
        setCompetitorsLoading(false);
      })
      .catch(() => setCompetitorsLoading(false));
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
            <Link
              to="/categorie"
              className={`nav-link ${location.pathname.startsWith('/categorie') ? 'nav-link-active' : ''}`}
            >
              Catégories
            </Link>
            <Link
              to="/tous-les-logiciels"
              className={`nav-link ${location.pathname === '/tous-les-logiciels' || location.pathname.startsWith('/logiciel') ? 'nav-link-active' : ''}`}
            >
              Logiciels
            </Link>

            {/* Dropdown for Cas d'usage */}
            <div
              className={`nav-dropdown ${desktopUseCaseOpen ? 'is-open' : ''}`}
              ref={useCaseDropdownRef}
            >
              <button
                className={`nav-link nav-dropdown-trigger ${location.pathname.startsWith('/meilleur-logiciel-pour') ? 'nav-link-active' : ''}`}
                aria-haspopup="true"
                aria-expanded={desktopUseCaseOpen}
                onClick={(e) => {
                  e.stopPropagation();
                  setDesktopCompetitorOpen(false);
                  setDesktopUseCaseOpen(!desktopUseCaseOpen);
                }}
              >
                Cas d'usage
                <svg
                  className="nav-dropdown-chevron"
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
              <div className="nav-dropdown-menu">
                {useCasesLoading ? (
                  <div className="nav-dropdown-loading">Chargement...</div>
                ) : useCases.length === 0 ? (
                  <div className="nav-dropdown-empty">Aucun cas d'usage</div>
                ) : (
                  <ul className="nav-dropdown-list">
                    {useCases.map(useCase => (
                      <li key={useCase.slug}>
                        <Link
                          to={`/meilleur-logiciel-pour/${useCase.slug}`}
                          className="nav-dropdown-item"
                        >
                          {useCase.usecase_name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Dropdown for Alternatives */}
            <div
              className={`nav-dropdown ${desktopCompetitorOpen ? 'is-open' : ''}`}
              ref={competitorDropdownRef}
            >
              <button
                className={`nav-link nav-dropdown-trigger ${location.pathname.startsWith('/alternative') ? 'nav-link-active' : ''}`}
                aria-haspopup="true"
                aria-expanded={desktopCompetitorOpen}
                onClick={(e) => {
                  e.stopPropagation();
                  setDesktopUseCaseOpen(false);
                  setDesktopCompetitorOpen(!desktopCompetitorOpen);
                }}
              >
                Alternatives
                <svg
                  className="nav-dropdown-chevron"
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
              <div className="nav-dropdown-menu">
                {competitorsLoading ? (
                  <div className="nav-dropdown-loading">Chargement...</div>
                ) : competitors.length === 0 ? (
                  <div className="nav-dropdown-empty">Aucune alternative</div>
                ) : (
                  <ul className="nav-dropdown-list">
                    {competitors.map(comp => (
                      <li key={comp.slug}>
                        <Link
                          to={`/alternative/${comp.slug}`}
                          className="nav-dropdown-item"
                        >
                          {comp.competitor_name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <Link
              to="/blog"
              className={`nav-link ${location.pathname.startsWith('/blog') ? 'nav-link-active' : ''}`}
            >
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
          <Link
            to="/tous-les-logiciels"
            className={`mobile-nav-link ${location.pathname === '/tous-les-logiciels' || location.pathname.startsWith('/logiciel') ? 'mobile-nav-link-active' : ''}`}
          >
            Logiciels
          </Link>
          <Link
            to="/categorie"
            className={`mobile-nav-link ${location.pathname.startsWith('/categorie') ? 'mobile-nav-link-active' : ''}`}
          >
            Catégories
          </Link>

          {/* Mobile Accordion for Cas d'usage */}
          <div className="mobile-nav-accordion">
            <button
              className={`mobile-nav-link mobile-nav-accordion-trigger ${location.pathname.startsWith('/meilleur-logiciel-pour') ? 'mobile-nav-link-active' : ''}`}
              onClick={() => setUseCaseDropdownOpen(!useCaseDropdownOpen)}
              aria-expanded={useCaseDropdownOpen}
            >
              Cas d'usage
              <svg
                className={`mobile-nav-accordion-chevron ${useCaseDropdownOpen ? 'open' : ''}`}
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
            <div className={`mobile-nav-accordion-content ${useCaseDropdownOpen ? 'open' : ''}`}>
              {useCasesLoading ? (
                <div className="mobile-nav-loading">Chargement...</div>
              ) : useCases.length === 0 ? (
                <div className="mobile-nav-empty">Aucun cas d'usage</div>
              ) : (
                useCases.map(useCase => (
                  <Link
                    key={useCase.slug}
                    to={`/meilleur-logiciel-pour/${useCase.slug}`}
                    className="mobile-nav-sub-link"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {useCase.usecase_name}
                  </Link>
                ))
              )}
            </div>
          </div>

          {/* Mobile Accordion for Alternatives */}
          <div className="mobile-nav-accordion">
            <button
              className={`mobile-nav-link mobile-nav-accordion-trigger ${location.pathname.startsWith('/alternative') ? 'mobile-nav-link-active' : ''}`}
              onClick={() => setCompetitorDropdownOpen(!competitorDropdownOpen)}
              aria-expanded={competitorDropdownOpen}
            >
              Alternatives
              <svg
                className={`mobile-nav-accordion-chevron ${competitorDropdownOpen ? 'open' : ''}`}
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
            <div className={`mobile-nav-accordion-content ${competitorDropdownOpen ? 'open' : ''}`}>
              {competitorsLoading ? (
                <div className="mobile-nav-loading">Chargement...</div>
              ) : competitors.length === 0 ? (
                <div className="mobile-nav-empty">Aucune alternative</div>
              ) : (
                competitors.map(comp => (
                  <Link
                    key={comp.slug}
                    to={`/alternative/${comp.slug}`}
                    className="mobile-nav-sub-link"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {comp.competitor_name}
                  </Link>
                ))
              )}
            </div>
          </div>

          <Link
            to="/blog"
            className={`mobile-nav-link ${location.pathname.startsWith('/blog') ? 'mobile-nav-link-active' : ''}`}
          >
            Blog
          </Link>
          <Link
            to="/ajouter-un-nouveau-logiciel"
            className={`mobile-nav-link ${location.pathname === '/ajouter-un-nouveau-logiciel' ? 'mobile-nav-link-active' : ''}`}
          >
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