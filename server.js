const fs = require('fs');
require('dotenv').config();
const path = require('path');
const express = require('express');
const crypto = require('crypto');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const cors = require('cors');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const { HelmetProvider } = require('react-helmet-async');

// Handle non-JS imports (SVG, CSS) that are referenced in React components
// These are static assets that don't need to be loaded server-side
['.css', '.svg'].forEach(ext => {
  require.extensions[ext] = (module, filename) => {
    module.exports = '';
  };
});

// Import pre-compiled modules from dist-server
const App = require('./dist-server/App.js').default;
const { slugify } = require('./dist-server/utils/slugify.js');
const { fetchCompanies, fetchCategories } = require('./dist-server/utils/api.js');

// In-memory session store (for production, use Redis or similar)
const sessions = new Map();

const PORT = process.env.PORT || 3000;
const app = express();

// Parse JSON bodies and cookies
app.use(express.json());
app.use(cookieParser());

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

// Security headers with helmet
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://www.googletagmanager.com", "https://www.clarity.ms", "https://www.google-analytics.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      connectSrc: ["'self'", "https://docs.google.com", "https://script.google.com", "https://www.google-analytics.com", "https://www.clarity.ms"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: process.env.NODE_ENV === 'production' ? [] : null
    }
  },
  crossOriginEmbedderPolicy: false, // Required for external images
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true
  }
}));

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? ['https://logicielfrance.com', 'https://www.logicielfrance.com']
    : 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

// Additional security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  next();
});

const indexFile = path.resolve('./build/index.html');
// Use index: false to prevent express.static from serving index.html
// This ensures our SSR handler processes HTML requests
app.use(express.static(path.resolve('./build'), { index: false }));
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

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Admin authentication endpoints
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;

  if (!password || !process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Compare password securely using timing-safe comparison
  const inputHash = crypto.createHash('sha256').update(password).digest('hex');
  const storedHash = crypto.createHash('sha256').update(process.env.ADMIN_PASSWORD).digest('hex');

  if (crypto.timingSafeEqual(Buffer.from(inputHash), Buffer.from(storedHash))) {
    // Create session
    const sessionId = crypto.randomBytes(32).toString('hex');
    const expiresAt = Date.now() + (24 * 60 * 60 * 1000); // 24 hours
    sessions.set(sessionId, { createdAt: Date.now(), expiresAt });

    // Set httpOnly cookie
    res.cookie('adminSession', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000
    });

    return res.json({ success: true });
  }

  return res.status(401).json({ error: 'Invalid credentials' });
});

app.post('/api/admin/logout', (req, res) => {
  const sessionId = req.cookies?.adminSession;
  if (sessionId) {
    sessions.delete(sessionId);
  }
  res.clearCookie('adminSession');
  return res.json({ success: true });
});

app.get('/api/admin/verify', (req, res) => {
  const sessionId = req.cookies?.adminSession;
  const session = sessions.get(sessionId);

  if (session && session.expiresAt > Date.now()) {
    return res.json({ authenticated: true });
  }

  return res.status(401).json({ authenticated: false });
});

// Blog API endpoints (server-side only, no API key exposure)
app.get('/api/blog/posts', (req, res) => {
  try {
    const blogListPath = path.resolve('./build/blog-posts.json');
    if (fs.existsSync(blogListPath)) {
      const posts = JSON.parse(fs.readFileSync(blogListPath, 'utf8'));
      const published = Array.isArray(posts)
        ? posts.filter(p => (p.status || '').toLowerCase() === 'published')
        : [];
      return res.json(published);
    }
    return res.json([]);
  } catch (err) {
    console.error('Failed to load blog posts:', err);
    return res.status(500).json({ error: 'Failed to load posts' });
  }
});

app.get('/api/blog/posts/:slug', (req, res) => {
  try {
    const blogPostPath = path.resolve(`./build/posts/${req.params.slug}.json`);
    if (fs.existsSync(blogPostPath)) {
      return res.json(JSON.parse(fs.readFileSync(blogPostPath, 'utf8')));
    }
    return res.status(404).json({ error: 'Post not found' });
  } catch (err) {
    console.error('Failed to load blog post:', err);
    return res.status(500).json({ error: 'Failed to load post' });
  }
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
    console.error('SSR Error:', err);
    return res.status(500).send('Error loading HTML file: ' + err.message);
  }
});

app.listen(PORT, () => {
  console.log(`SSR running on port ${PORT}`);
});
