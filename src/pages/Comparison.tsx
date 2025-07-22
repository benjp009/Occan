import React, { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { fetchCompanies } from '../utils/api';
import { CompanyRow } from '../types';

export default function Comparison() {
  const [companies, setCompanies] = useState<CompanyRow[]>([]);
  const [selected, setSelected] = useState<CompanyRow[]>([]);

  useEffect(() => {
    fetchCompanies().then(setCompanies);
  }, []);

  const toggle = (company: CompanyRow) => {
    setSelected(prev =>
      prev.some(c => c.id === company.id)
        ? prev.filter(c => c.id !== company.id)
        : [...prev, company]
    );
  };

  const features: { label: string; render: (c: CompanyRow) => React.ReactNode }[] = [
    { label: 'Site web', render: c => c.website },
    { label: 'Téléphone', render: c => c.phone },
    { label: 'Email', render: c => c.email },
    { label: 'Catégories', render: c => c.categories },
    { label: 'Ville', render: c => c.hq_city },
  ];

  return (
    <>
      <Header />
      <main className="container-category">
        <h1>Comparer des logiciels</h1>
        <p>Sélectionnez les logiciels à comparer dans la liste ci‑dessous.</p>
        <div className="comparison-list">
          {companies.map(co => (
            <label key={co.id} style={{ display: 'block', marginBottom: '0.25rem' }}>
              <input
                type="checkbox"
                checked={selected.some(c => c.id === co.id)}
                onChange={() => toggle(co)}
              />{' '}
              {co.name}
            </label>
          ))}
        </div>
        {selected.length > 0 && (
          <table className="comparison-table" style={{ marginTop: '1rem', width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', borderBottom: '1px solid #ccc' }}>Caractéristiques</th>
                {selected.map(co => (
                  <th key={co.id} style={{ textAlign: 'left', borderBottom: '1px solid #ccc' }}>{co.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {features.map(feat => (
                <tr key={feat.label}>
                  <td style={{ fontWeight: 'bold', padding: '0.5rem 0' }}>{feat.label}</td>
                  {selected.map(co => (
                    <td key={co.id} style={{ padding: '0.5rem 0' }}>
                      {feat.render(co) || '-'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
      <Footer />
    </>
  );
}
