import { useEffect, useState } from 'react';
import { fetchCompanies } from '../utils/api';
import { CompanyRow } from '../types';
import { useNavigate } from 'react-router-dom';

export default function Admin() {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<CompanyRow[]>([]);

  useEffect(() => {
    fetchCompanies().then(data => setCompanies(data));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    navigate('/');
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl mb-4">Admin Panel</h1>
      <button onClick={handleLogout} className="mb-4 text-red-600">
        Logout
      </button>
      {/* For now, editing directly via Google Sheets; show sheet link */}
      <p>
        To update companies, edit the <a href={process.env.REACT_APP_SHEET_CSV_URL} target="_blank" rel="noreferrer" className="text-blue-600">Google Sheet</a>.
      </p>
      <div className="mt-6">
        <h2 className="text-2xl mb-2">Current Entries</h2>
        <ul className="list-disc pl-5">
          {companies.map(c => (
            <li key={c.id}>{c.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
