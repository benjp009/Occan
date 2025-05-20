
export function Header({ onSearch }: { onSearch: (query: string) => void }) {
  return (
    <header className="header">
      <div className="header-container">
        <div className="header-logo">
          {/* Logo placeholder */}
          <img
            src="https://uc6c31572d2e96645a2b866decb6.previews.dropboxusercontent.com/p/thumb/ACqJkhpPK7Pi6lTghZCpeAOze0_iAC7kYOx9fCED6Jb3ICMjrBWsmXuLUJH9DMwdCWSPTJdvQqhEacM0CxaHpY6X-R2cXw9kVFPHUx4x2IA5-UGHwd31VJf5TAH31pygoJ89G95zPVUWaOQteGN927Q6zg9hNTljMWmTWdiKd35-en7yVCZO29HIlztgEvGFd0nBrr4kHSOASfkhN8NRVrefb3YPuCJNwSCSRC8T6c58qlLbiA6mWnN2EBje5kPBUwucZssm6ibAATl4y2A7CI88Y1sUjMO4xt1qn1w2Wxq6yL77BovVtfJFn2wJpbrqI-__PQcHS8outoRY2NxQZyUZvbois9-fxKS15Wk69cCHOIWcXOHP7j_U-D5gzJTc874iwaeNacF0SHxivrvVLQV3/p.png?is_prewarmed=true"
            alt="Logo"
            className="logo"
          />
          {/* Title */}
          <div>French SaaS</div>
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
        <button className="button" >
          Ajouter votre produit
        </button>
      </div>
    </header>
  );
}