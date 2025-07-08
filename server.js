const fs = require('fs');
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

const indexFile = path.resolve('./build/index.html');
app.use(express.static(path.resolve('./build')));
app.use('/static', express.static(path.resolve('./build/static')));
app.use('/asset', express.static(path.resolve('./build/asset')));

app.get('*', async (req, res) => {
  try {
    const htmlData = await fs.promises.readFile(indexFile, 'utf8');

    let extraMeta = '';
    let initialData = {};
    const softwareMatch = req.url.match(/^\/logiciel\/([^/?#]+)/);
    const categoryMatch = req.url.match(/^\/categorie\/([^/?#]+)/);
    const allSoftwaresMatch = req.url.startsWith('/tous-les-logiciels');
    const homeMatch = req.url === '/' || req.url.startsWith('/?');
    if (softwareMatch) {
      try {
        const companies = await fetchCompanies();
        const company = companies.find(
          c => slugify(c.name) === softwareMatch[1] || c.id === softwareMatch[1]
        );
        if (company) {
          initialData = { company };
          if (company.meta_description) {
            const desc = String(company.meta_description).replace(/"/g, '&quot;');
            extraMeta = `<meta name="description" content="${desc}" />`;
          }
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
          initialData = { category, companies };
        }
      } catch (err) {
        console.error('Failed to fetch category data', err);
      }
    } else if (allSoftwaresMatch || homeMatch) {
      try {
        const companies = await fetchCompanies();
        initialData = { companies };
      } catch (err) {
        console.error('Failed to fetch companies', err);
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
      `${helmetString}${extraMeta}</head>`
    );
    return res.send(htmlWithHelmet);
  } catch (err) {
    return res.status(500).send('Error loading HTML file');
  }
});

app.listen(PORT, () => {
  console.log(`SSR running on port ${PORT}`);
});
