const fs = require('fs');
const path = require('path');
const { Client } = require('@notionhq/client');

// Configuration
const NOTION_TOKEN = process.env.NOTION_TOKEN;
const DATABASE_ID = process.env.NOTION_DATABASE_ID;
const POSTS_DIR = path.join(__dirname, '../public/posts');

if (!NOTION_TOKEN || !DATABASE_ID) {
  console.error('❌ Variables d\'environnement manquantes: NOTION_TOKEN et NOTION_DATABASE_ID requis');
  process.exit(1);
}

const notion = new Client({ auth: NOTION_TOKEN });

// Fonction pour nettoyer le texte
function cleanText(text) {
  return text.replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').toLowerCase();
}

// Fonction pour convertir les blocs Notion en contenu
function parseNotionBlocks(blocks) {
  let content = '';
  
  blocks.forEach(block => {
    switch (block.type) {
      case 'paragraph':
        if (block.paragraph.rich_text.length > 0) {
          content += block.paragraph.rich_text.map(text => text.plain_text).join('') + '\n\n';
        }
        break;
      case 'heading_1':
        content += '# ' + block.heading_1.rich_text.map(text => text.plain_text).join('') + '\n\n';
        break;
      case 'heading_2':
        content += '## ' + block.heading_2.rich_text.map(text => text.plain_text).join('') + '\n\n';
        break;
      case 'heading_3':
        content += '### ' + block.heading_3.rich_text.map(text => text.plain_text).join('') + '\n\n';
        break;
      case 'bulleted_list_item':
        content += '- ' + block.bulleted_list_item.rich_text.map(text => text.plain_text).join('') + '\n';
        break;
      case 'numbered_list_item':
        content += '1. ' + block.numbered_list_item.rich_text.map(text => text.plain_text).join('') + '\n';
        break;
      case 'code':
        content += '```\n' + block.code.rich_text.map(text => text.plain_text).join('') + '\n```\n\n';
        break;
      case 'quote':
        content += '> ' + block.quote.rich_text.map(text => text.plain_text).join('') + '\n\n';
        break;
    }
  });
  
  return content;
}

async function syncNotionContent() {
  try {
    console.log('🔄 Synchronisation du contenu Notion...');
    
    // Récupérer les articles publiés de la base Notion
    const response = await notion.databases.query({
      database_id: DATABASE_ID,
      filter: {
        property: 'Status',
        select: {
          equals: 'Publié'
        }
      },
      sorts: [
        {
          property: 'Date de publication',
          direction: 'descending'
        }
      ]
    });

    console.log(`📄 ${response.results.length} articles trouvés dans Notion`);

    for (const page of response.results) {
      const properties = page.properties;
      
      // Extraire les propriétés
      const title = properties.Titre?.title?.[0]?.plain_text || 'Sans titre';
      const slug = properties.Slug?.rich_text?.[0]?.plain_text || cleanText(title);
      const excerpt = properties.Extrait?.rich_text?.[0]?.plain_text || '';
      const publishDate = properties['Date de publication']?.date?.start || new Date().toISOString().split('T')[0];
      const author = properties.Auteur?.people?.[0]?.name || 'Équipe Logiciel France';
      const category = properties.Catégorie?.select?.name || 'Non catégorisé';
      const tags = properties.Tags?.multi_select?.map(tag => tag.name) || [];
      const coverImage = properties['Image de couverture']?.files?.[0]?.file?.url || properties['Image de couverture']?.files?.[0]?.external?.url || '';
      
      // Récupérer le contenu de la page
      const blocksResponse = await notion.blocks.children.list({
        block_id: page.id
      });
      
      const content = parseNotionBlocks(blocksResponse.results);
      
      // Créer l'objet article
      const article = {
        id: page.id,
        title,
        slug,
        excerpt,
        content,
        publishDate,
        author,
        category,
        tags,
        coverImage,
        lastModified: page.last_edited_time
      };
      
      // Sauvegarder en JSON
      const filename = `${slug}.json`;
      const filepath = path.join(POSTS_DIR, filename);
      
      fs.writeFileSync(filepath, JSON.stringify(article, null, 2), 'utf8');
      console.log(`✅ Article sauvegardé: ${filename}`);
    }
    
    console.log('🎉 Synchronisation terminée avec succès!');
    
  } catch (error) {
    console.error('❌ Erreur lors de la synchronisation:', error.message);
    process.exit(1);
  }
}

// Créer le dossier posts s'il n'existe pas
if (!fs.existsSync(POSTS_DIR)) {
  fs.mkdirSync(POSTS_DIR, { recursive: true });
}

syncNotionContent();