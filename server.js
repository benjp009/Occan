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

const PORT = process.env.PORT || 3000;
const app = express();

const indexFile = path.resolve('./build/index.html');
app.use(express.static(path.resolve('./build')));
app.use('/static', express.static(path.resolve('./build/static')));
app.use('/asset', express.static(path.resolve('./build/asset')));

app.get('*', (req, res) => {
  fs.readFile(indexFile, 'utf8', (err, htmlData) => {
    if (err) {
      return res.status(500).send('Error loading HTML file');
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
    const finalHtml = htmlData.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);
    const helmetString = helmet ? `${helmet.title.toString()}${helmet.meta.toString()}${helmet.link.toString()}` : '';
    const htmlWithHelmet = finalHtml.replace('</head>', `${helmetString}</head>`);
    return res.send(htmlWithHelmet);
  });
});

app.listen(PORT, () => {
  console.log(`SSR running on port ${PORT}`);
});