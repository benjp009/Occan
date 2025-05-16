import Papa from 'papaparse';
import { CompanyRow } from '../types';

export async function fetchCompanies(): Promise<CompanyRow[]> {
  const url = process.env.REACT_APP_SHEET_CSV_URL!;
  const response = await fetch(url);
  const csv = await response.text();
  const { data } = Papa.parse<CompanyRow>(csv, { header: true });
  return (data as CompanyRow[]).filter(row => row.id && row.name);
}