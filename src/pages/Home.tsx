import React, { useEffect, useState } from 'react';
import { fetchCompanies } from '../utils/api';
import { CompanyRow } from '../types';
import { Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { Hero } from '../components/Hero';
import { Footer } from '../components/Footer';

export default function Home() {
  const [companies, setCompanies] = useState<CompanyRow[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchCompanies().then(data => setCompanies(data));
  }, []);

  const filtered = companies.filter(c =>
    (c.name ?? '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Header onSearch={setSearch} />
      <Hero onSearch={setSearch} />
      <main className="container mx-auto p-6">
        <h1 className="text-3xl mb-4">French SaaS Directory</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filtered.map(c => (
            <div key={c.id} className="border p-4 rounded flex flex-col items-center">
              {/* Company Logo */}
              {c.logo && (
                <img
                  src={c.logo}
                  alt={`${c.name} logo`}
                  className="h-10 mb-4 object-contain"
                />
              )}
              <h2 className="font-bold text-lg mb-2">{c.name}</h2>
              <p className="text-sm mb-4 text-center">{c.description}</p>
              <a
                href={c.referral}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600"
              >
                {c.website}
              </a>
            </div>
          ))}
        </div>
        <div className="mt-6">
          <Link to="/admin" className="text-blue-600">
            Admin Login/Edit
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
