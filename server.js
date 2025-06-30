const fs = require('fs');
const path = require('path');
const express = require('express');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const moduleAlias = require('module-alias');
moduleAlias.addAlias('react-router-dom/server', path.join(__dirname, 'src', 'react-router-dom-server'));
process.env.TS_NODE_COMPILER_OPTIONS = JSON.stringify({ module: 'CommonJS' });
process.env.TS_NODE_TRANSPILE_ONLY = 'true';
require('ts-node/register');
require('tsconfig-paths/register');
require.extensions['.css'] = () => '';
require.extensions['.svg'] = () => '';
const App = require('./src/App.tsx').default;

const PORT = process.env.PORT || 3000;
const app = express();

const indexFile = path.resolve('./build/index.html');
app.use('/static', express.static(path.resolve('./build/static')));
app.use('/asset', express.static(path.resolve('./build/asset')));

app.get('*', (req, res) => {
  fs.readFile(indexFile, 'utf8', (err, htmlData) => {
    if (err) {
      return res.status(500).send('Error loading HTML file');
    }
    const appHtml = ReactDOMServer.renderToString(
      React.createElement(App, { location: req.url })
    );
    const finalHtml = htmlData.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);
    return res.send(finalHtml);
  });
});

app.listen(PORT, () => {
  console.log(`SSR running on port ${PORT}`);
});
