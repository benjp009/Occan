const fs = require('fs');
const Papa = require('papaparse');

const CATEGORIES_CSV = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQuHiS0jgp1NpIHZdALbnQxrqF1aWnEVkI2w-ZHZojfbRsdEGgOXeW4Et7L3B6pMuW2wMOvMc97M210/pub?gid=583866653&single=true&output=csv';
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

async function generate() {
  let categories = [];
  try {
    categories = await fetchCategories();
  } catch (err) {
    console.error('Failed to fetch categories:', err.message);
  }

  const staticUrls = [
    { loc: `${BASE_URL}/`, priority: '1.0' },
    { loc: `${BASE_URL}/ajouter-un-nouveau-logiciel`, priority: '0.8' },
    { loc: `${BASE_URL}/all-categories`, priority: '0.8' },
    { loc: `${BASE_URL}/login`, priority: '0.5' },
    { loc: `${BASE_URL}/admin`, priority: '0.5' },
  ];

  const categoryUrls = categories
    .map(c => ({ loc: `${BASE_URL}/category/${slugify(c.name)}`, priority: '0.7' }))
    .sort((a, b) => a.loc.localeCompare(b.loc));

  const urls = staticUrls.concat(categoryUrls);

  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ];

  for (const { loc, priority } of urls) {
    lines.push('  <url>');
    lines.push(`    <loc>${loc}</loc>`);
    lines.push(`    <priority>${priority}</priority>`);
    lines.push('  </url>');
  }

  lines.push('</urlset>');

  fs.writeFileSync('public/sitemap.xml', lines.join('\n'), 'utf8');
  console.log(`Generated sitemap with ${urls.length} URLs`);
}

generate();