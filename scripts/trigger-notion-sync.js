// Script pour déclencher la synchronisation depuis une URL webhook
// Utilisable avec Notion Automations ou Zapier

const https = require('https');

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_OWNER = process.env.REPO_OWNER || 'benjp009'; // Remplacer par votre nom d'utilisateur
const REPO_NAME = process.env.REPO_NAME || 'development'; // Remplacer par le nom de votre repo

function triggerSync(eventType = 'notion-publish') {
  const data = JSON.stringify({
    event_type: eventType,
    client_payload: {
      timestamp: new Date().toISOString(),
      source: 'notion-webhook'
    }
  });

  const options = {
    hostname: 'api.github.com',
    port: 443,
    path: `/repos/${REPO_OWNER}/${REPO_NAME}/dispatches`,
    method: 'POST',
    headers: {
      'Authorization': `token ${GITHUB_TOKEN}`,
      'Content-Type': 'application/json',
      'Content-Length': data.length,
      'User-Agent': 'Notion-Sync-Bot'
    }
  };

  const req = https.request(options, (res) => {
    console.log(`Status: ${res.statusCode}`);
    console.log(`Headers: ${JSON.stringify(res.headers)}`);
    
    if (res.statusCode === 204) {
      console.log('✅ Synchronisation déclenchée avec succès!');
    } else {
      console.log('❌ Erreur lors du déclenchement');
    }
  });

  req.on('error', (e) => {
    console.error(`Erreur: ${e.message}`);
  });

  req.write(data);
  req.end();
}

// Vérifier les variables d'environnement
if (!GITHUB_TOKEN) {
  console.error('❌ GITHUB_TOKEN requis');
  process.exit(1);
}

// Déclencher la synchronisation
triggerSync();

module.exports = { triggerSync };