import { SponsorRow } from '../types';

interface SponsorAdProps {
  sponsor: SponsorRow;
  onSponsorClick: () => void;
}

export default function SponsorAd({ sponsor, onSponsorClick }: SponsorAdProps) {
  const handleClick = () => {
    onSponsorClick();
    window.open(sponsor.url, '_blank', 'noopener,noreferrer');
  };

  const customStyles: React.CSSProperties = {
    ...(sponsor.border_color && { borderColor: sponsor.border_color }),
    ...(sponsor.bg_color && { background: sponsor.bg_color }),
  };

  return (
    <div className="sponsor-ad" style={customStyles}>
      <span className="sponsor-ad-badge">Sponsorisé</span>
      <div className="sponsor-ad-content" onClick={handleClick}>
        {sponsor.logo && (
          <img
            src={sponsor.logo}
            alt={sponsor.name}
            className="sponsor-ad-logo"
          />
        )}
        <div className="sponsor-ad-text">
          <h3 className="sponsor-ad-name">{sponsor.name}</h3>
          <p className="sponsor-ad-tagline">{sponsor.tagline}</p>
        </div>
        <span className="sponsor-ad-cta">Découvrir →</span>
      </div>
    </div>
  );
}
