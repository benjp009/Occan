import React, { useEffect, useState } from 'react';
import { fetchCompanies } from '../utils/api';
import { CompanyRow } from '../types';
import { Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { Card } from '../components/Card';
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
          {filtered.map(company => (
            <Card key={company.id} company={company} />
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
