import logo from '../logo.svg';
// Description: Footer component for the website
const popularTags = [
  'CRM', 'Comptabilité', 'Marketing', 
];

export function Hero({ onSearch }: { onSearch: (query: string) => void }) {
  return (
    <section className="section-hero">
      <div className="hero-container">
        <img
          src={logo}
          alt="Occan logo"
          className="logo"
        />
        <h1 className="hero-title">
          Le répertoire des logiciels français
        </h1>
        <p className="research-text">
          Découvrez les meilleurs solutions logicielles françaises pour votre entreprise, organisées par catégorie. 
        </p>
        <div className="hero-search">
            <div className="hero-search-container">
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
              placeholder="Rechercher par nom. catégorie, fonction, etc ..."
              onChange={e => onSearch(e.target.value)}
            />
            </div>
            <button
            type="button"
            className="search-button"
            onClick={() => {
              // you could also trigger search explicitly here if needed
            }}
          >
            Rechercher
          </button>
          
        </div>
        <div className="popular-tags-container">
          <p className="research-text">
            Recherche populaires: 
          </p>
          <div className="popular-tags">
          {popularTags.map(tag => (
            <button
              className="tag"
              key={tag}
              onClick={() => onSearch(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
        </div>
        
      </div>
    </section>
  );
}