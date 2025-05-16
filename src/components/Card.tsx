import React from 'react';
import { CompanyRow } from '../types';

export function Card({ company }: { company: CompanyRow }) {
  return (
    <div className="border p-4 rounded flex flex-col items-center">
      {/* Company Logo */}
      {company.logo && (
        <div className="h-10 w-10 mb-4 flex-shrink-0 overflow-hidden">
          <img
            src={company.logo}
            alt={`${company.name} logo`}
            width={60}
            height={60}
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
