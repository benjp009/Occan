const fs = require('fs');
const path = require('path');

const HOST = 'www.logicielfrance.com';
const KEY = '82fe11e68c9c40bb9a4c55579a849434';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const SITEMAP_PATH = path.join(__dirname, '..', 'public', 'sitemap.xml');

function extractUrls(xml) {
  const regex = /<loc>([^<]+)<\/loc>/g;
  const urls = [];
  let match;
  while ((match = regex.exec(xml)) !== null) {
    urls.push(match[1]);
  }
  return urls;
}

async function submit(urls) {
  const payload = {
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList: urls,
  };

  try {
    const res = await fetch('https://api.indexnow.org/IndexNow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(payload),
    });
    const text = await res.text();
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} ${text}`);
    }
    console.log('IndexNow submission successful');
    console.log(text);
  } catch (err) {
    console.error('IndexNow submission failed:', err.message);
  }
}

function main() {
  if (!fs.existsSync(SITEMAP_PATH)) {
    console.error('Sitemap not found at', SITEMAP_PATH);
    return;
  }

  const xml = fs.readFileSync(SITEMAP_PATH, 'utf8');
  const urls = extractUrls(xml);
  if (urls.length === 0) {
    console.log('No URLs found for IndexNow submission');
    return;
  }
  submit(urls);
}

main();