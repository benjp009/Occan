import { useEffect, useState } from 'react';
import logo from '../logo.svg';
import { fetchCompanies } from '../utils/api';
import { filterCompanies } from '../utils/search';
import { CompanyRow } from '../types';
import { slugify } from '../utils/slugify';
import { Link, useNavigate } from 'react-router-dom';

export function Hero() {
  const [companies, setCompanies] = useState<CompanyRow[]>([]);
  const [search, setSearch] = useState('');
  const [active, setActive] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
      fetchCompanies().then(data => setCompanies(data));
    }, []);

    useEffect(() => {
      function handleClickAway() {
        setActive(false);
      }
      document.addEventListener('click', handleClickAway);
      return () => document.removeEventListener('click', handleClickAway);
  }, []);

  const results = filterCompanies(search, companies);
  const show = active && search.trim() && results.length > 0;

  return (
    <section className="section-hero">
      <div className="hero-container container">
        <img
          src={logo}
          alt="Occan logo"
          className="logo"
        />
        <h1 className="hero-title">
          Le répertoire des logiciels français
        </h1>
        <p className="research-text">
          Découvrez les meilleurs logiciels fait en France pour votre entreprise, organisées par catégorie, mots clefs et popularité.
        </p>
        <div className="hero-search">
            <div 
              className="hero-search-container"
              onClick={e => e.stopPropagation()}
            >
              <svg
              width="20px"
              height="20px"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_15_152)">
              <rect width="24" height="24" fill="white"/>
              <circle cx="10.5" cy="10.5" r="6.5" stroke="#000000" strokeLinejoin="round"/>
              <path d="M19.6464 20.3536C19.8417 20.5488 20.1583 20.5488 20.3536 20.3536C20.5488 20.1583 20.5488 19.8417 20.3536 19.6464L19.6464 20.3536ZM20.3536 19.6464L15.3536 14.6464L14.6464 15.3536L19.6464 20.3536L20.3536 19.6464Z" fill="#000000"/>
              </g>
              <defs>
              <clipPath id="clip0_15_152">
              <rect width="24" height="24" fill="none"/>
              </clipPath>
              </defs>
            </svg>
            <input
              className="input"
              type="text"
              placeholder="Rechercher facilement un logiciel français."
              value={search}
              onChange={e => setSearch(e.target.value)}
              onFocus={() => setActive(true)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  navigate(`/recherche?q=${encodeURIComponent(search)}`);
                }
              }}
            />
            {/* ▾ dropdown */}
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
      </div>
    </section>
  );
}