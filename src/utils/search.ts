// src/utils/search.ts
import { CompanyRow } from '../types';

export function filterCompanies(query: string, data: CompanyRow[]): CompanyRow[] {
  const q = query.trim().toLowerCase();
  if (!q) return data;

  return data.filter(row => {
    // 1) match name
    if (row.name.toLowerCase().includes(q)) return true;

    // 2) match any category (comma-separated)
    const cats = row.categories
      .split(',')
      .map(c => c.trim().toLowerCase());
    if (cats.some(c => c.includes(q))) return true;

    // 3) match any keyword (comma-separated)
    const kws = row.keywords
      .split(',')
      .map(k => k.trim().toLowerCase());
    if (kws.some(k => k.includes(q))) return true;

    return false;
  });
}
