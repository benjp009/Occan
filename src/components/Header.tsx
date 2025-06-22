import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import logolong from '../logolong.svg';
import { fetchCompanies } from '../utils/api';
import { filterCompanies } from '../utils/search';
import { slugify } from '../utils/slugify';
import { CompanyRow } from '../types';

export function Header() {
  const [companies, setCompanies] = useState<CompanyRow[]>([]);
  const [search, setSearch] = useState('');
  const [active, setActive] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCompanies().then(data => setCompanies(data));
  }, []);

    useEffect(() => {
    function handleClickAway() {
      setActive(false);
      setSearchOpen(false);
    }
    document.addEventListener('click', handleClickAway);
    return () => document.removeEventListener('click', handleClickAway);
  }, []);


  const results = filterCompanies(search, companies);
  const show = active && search.trim() && results.length > 0;

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-logo">
          <Link to="/">
          <img
            src={logolong}
            alt="Occan logo"
            className="logo"
          />
        </Link>
        </div>
        {/* Search icon */}
        <div
          className="search-icon"
          onClick={e => {
            e.stopPropagation();
            setSearchOpen(true);
          }}
        >
          <svg
            width="20px"
            height="20px"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clip-path="url(#clip0_header)">
              <rect width="24" height="24" fill="white" />
              <circle cx="10.5" cy="10.5" r="6.5" stroke="#000000" stroke-linejoin="round" />
              <path d="M19.6464 20.3536C19.8417 20.5488 20.1583 20.5488 20.3536 20.3536C20.5488 20.1583 20.5488 19.8417 20.3536 19.6464L19.6464 20.3536ZM20.3536 19.6464L15.3536 14.6464L14.6464 15.3536L19.6464 20.3536L20.3536 19.6464Z" fill="#000000" />
            </g>
            <defs>
              <clipPath id="clip0_header">
                <rect width="24" height="24" fill="none" />
              </clipPath>
            </defs>
          </svg>
        </div>
        
        {/* CTA */}
        <Link to="/ajouter-un-nouveau-logiciel">
          <button className="button add-button" aria-label="Ajouter un logiciel">
            +
          </button>
        </Link>
      </div>
      {searchOpen && (
        <div className="search-overlay" onClick={() => setSearchOpen(false)}>
          <div className="search-container" onClick={e => e.stopPropagation()}>
            <input
              className="input"
              type="text"
              placeholder="Rechercher un logiciel..."
              value={search}
              autoFocus
              onChange={e => setSearch(e.target.value)}
              onFocus={() => setActive(true)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  navigate(`/recherche?q=${encodeURIComponent(search)}`);
                  setSearchOpen(false);
                }
              }}
            />
            {show && (
              <div className="search-wrapper">
                <ul className="search-results">
                  {results.slice(0, 10).map(row => (
                    <li key={row.id} className="result-item">
                      <Link to={`/logiciel/${slugify(row.name)}`}> 
                        <strong className="result-item-text">{row.name}</strong>
                      </Link>
                    </li>
                  ))}
                  {results.length > 10 && (
                    <li className="result-more">…{results.length - 10} autres résultats</li>
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