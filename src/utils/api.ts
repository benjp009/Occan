import Papa from 'papaparse';
import { CompanyRow, CategoryRow, CompetitorRow, UseCaseRow, GlossaryRow, SponsorRow } from '../types';

// In-memory cache for API responses
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const cache: Map<string, CacheEntry<unknown>> = new Map();
const CACHE_TTL = 60 * 1000; // 60 seconds (short TTL for multi-instance Cloud Run)

function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (entry && Date.now() - entry.timestamp < CACHE_TTL) {
    return entry.data as T;
  }
  return null;
}

function setCache<T>(key: string, data: T): void {
  cache.set(key, { data, timestamp: Date.now() });
}

// Clear all cached data (used by webhook for cache invalidation)
export function clearCache(): void {
  cache.clear();
}

// Fallback URL for companies CSV (used when env var is not available at runtime)
const COMPANIES_CSV_FALLBACK =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vQuHiS0jgp1NpIHZdALbnQxrqF1aWnEVkI2w-ZHZojfbRsdEGgOXeW4Et7L3B6pMuW2wMOvMc97M210/pub?gid=0&single=true&output=csv';

export async function fetchCompanies(): Promise<CompanyRow[]> {
  const cached = getCached<CompanyRow[]>('companies');
  if (cached) return cached;

  const url = process.env.REACT_APP_SHEET_CSV_URL || COMPANIES_CSV_FALLBACK;
  const response = await fetch(url);
  const csv = await response.text();
  const { data } = Papa.parse<CompanyRow>(csv, { header: true });
  const companies = (data as CompanyRow[]).filter(row => row.id && row.name);

  setCache('companies', companies);
  return companies;
}

const CATEGORIES_CSV =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vQuHiS0jgp1NpIHZdALbnQxrqF1aWnEVkI2w-ZHZojfbRsdEGgOXeW4Et7L3B6pMuW2wMOvMc97M210/pub?gid=583866653&single=true&output=csv';

const BETA_CSV =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vQuHiS0jgp1NpIHZdALbnQxrqF1aWnEVkI2w-ZHZojfbRsdEGgOXeW4Et7L3B6pMuW2wMOvMc97M210/pub?gid=51672677&single=true&output=csv';

export async function fetchBetaCompanies(): Promise<CompanyRow[]> {
  const cached = getCached<CompanyRow[]>('betaCompanies');
  if (cached) return cached;

  try {
    const response = await fetch(BETA_CSV);
    const csv = await response.text();
    const { data } = Papa.parse<CompanyRow>(csv, { header: true });
    const companies = (data as CompanyRow[]).filter(row => row.id && row.name);

    setCache('betaCompanies', companies);
    return companies;
  } catch (error) {
    console.error('Failed to fetch beta companies:', error);
    return [];
  }
}

export async function fetchCategories(): Promise<CategoryRow[]> {
  const cached = getCached<CategoryRow[]>('categories');
  if (cached) return cached;

  const resp = await fetch(CATEGORIES_CSV);
  const text = await resp.text();
  const { data } = Papa.parse<CategoryRow>(text, { header: true });
  const categories = (data as CategoryRow[]).filter((r) => r.name);

  setCache('categories', categories);
  return categories;
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
  const cached = getCached<CompetitorRow[]>('competitors');
  if (cached) return cached;

  try {
    const response = await fetch(COMPETITORS_CSV);
    const csv = await response.text();
    const { data } = Papa.parse<CompetitorRow>(csv, { header: true });
    const competitors = (data as CompetitorRow[]).filter(row => row.competitor_name && row.slug);

    setCache('competitors', competitors);
    return competitors;
  } catch (error) {
    console.error('Failed to fetch competitors:', error);
    return [];
  }
}

// Use Cases CSV (for Use Case pages)
const USECASES_CSV = process.env.REACT_APP_USECASES_CSV_URL ||
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vQuHiS0jgp1NpIHZdALbnQxrqF1aWnEVkI2w-ZHZojfbRsdEGgOXeW4Et7L3B6pMuW2wMOvMc97M210/pub?gid=620023561&single=true&output=csv';

export async function fetchUseCases(): Promise<UseCaseRow[]> {
  const cached = getCached<UseCaseRow[]>('useCases');
  if (cached) return cached;

  try {
    const response = await fetch(USECASES_CSV);
    const csv = await response.text();
    const { data } = Papa.parse<UseCaseRow>(csv, { header: true });
    const useCases = (data as UseCaseRow[]).filter(row => row.usecase_name && row.slug);

    setCache('useCases', useCases);
    return useCases;
  } catch (error) {
    console.error('Failed to fetch use cases:', error);
    return [];
  }
}

// Glossary CSV (for definition/glossary pages)
const GLOSSARY_CSV = process.env.REACT_APP_GLOSSARY_CSV_URL ||
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vQuHiS0jgp1NpIHZdALbnQxrqF1aWnEVkI2w-ZHZojfbRsdEGgOXeW4Et7L3B6pMuW2wMOvMc97M210/pub?gid=1020178758&single=true&output=csv';

export async function fetchGlossary(): Promise<GlossaryRow[]> {
  const cached = getCached<GlossaryRow[]>('glossary');
  if (cached) return cached;

  try {
    const response = await fetch(GLOSSARY_CSV);
    const csv = await response.text();
    const { data } = Papa.parse<GlossaryRow>(csv, { header: true });
    const glossary = (data as GlossaryRow[]).filter(row => row.term_name && row.slug && row.status === 'published');

    setCache('glossary', glossary);
    return glossary;
  } catch (error) {
    console.error('Failed to fetch glossary:', error);
    return [];
  }
}

// Sponsors CSV (for refer page ads)
const SPONSORS_CSV = process.env.REACT_APP_SPONSORS_CSV_URL ||
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vQuHiS0jgp1NpIHZdALbnQxrqF1aWnEVkI2w-ZHZojfbRsdEGgOXeW4Et7L3B6pMuW2wMOvMc97M210/pub?gid=SPONSORS_GID&single=true&output=csv';

// Default sponsor to use when no sponsors are configured yet
const DEFAULT_SPONSOR: SponsorRow = {
  id: 'default',
  name: 'Logiciel France',
  logo: '/logo.svg',
  tagline: 'Découvrez les meilleurs logiciels français',
  url: '/',
  active: 'true'
};

export async function fetchSponsors(): Promise<SponsorRow[]> {
  const cached = getCached<SponsorRow[]>('sponsors');
  if (cached) return cached;

  // If no sponsors CSV is configured, return default sponsor
  if (!process.env.REACT_APP_SPONSORS_CSV_URL) {
    return [DEFAULT_SPONSOR];
  }

  try {
    const response = await fetch(SPONSORS_CSV);
    const csv = await response.text();
    const { data } = Papa.parse<SponsorRow>(csv, { header: true, transformHeader: (h) => h.trim() });
    const sponsors = (data as SponsorRow[]).filter(row => {
      const active = row.active?.toLowerCase().trim();
      return row.id && row.name && (active === 'true' || active === 'yes');
    });

    if (sponsors.length === 0) {
      return [DEFAULT_SPONSOR];
    }

    setCache('sponsors', sponsors);
    return sponsors;
  } catch (error) {
    console.error('Failed to fetch sponsors:', error);
    return [DEFAULT_SPONSOR];
  }
}

export function getRandomSponsor(sponsors: SponsorRow[]): SponsorRow {
  return sponsors[Math.floor(Math.random() * sponsors.length)];
}
