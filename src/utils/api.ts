import Papa from 'papaparse';
import { CompanyRow } from '../types';
import { CategoryRow } from '../types';

export async function fetchCompanies(): Promise<CompanyRow[]> {
  const url = process.env.REACT_APP_SHEET_CSV_URL!;
  const response = await fetch(url);
  const csv = await response.text();
  const { data } = Papa.parse<CompanyRow>(csv, { header: true });
  return (data as CompanyRow[]).filter(row => row.id && row.name);
}

const CATEGORIES_CSV =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vQuHiS0jgp1NpIHZdALbnQxrqF1aWnEVkI2w-ZHZojfbRsdEGgOXeW4Et7L3B6pMuW2wMOvMc97M210/pub?gid=583866653&single=true&output=csv';

export async function fetchCategories(): Promise<CategoryRow[]> {
  const resp = await fetch(CATEGORIES_CSV);
  const text = await resp.text();
  const { data } = Papa.parse<CategoryRow>(text, { header: true });
  // drop any rows without a name
  return (data as CategoryRow[]).filter((r) => r.name);
}