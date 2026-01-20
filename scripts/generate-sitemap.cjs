const fs = require('fs');
const Papa = require('papaparse');
const path = require('path');
require('dotenv').config();
const fetch = require('node-fetch');

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
const COMPETITORS_CSV = process.env.REACT_APP_COMPETITORS_CSV_URL || 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQuHiS0jgp1NpIHZdALbnQxrqF1aWnEVkI2w-ZHZojfbRsdEGgOXeW4Et7L3B6pMuW2wMOvMc97M210/pub?gid=1924297465&single=true&output=csv';
const USECASES_CSV = process.env.REACT_APP_USECASES_CSV_URL || 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQuHiS0jgp1NpIHZdALbnQxrqF1aWnEVkI2w-ZHZojfbRsdEGgOXeW4Et7L3B6pMuW2wMOvMc97M210/pub?gid=620023561&single=true&output=csv';
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

async function fetchBlogPosts() {
  try {
    const blogPostsPath = path.join(__dirname, '../public/blog-posts.json');
    if (!fs.existsSync(blogPostsPath)) {
      console.log('Aucun fichier blog-posts.json trouvé');
      return [];
    }

    const data = fs.readFileSync(blogPostsPath, 'utf8');
    const posts = JSON.parse(data);
    return posts.filter(post => post.status === 'published' && post.slug);
  } catch (error) {
    console.error('Erreur lors de la récupération des articles de blog:', error.message);
    return [];
  }
}

async function fetchCompetitors() {
  if (!COMPETITORS_CSV) {
    console.log('No REACT_APP_COMPETITORS_CSV_URL configured, skipping competitors');
    return [];
  }
  try {
    const response = await fetch(COMPETITORS_CSV);
    const text = await response.text();
    const { data } = Papa.parse(text, { header: true });
    return data.filter(r => r.competitor_name && r.slug);
  } catch (err) {
    console.error('Failed to fetch competitors:', err.message);
    return [];
  }
}

async function fetchUseCases() {
  if (!USECASES_CSV) {
    console.log('No REACT_APP_USECASES_CSV_URL configured, skipping use cases');
    return [];
  }
  try {
    const response = await fetch(USECASES_CSV);
    const text = await response.text();
    const { data } = Papa.parse(text, { header: true });
    return data.filter(r => r.usecase_name && r.slug);
  } catch (err) {
    console.error('Failed to fetch use cases:', err.message);
    return [];
  }
}

async function generate() {
  let categories = [];
  let companies = [];
  let blogPosts = [];
  let competitors = [];
  let useCases = [];

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

  try {
    blogPosts = await fetchBlogPosts();
  } catch (err) {
    console.error('Failed to fetch blog posts:', err.message);
  }

  try {
    competitors = await fetchCompetitors();
  } catch (err) {
    console.error('Failed to fetch competitors:', err.message);
  }

  try {
    useCases = await fetchUseCases();
  } catch (err) {
    console.error('Failed to fetch use cases:', err.message);
  }

  const staticUrls = [
    { loc: `${BASE_URL}/`, priority: '1.0', lastmod: TODAY },
    { loc: `${BASE_URL}/categorie`, priority: '0.8', lastmod: TODAY },
    { loc: `${BASE_URL}/blog`, priority: '0.8', lastmod: TODAY },
    { loc: `${BASE_URL}/tous-les-logiciels`, priority: '0.8', lastmod: TODAY },
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

  const blogUrls = blogPosts
    .filter(post => post.slug && typeof post.slug === 'string')
    .map(post => ({
      loc: `${BASE_URL}/blog/${post.slug}`,
      priority: '0.7',
      lastmod: formatDate(post.updatedAt || post.publishedAt),
    }))
    .sort((a, b) => a.loc.localeCompare(b.loc));

  const alternativeUrls = competitors
    .filter(c => c.slug && typeof c.slug === 'string')
    .map(c => ({
      loc: `${BASE_URL}/alternative/${c.slug}`,
      priority: '0.7',
      lastmod: TODAY,
    }))
    .sort((a, b) => a.loc.localeCompare(b.loc));

  const useCaseUrls = useCases
    .filter(u => u.slug && typeof u.slug === 'string')
    .map(u => ({
      loc: `${BASE_URL}/meilleur-logiciel-pour/${u.slug}`,
      priority: '0.7',
      lastmod: TODAY,
    }))
    .sort((a, b) => a.loc.localeCompare(b.loc));

  const urls = staticUrls.concat(categoryUrls, softwareUrls, blogUrls, alternativeUrls, useCaseUrls);


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