const fs = require('fs');
const path = require('path');
const express = require('express');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
require('ts-node/register');
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