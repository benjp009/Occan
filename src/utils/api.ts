import Papa from 'papaparse';
import { CompanyRow, CategoryRow, CompetitorRow, UseCaseRow } from '../types';

// Fallback URL for companies CSV (used when env var is not available at runtime)
const COMPANIES_CSV_FALLBACK =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vQuHiS0jgp1NpIHZdALbnQxrqF1aWnEVkI2w-ZHZojfbRsdEGgOXeW4Et7L3B6pMuW2wMOvMc97M210/pub?gid=0&single=true&output=csv';

export async function fetchCompanies(): Promise<CompanyRow[]> {
  const url = process.env.REACT_APP_SHEET_CSV_URL || COMPANIES_CSV_FALLBACK;
  const response = await fetch(url);
  const csv = await response.text();
  const { data } = Papa.parse<CompanyRow>(csv, { header: true });
  return (data as CompanyRow[]).filter(row => row.id && row.name);
}

const CATEGORIES_CSV =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vQuHiS0jgp1NpIHZdALbnQxrqF1aWnEVkI2w-ZHZojfbRsdEGgOXeW4Et7L3B6pMuW2wMOvMc97M210/pub?gid=583866653&single=true&output=csv';

const BETA_CSV =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vQuHiS0jgp1NpIHZdALbnQxrqF1aWnEVkI2w-ZHZojfbRsdEGgOXeW4Et7L3B6pMuW2wMOvMc97M210/pub?gid=51672677&single=true&output=csv';

export async function fetchBetaCompanies(): Promise<CompanyRow[]> {
  try {
    const response = await fetch(BETA_CSV);
    const csv = await response.text();
    const { data } = Papa.parse<CompanyRow>(csv, { header: true });
    return (data as CompanyRow[]).filter(row => row.id && row.name);
  } catch (error) {
    console.error('Failed to fetch beta companies:', error);
    return [];
  }
}

export async function fetchCategories(): Promise<CategoryRow[]> {
  const resp = await fetch(CATEGORIES_CSV);
  const text = await resp.text();
  const { data } = Papa.parse<CategoryRow>(text, { header: true });
  // drop any rows without a name
  return (data as CategoryRow[]).filter((r) => r.name);
}

// CSV listing the software names selected for each month. The URL is stored in
// an environment variable so the gid can be configured without code changes.
const MONTH_CHOICE_CSV = process.env.REACT_APP_MONTH_CHOICE_CSV_URL!;

/**
 * Fetch the list of software names for a given month from the "month Choice"
 * sheet. The first row contains the month names and each column lists the
 * software names for that month.
 */
export async function fetchMonthlySelection(month: string): Promise<string[]> {
  if (!MONTH_CHOICE_CSV) return [];

  let text: string;
  try {
    const resp = await fetch(MONTH_CHOICE_CSV);
    text = await resp.text();
  } catch (err) {
    console.error('Failed to fetch monthly selection:', err);
    return [];
  }

  const { data } = Papa.parse<string[]>(text, { header: false });
  if (data.length === 0) return [];

  const headers = data[0] as string[];
  const monthIndex = headers.findIndex(
    h => h.toLowerCase().trim() === month.toLowerCase(),
  );
  if (monthIndex === -1) return [];

  const names: string[] = [];
  for (let i = 1; i < data.length; i++) {
    const row = data[i] as string[];
    const name = row[monthIndex]?.trim();
    if (name) names.push(name);
  }
  return names;
}

// Competitors CSV (for Alternative pages)
const COMPETITORS_CSV = process.env.REACT_APP_COMPETITORS_CSV_URL ||
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vQuHiS0jgp1NpIHZdALbnQxrqF1aWnEVkI2w-ZHZojfbRsdEGgOXeW4Et7L3B6pMuW2wMOvMc97M210/pub?gid=1924297465&single=true&output=csv';

export async function fetchCompetitors(): Promise<CompetitorRow[]> {
  try {
    const response = await fetch(COMPETITORS_CSV);
    const csv = await response.text();
    const { data } = Papa.parse<CompetitorRow>(csv, { header: true });
    return (data as CompetitorRow[]).filter(row => row.competitor_name && row.slug);
  } catch (error) {
    console.error('Failed to fetch competitors:', error);
    return [];
  }
}

// Use Cases CSV (for Use Case pages)
const USECASES_CSV = process.env.REACT_APP_USECASES_CSV_URL ||
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vQuHiS0jgp1NpIHZdALbnQxrqF1aWnEVkI2w-ZHZojfbRsdEGgOXeW4Et7L3B6pMuW2wMOvMc97M210/pub?gid=620023561&single=true&output=csv';

export async function fetchUseCases(): Promise<UseCaseRow[]> {
  try {
    const response = await fetch(USECASES_CSV);
    const csv = await response.text();
    const { data } = Papa.parse<UseCaseRow>(csv, { header: true });
    return (data as UseCaseRow[]).filter(row => row.usecase_name && row.slug);
  } catch (error) {
    console.error('Failed to fetch use cases:', error);
    return [];
  }
}
