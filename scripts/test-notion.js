const { Client } = require('@notionhq/client');

// Configuration
const NOTION_TOKEN = process.env.NOTION_TOKEN;
const DATABASE_ID = process.env.NOTION_DATABASE_ID;

if (!NOTION_TOKEN || !DATABASE_ID) {
  console.error('❌ Variables d\'environnement manquantes:');
  console.error('   NOTION_TOKEN:', NOTION_TOKEN ? '✅ Configuré' : '❌ Manquant');
  console.error('   NOTION_DATABASE_ID:', DATABASE_ID ? '✅ Configuré' : '❌ Manquant');
  console.log('\n💡 Pour configurer:');
  console.log('   export NOTION_TOKEN="secret_..."');
  console.log('   export NOTION_DATABASE_ID="..."');
  process.exit(1);
}

const notion = new Client({ auth: NOTION_TOKEN });

async function testNotionConnection() {
  try {
    console.log('🔄 Test de connexion à Notion...');
    
    // Test 1: Vérifier l'accès à la base
    console.log('\n📋 Test d\'accès à la base de données...');
    const database = await notion.databases.retrieve({
      database_id: DATABASE_ID
    });
    
    console.log('✅ Base de données trouvée:', database.title[0]?.plain_text || 'Sans titre');
    
    // Test 2: Lister les propriétés
    console.log('\n🏷️ Propriétés de la base:');
    Object.entries(database.properties).forEach(([name, prop]) => {
      console.log(`   - ${name}: ${prop.type}`);
    });
    
    // Test 3: Récupérer quelques articles
    console.log('\n📄 Test de récupération des articles...');
    const response = await notion.databases.query({
      database_id: DATABASE_ID,
      page_size: 3
    });
    
    console.log(`✅ ${response.results.length} articles trouvés`);
    
    // Afficher les détails des articles
    response.results.forEach((page, index) => {
      const props = page.properties;
      const title = props.Titre?.title?.[0]?.plain_text || 'Sans titre';
      const status = props.Status?.select?.name || 'Pas de status';
      
      console.log(`   ${index + 1}. "${title}" - Status: ${status}`);
    });
    
    // Test 4: Vérifier les propriétés requises
    console.log('\n🔍 Vérification des propriétés requises...');
    const requiredProps = ['Titre', 'Slug', 'Status', 'Date de publication', 'Extrait'];
    const missingProps = requiredProps.filter(prop => !database.properties[prop]);
    
    if (missingProps.length > 0) {
      console.log('⚠️ Propriétés manquantes:', missingProps.join(', '));
      console.log('💡 Veuillez ajouter ces colonnes dans votre base Notion');
    } else {
      console.log('✅ Toutes les propriétés requises sont présentes');
    }
    
    console.log('\n🎉 Test de connexion réussi!');
    console.log('\n🚀 Prochaines étapes:');
    console.log('   1. Ajouter les secrets dans GitHub: Settings → Secrets and variables → Actions');
    console.log('   2. Tester la synchronisation: npm run sync-notion');
    console.log('   3. Déclencher depuis Notion avec un webhook ou manuellement');
    
  } catch (error) {
    console.error('\n❌ Erreur lors du test:', error.message);
    
    if (error.code === 'unauthorized') {
      console.log('\n💡 Solutions possibles:');
      console.log('   - Vérifiez que le token Notion est correct');
      console.log('   - Assurez-vous que l\'intégration a accès à la base');
      console.log('   - Partagez la base avec votre intégration Notion');
    } else if (error.code === 'object_not_found') {
      console.log('\n💡 Solutions possibles:');
      console.log('   - Vérifiez que l\'ID de la base est correct');
      console.log('   - Assurez-vous que la base existe et est accessible');
    }
    
    process.exit(1);
  }
}

testNotionConnection();