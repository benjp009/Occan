const fs = require('fs');
const { execSync } = require('child_process');
const Papa = require('papaparse');

const CATEGORIES_CSV = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQuHiS0jgp1NpIHZdALbnQxrqF1aWnEVkI2w-ZHZojfbRsdEGgOXeW4Et7L3B6pMuW2wMOvMc97M210/pub?gid=583866653&single=true&output=csv';

function slugify(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

function fetchCSV(url) {
  return execSync(`curl -sL "${url}"`, { encoding: 'utf8' });
}

function fetchCategories() {
  const text = fetchCSV(CATEGORIES_CSV);
  const { data } = Papa.parse(text, { header: true });
  return data.filter(r => r.name);
}

function generate() {
  const categories = fetchCategories();
  const urls = categories.map(c => `/category/${slugify(c.name)}`);
  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>\n';
  const open = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  const close = '\n</urlset>\n';
  const body = urls.map(u => `  <url><loc>${u}</loc></url>`).join('\n');
  fs.writeFileSync('public/sitemap.xml', xmlHeader + open + body + close, 'utf8');
  console.log(`Generated sitemap with ${urls.length} URLs`);
}

generate();