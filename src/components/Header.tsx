import logolong from '../logolong.svg';
import { Link } from 'react-router-dom';

export function Header({ onSearch }: { onSearch: (query: string) => void }) {
  return (
    <header className="header">
      <div className="header-container">
        <div className="header-logo">
          <img
            src={logolong}
            alt="Occan logo"
            className="logo"
          />
        </div>
        {/* Search bar */}
        <div className="site-header-search, search-container">
          <svg 
            width="20px" 
            height="20px" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_15_152)">
            <rect width="24" height="24" fill="white"/>
            <circle cx="10.5" cy="10.5" r="6.5" stroke="#000000" stroke-linejoin="round"/>
            <path d="M19.6464 20.3536C19.8417 20.5488 20.1583 20.5488 20.3536 20.3536C20.5488 20.1583 20.5488 19.8417 20.3536 19.6464L19.6464 20.3536ZM20.3536 19.6464L15.3536 14.6464L14.6464 15.3536L19.6464 20.3536L20.3536 19.6464Z" fill="#000000"/>
            </g>
            <defs>
            <clipPath id="clip0_15_152">
            <rect width="24" height="24" fill="none"/>
            </clipPath>
            </defs>
          </svg>
          <input className="input"
            type="text"
            placeholder="Rechercher un logiciel..."
            onChange={e => onSearch(e.target.value)}
          />
        </div>
        
        {/* CTA */}
        <Link to="/ajouter-un-nouveau-logiciel">

          <button className="button" >
            Ajouter votre logiciel
          </button>
        </Link>
      </div>
    </header>
  );
}