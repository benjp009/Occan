const fs = require('fs');
require('dotenv').config();
const path = require('path');
const express = require('express');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const tsNode = require('ts-node');
tsNode.register({
  transpileOnly: true,
  compilerOptions: { module: 'commonjs' },
});
['.css', '.svg'].forEach(ext => {
  require.extensions[ext] = () => '';
});
const App = require('./src/App.tsx').default;
const { HelmetProvider } = require('react-helmet-async');
const Papa = require('papaparse');
const { slugify } = require('./src/utils/slugify.ts');
const { fetchCompanies, fetchCategories } = require('./src/utils/api.ts');

const PORT = process.env.PORT || 3000;
const app = express();

// WWW redirect and HTTPS redirect middleware
app.use((req, res, next) => {
  const host = req.get('Host');
  
  // Redirect www to non-www
  if (host && host.startsWith('www.')) {
    const newHost = host.substring(4); // Remove 'www.'
    return res.redirect(301, `https://${newHost}${req.url}`);
  }
  
  // Check if we're in production and the request is HTTP
  if (req.header('x-forwarded-proto') !== 'https' && process.env.NODE_ENV === 'production') {
    return res.redirect(301, `https://${req.get('Host')}${req.url}`);
  }
  next();
});

// Security headers
app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'production') {
    // Force HTTPS for future requests
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  next();
});

const indexFile = path.resolve('./build/index.html');
app.use(express.static(path.resolve('./build')));
app.use('/static', express.static(path.resolve('./build/static')));
app.use('/asset', express.static(path.resolve('./build/asset')));

// Serve robots.txt and sitemap.xml directly
app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.sendFile(path.resolve('./build/robots.txt'));
});

app.get('/sitemap.xml', (req, res) => {
  res.type('application/xml');
  res.sendFile(path.resolve('./build/sitemap.xml'));
});

app.get('*', async (req, res) => {
  try {
    const htmlData = await fs.promises.readFile(indexFile, 'utf8');

    let initialData = {};
    const softwareMatch = req.url.match(/^\/logiciel\/([^/?#]+)/);
    const categoryMatch = req.url.match(/^\/categorie\/([^/?#]+)/);
    const blogPostMatch = req.url.match(/^\/blog\/([^/?#]+)/);
    const blogListMatch = req.url === '/blog' || req.url.startsWith('/blog?');
    const allSoftwaresMatch = req.url.startsWith('/tous-les-logiciels');
    const homeMatch = req.url === '/' || req.url.startsWith('/?');
    const allCategoriesMatch = req.url === '/categorie' || req.url.startsWith('/categorie?');
    if (softwareMatch) {
      try {
        const companies = await fetchCompanies();
        const company = companies.find(
          c => slugify(c.name) === softwareMatch[1] || c.id === softwareMatch[1]
        );
        if (company) {
          initialData = { company };
        }
      } catch (err) {
        console.error('Failed to fetch company data', err);
      }
    } else if (categoryMatch) {
      try {
        const [categories, companies] = await Promise.all([
          fetchCategories(),
          fetchCompanies(),
        ]);
        const category = categories.find(
          c => c.id === categoryMatch[1] || slugify(c.name) === categoryMatch[1]
        );
        if (category) {
          // Try to include related blog posts for this category from build assets
          let relatedPosts = [];
          try {
            const blogListPath = path.resolve('./build/blog-posts.json');
            if (fs.existsSync(blogListPath)) {
              const posts = JSON.parse(fs.readFileSync(blogListPath, 'utf8'));
              const cat = category.name.toLowerCase();
              relatedPosts = (Array.isArray(posts) ? posts : [])
                .filter(p => (p.status || '').toLowerCase() === 'published')
                .filter(p => {
                  const tags = (p.tags || []).map(t => (t || '').toLowerCase());
                  return tags.includes(cat) ||
                    (p.title || '').toLowerCase().includes(cat) ||
                    (p.excerpt || '').toLowerCase().includes(cat);
                })
                .slice(0, 6);
            }
          } catch (err) {
            console.error('Failed to compute related blog posts', err);
          }
          initialData = { category, companies, relatedPosts };
        }
      } catch (err) {
        console.error('Failed to fetch category data', err);
      }
    } else if (blogPostMatch) {
      try {
        const blogSlug = blogPostMatch[1];
        const blogPostPath = path.resolve(`./build/posts/${blogSlug}.json`);
        if (fs.existsSync(blogPostPath)) {
          const blogPostData = JSON.parse(fs.readFileSync(blogPostPath, 'utf8'));
          initialData = { blogPost: blogPostData };
        }
      } catch (err) {
        console.error('Failed to fetch blog post data', err);
      }
    } else if (blogListMatch) {
      try {
        const blogListPath = path.resolve('./build/blog-posts.json');
        if (fs.existsSync(blogListPath)) {
          const posts = JSON.parse(fs.readFileSync(blogListPath, 'utf8'));
          const published = Array.isArray(posts)
            ? posts.filter(p => (p.status || '').toLowerCase() === 'published')
            : [];
          initialData = { blogPosts: published };
        }
      } catch (err) {
        console.error('Failed to load blog posts list', err);
      }
    } else if (allSoftwaresMatch || homeMatch) {
      try {
        const [companies, categories] = await Promise.all([
          fetchCompanies(),
          fetchCategories(),
        ]);
        initialData = { companies, categories };
      } catch (err) {
        console.error('Failed to fetch companies', err);
      }
    } else if (allCategoriesMatch) {
      try {
        const categories = await fetchCategories();
        initialData = { categories };
      } catch (err) {
        console.error('Failed to fetch categories', err);
      }
    }

    const helmetContext = {};
    const appHtml = ReactDOMServer.renderToString(
      React.createElement(
        HelmetProvider,
        { context: helmetContext },
        React.createElement(App, { location: req.url, initialData })
      )
    );

    const { helmet } = helmetContext;
    const dataScript = `<script>window.__INITIAL_DATA__=${JSON.stringify(initialData).replace(/</g, '\u003c')}</script>`;
    const finalHtml = htmlData.replace(
      '<div id="root"></div>',
      `<div id="root">${appHtml}</div>${dataScript}`
    );
    const helmetString = helmet
      ? `${helmet.title.toString()}${helmet.meta.toString()}${helmet.link.toString()}`
      : '';
    const htmlWithHelmet = finalHtml.replace(
      '</head>',
      `${helmetString}</head>`
    );
    return res.send(htmlWithHelmet);
  } catch (err) {
    return res.status(500).send('Error loading HTML file');
  }
});

app.listen(PORT, () => {
  console.log(`SSR running on port ${PORT}`);
});
