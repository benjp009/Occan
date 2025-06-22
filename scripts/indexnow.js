const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const HOST = 'www.logicielfrance.com';
const KEY = '82fe11e68c9c40bb9a4c55579a849434';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const SITEMAP_PATH = path.join(__dirname, '..', 'public', 'sitemap.xml');
const HASH_PATH = path.join(__dirname, '..', '.sitemap.hash');

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
  const hash = crypto.createHash('sha256').update(xml).digest('hex');
  let prevHash = null;
  if (fs.existsSync(HASH_PATH)) {
    try {
      prevHash = fs.readFileSync(HASH_PATH, 'utf8').trim();
    } catch {}
  }

  if (hash === prevHash) {
    console.log('Sitemap unchanged; skipping IndexNow submission');
    return;
  }

  const urls = extractUrls(xml);
  if (urls.length === 0) {
    console.log('No URLs found for IndexNow submission');
    return;
  }

  submit(urls).finally(() => {
    try {
      fs.writeFileSync(HASH_PATH, hash, 'utf8');
    } catch (err) {
      console.error('Failed to write sitemap hash:', err.message);
    }
  });
}

main();