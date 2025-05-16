import { CompanyRow } from '../types';

export function Card({ company }: { company: CompanyRow }) {
  return (
    <div className="card">
      {/* Company Logo */}
      {company.logo && (
        <div className="company">
          <img
            src={company.logo}
            alt={`${company.name} logo`}
            width={80}
            height={80}
            style={{ objectFit: 'contain' }}
          />
        </div>
      )}
      <h2 className="subtitle">{company.name}</h2>
      <p className="text">{company.description}</p>
      <a
        href={company.referral}
        target="_blank"
        rel="noreferrer"
        className="hyperlink"
      >
        {company.website}
      </a>
    </div>
  );
}