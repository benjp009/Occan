import { CompanyRow } from '../types';

export function Card({ company }: { company: CompanyRow }) {
  return (
    <div className="w-full sm:w-64 md:w-56 lg:w-60 border p-4 rounded flex flex-col items-center">
      {/* Company Logo */}
      {company.logo && (
        <div className="h-10 w-10 mb-4 flex-shrink-0 overflow-hidden">
          <img
            src={company.logo}
            alt={`${company.name} logo`}
            width={80}
            height={80}
            style={{ objectFit: 'contain' }}
          />
        </div>
      )}
      <h2 className="font-bold text-lg mb-2">{company.name}</h2>
      <p className="text-sm mb-4 text-center">{company.description}</p>
      <a
        href={company.referral}
        target="_blank"
        rel="noreferrer"
        className="text-blue-600 hover:underline"
      >
        {company.website}
      </a>
    </div>
  );
}