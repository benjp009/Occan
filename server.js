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
    const match = req.url.match(/^\/logiciel\/([^/?#]+)/);
    if (match) {
      try {
        const resp = await fetch(process.env.REACT_APP_SHEET_CSV_URL);
        const csv = await resp.text();
        const { data } = Papa.parse(csv, { header: true });
        const company = data.find(
          c => slugify(c.name) === match[1] || c.id === match[1]
        );
        if (company && company.meta_description) {
          const desc = String(company.meta_description).replace(/"/g, '&quot;');
          extraMeta = `<meta name="description" content="${desc}" />`;
        }
      } catch (err) {
        console.error('Failed to fetch meta description', err);
      }
    }

    const helmetContext = {};
    const appHtml = ReactDOMServer.renderToString(
      React.createElement(
        HelmetProvider,
        { context: helmetContext },
        React.createElement(App, { location: req.url })
      )
    );

    const { helmet } = helmetContext;
    const finalHtml = htmlData.replace(
      '<div id="root"></div>',
      `<div id="root">${appHtml}</div>`
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
