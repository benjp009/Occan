const fs = require('fs');
const Papa = require('papaparse');
require('dotenv').config();

const TODAY = new Date().toISOString().split('T')[0];

function formatDate(str) {
  if (!str) return TODAY;
  const d = new Date(str);
  if (Number.isNaN(d.getTime())) {
    return TODAY;
  }
  return d.toISOString().split('T')[0];
}

const CATEGORIES_CSV =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vQuHiS0jgp1NpIHZdALbnQxrqF1aWnEVkI2w-ZHZojfbRsdEGgOXeW4Et7L3B6pMuW2wMOvMc97M210/pub?gid=583866653&single=true&output=csv';
const COMPANIES_CSV =
  process.env.REACT_APP_SHEET_CSV_URL ||
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vQuHiS0jgp1NpIHZdALbnQxrqF1aWnEVkI2w-ZHZojfbRsdEGgOXeW4Et7L3B6pMuW2wMOvMc97M210/pub?output=csv';
const BASE_URL = 'https://logicielfrance.com';

function slugify(name) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

async function fetchCategories() {
  const response = await fetch(CATEGORIES_CSV);
  const text = await response.text();
  const { data } = Papa.parse(text, { header: true });
  return data.filter(r => r.name);
}

async function fetchCompanies() {
  const resp = await fetch(COMPANIES_CSV);
  const text = await resp.text();
  const { data } = Papa.parse(text, { header: true });
  return data.filter(r => r.id && r.name);
}

async function generate() {
  let categories = [];
  let companies = [];
  try {
    categories = await fetchCategories();
  } catch (err) {
    console.error('Failed to fetch categories:', err.message);
  }

   try {
    companies = await fetchCompanies();
  } catch (err) {
    console.error('Failed to fetch companies:', err.message);
  }

  const staticUrls = [
    { loc: `${BASE_URL}/`, priority: '1.0', lastmod: TODAY },
    { loc: `${BASE_URL}/ajouter-un-nouveau-logiciel`, priority: '0.8', lastmod: TODAY },
    { loc: `${BASE_URL}/all-categories`, priority: '0.8', lastmod: TODAY },
    { loc: `${BASE_URL}/login`, priority: '0.5', lastmod: TODAY },
    { loc: `${BASE_URL}/admin`, priority: '0.5', lastmod: TODAY },
  ];

  const categoryUrls = categories
    .filter(c => c.name && typeof c.name === 'string')
    .map(c => ({
      loc: `${BASE_URL}/categorie/${slugify(c.name)}`,
      priority: '0.7',
      lastmod: TODAY,
    }))
    .sort((a, b) => a.loc.localeCompare(b.loc));

  const softwareUrls = companies
    .filter(c => c.name && typeof c.name === 'string')
    .map(c => ({
      loc: `${BASE_URL}/logiciel/${slugify(c.name)}`,
      priority: '0.6',
      lastmod: formatDate(c.date_updated || c.date_added),
    }))
    .sort((a, b) => a.loc.localeCompare(b.loc));

  const urls = staticUrls.concat(categoryUrls, softwareUrls);


  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ];

  for (const { loc, priority, lastmod } of urls) {
    lines.push('  <url>');
    lines.push(`    <loc>${loc}</loc>`);
    if (lastmod) {
      lines.push(`    <lastmod>${lastmod}</lastmod>`);
    }
    lines.push(`    <priority>${priority}</priority>`);
    lines.push('  </url>');
  }

  lines.push('</urlset>');

  fs.writeFileSync('public/sitemap.xml', lines.join('\n'), 'utf8');
  console.log(`Generated sitemap with ${urls.length} URLs`);
}

generate();