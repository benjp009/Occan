import React, { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { fetchCompanies, fetchCategories } from '../utils/api';
import { CompanyRow, CategoryRow } from '../types';

export default function Comparison() {
  const [companies, setCompanies] = useState<CompanyRow[]>([]);
  const [selected, setSelected] = useState<CompanyRow[]>([]);
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [category, setCategory] = useState('');

  useEffect(() => {
    fetchCompanies().then(setCompanies);
    fetchCategories().then(setCategories);
  }, []);

  const toggle = (company: CompanyRow) => {
    setSelected(prev =>
      prev.some(c => c.id === company.id)
        ? prev.filter(c => c.id !== company.id)
        : [...prev, company]
    );
  };

  const filteredCompanies = category
    ? companies.filter(co => {
        if (!co.categories) return false;
        return co.categories
          .split(',')
          .map(c => c.trim().toLowerCase())
          .includes(category.toLowerCase());
      })
    : [];

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
        <h1>Comparez des logiciels</h1>
        <p>Choisissez une catégorie puis sélectionnez les logiciels à comparer.</p>

        <select
          value={category}
          onChange={e => {
            setSelected([]);
            setCategory(e.target.value);
          }}
        >
          <option value="">-- Choisir une catégorie --</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>

        {category && (
          <div className="comparison-list">
            {filteredCompanies.map(co => (
              <label
                key={co.id}
                style={{ display: 'block', marginBottom: '0.25rem', direction: 'rtl' }}
              >
                <input
                  type="checkbox"
                  checked={selected.some(c => c.id === co.id)}
                  onChange={() => toggle(co)}
                />{' '}
                {co.name}
              </label>
            ))}
          </div>
        )}
        {selected.length > 0 && (
          <div className="comparison-table-wrapper">
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
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
