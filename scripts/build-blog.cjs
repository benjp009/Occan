const fs = require('fs');
const path = require('path');
require('dotenv').config();
const fetch = require('node-fetch');

// Configuration Notion
const NOTION_API_URL = 'https://api.notion.com/v1';
const NOTION_VERSION = '2022-06-28';

async function fetchNotionDatabase(databaseId, apiKey) {
  try {
    const response = await fetch(`${NOTION_API_URL}/databases/${databaseId}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Notion-Version': NOTION_VERSION,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filter: {
          property: 'status',
          status: {
            equals: 'Published'
          }
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Erreur API Notion: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Erreur lors de la récupération de la base de données:', error);
    return { results: [] };
  }
}

async function fetchPageBlocks(pageId, apiKey) {
  try {
    let blocks = [];
    let cursor;
    let hasMore = true;

    while (hasMore) {
      const url = `${NOTION_API_URL}/blocks/${pageId}/children${cursor ? `?start_cursor=${cursor}` : ''}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Notion-Version': NOTION_VERSION,
        },
      });

      console.log(`Fetching blocks from: ${url}`);
      console.log(`Response status: ${response.status}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error response: ${errorText}`);
        throw new Error(`Erreur API Notion: ${response.status}`);
      }

      const data = await response.json();
      console.log('API Response:', JSON.stringify(data, null, 2));
      
      for (const block of data.results) {
        const convertedBlock = await convertNotionBlock(block, apiKey);
        if (convertedBlock) {
          blocks.push(convertedBlock);
        }
      }

      hasMore = data.has_more;
      cursor = data.next_cursor;
    }

    return blocks;
  } catch (error) {
    console.error('Erreur lors de la récupération des blocs:', error);
    return [];
  }
}

async function convertNotionBlock(block, apiKey) {
  try {
    const baseBlock = {
      id: block.id,
      type: block.type,
      content: block[block.type] || {},
    };

    // Traitement spécial pour les images
    if (block.type === 'image') {
      const imageUrl = block.image?.file?.url || block.image?.external?.url;
      if (imageUrl) {
        // Télécharger et sauvegarder l'image localement
        const localImagePath = await downloadImage(imageUrl, block.id);
        if (localImagePath) {
          baseBlock.content = {
            ...baseBlock.content,
            file: { url: localImagePath }
          };
        }
      }
    }

    // Récupération des blocs enfants si nécessaire
    if (block.has_children) {
      baseBlock.children = await fetchPageBlocks(block.id, apiKey);
    }

    return baseBlock;
  } catch (error) {
    console.error('Erreur lors de la conversion du bloc:', error);
    return null;
  }
}

async function downloadImage(imageUrl, blockId) {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) return null;

    const buffer = await response.arrayBuffer();
    const extension = imageUrl.split('.').pop()?.split('?')[0] || 'jpg';
    const filename = `${blockId}.${extension}`;
    const localPath = `/posts/images/${filename}`;
    const fullPath = path.join(__dirname, '../public', localPath);

    // Créer le dossier s'il n'existe pas
    const dir = path.dirname(fullPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(fullPath, Buffer.from(buffer));
    console.log(`Image téléchargée: ${localPath}`);
    
    return localPath;
  } catch (error) {
    console.error('Erreur lors du téléchargement de l\'image:', error);
    return null;
  }
}

function generateSlug(title) {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Supprime les accents
    .replace(/[^a-z0-9\s-]/g, '') // Garde seulement lettres, chiffres, espaces et tirets
    .replace(/\s+/g, '-') // Remplace les espaces par des tirets
    .replace(/-+/g, '-') // Supprime les tirets multiples
    .trim()
    .replace(/^-+|-+$/g, ''); // Supprime les tirets en début/fin
}

async function convertNotionPageToBlogPost(page, apiKey) {
  try {
    const properties = page.properties;
    
    // Extraction des propriétés de base
    const title = properties.title?.title?.[0]?.plain_text || '';
    const slug = properties.slug?.rich_text?.[0]?.plain_text || generateSlug(title);
    const excerpt = properties.excerpt?.rich_text?.[0]?.plain_text || '';
    const publishedAt = properties.publishedAt?.date?.start || new Date().toISOString();
    const updatedAt = properties.updatedAt?.date?.start;
    const author = properties.author?.rich_text?.[0]?.plain_text || 'Équipe Logiciel France';
    const status = properties.status?.status?.name?.toLowerCase() === 'published' ? 'published' : 'draft';
    
    // Tags
    const tags = properties.tags?.multi_select?.map(tag => tag.name) || [];
    
    // Image de couverture
    let coverImage = properties.coverImage?.files?.[0]?.file?.url || properties.coverImage?.files?.[0]?.external?.url;
    if (coverImage) {
      // Télécharger l'image de couverture
      const localCoverPath = await downloadImage(coverImage, `cover-${page.id}`);
      if (localCoverPath) {
        coverImage = localCoverPath;
      }
    }
    
    // SEO
    const metaDescription = properties.seo_metaDescription?.rich_text?.[0]?.plain_text || excerpt;
    const keywords = properties.seo_keywords?.rich_text?.[0]?.plain_text?.split(',').map(k => k.trim()) || [];

    // Récupération du contenu depuis la propriété ou les blocs de page
    let content = [];
    
    // D'abord essayer de récupérer depuis la propriété content
    if (properties.content?.rich_text) {
      content = properties.content.rich_text.map(text => ({
        type: 'paragraph',
        content: { rich_text: [text] }
      }));
      console.log('Content récupéré depuis la propriété:', content.length, 'blocs');
    } else {
      // Sinon récupérer depuis les blocs de page
      console.log('Fetching blocks for page:', page.id);
      content = await fetchPageBlocks(page.id, apiKey);
      console.log('Content blocks retrieved:', content.length);
    }

    return {
      id: page.id,
      title,
      slug,
      excerpt,
      content,
      publishedAt,
      updatedAt,
      author,
      tags,
      coverImage,
      status,
      seo: {
        metaDescription,
        keywords
      }
    };
  } catch (error) {
    console.error('Erreur lors de la conversion de la page Notion:', error);
    return null;
  }
}

function loadExistingPosts() {
  const publicDir = path.join(__dirname, '../public');
  const existingPostsFile = path.join(publicDir, 'blog-posts.json');
  
  if (fs.existsSync(existingPostsFile)) {
    try {
      const existingData = fs.readFileSync(existingPostsFile, 'utf8');
      return JSON.parse(existingData);
    } catch (error) {
      console.warn('Erreur lors du chargement des articles existants:', error);
      return [];
    }
  }
  return [];
}

function shouldUpdatePost(notionPost, existingPost) {
  if (!existingPost) {
    return true; // Nouvel article
  }
  
  // Si on n'a pas de date updatedAt dans Notion, on skip si l'article existe déjà
  if (!notionPost.updatedAt && !notionPost.publishedAt) {
    return false;
  }
  
  // Comparer les dates updatedAt (ou publishedAt si updatedAt n'existe pas)
  const notionDate = notionPost.updatedAt || notionPost.publishedAt;
  const existingDate = existingPost.updatedAt || existingPost.publishedAt;
  
  if (!notionDate || !existingDate) {
    return false; // Si on ne peut pas comparer, on considère que c'est inchangé
  }
  
  const notionUpdatedAt = new Date(notionDate);
  const existingUpdatedAt = new Date(existingDate);
  
  return notionUpdatedAt > existingUpdatedAt;
}

async function buildBlog() {
  const databaseId = process.env.NOTION_BLOG_DATABASE_ID;
  const apiKey = process.env.NOTION_API_KEY;

  if (!databaseId || !apiKey) {
    console.warn('Configuration Notion manquante - génération du blog ignorée');
    return;
  }

  console.log('🚀 Génération du blog depuis Notion (articles publiés uniquement)...');

  try {
    // Charger les articles existants
    const existingPosts = loadExistingPosts();
    const existingPostsMap = new Map();
    existingPosts.forEach(post => {
      existingPostsMap.set(post.id, post);
    });

    // Récupération des pages publiées depuis Notion
    const database = await fetchNotionDatabase(databaseId, apiKey);
    const posts = [];
    let updatedCount = 0;
    let skippedCount = 0;

    console.log(`📄 ${database.results.length} articles publiés trouvés dans Notion`);

    for (const page of database.results) {
      const title = page.properties.title?.title?.[0]?.plain_text;
      const status = page.properties.status?.status?.name;
      const existingPost = existingPostsMap.get(page.id);
      
      // Vérification rapide de la date updatedAt depuis Notion
      const notionUpdatedAt = page.properties.updatedAt?.date?.start;
      const notionPublishedAt = page.properties.publishedAt?.date?.start;
      
      if (existingPost) {
        const shouldUpdate = shouldUpdatePost({ 
          updatedAt: notionUpdatedAt, 
          publishedAt: notionPublishedAt 
        }, existingPost);
        
        if (!shouldUpdate) {
          console.log(`⏭️  Article inchangé: ${title} - utilisation de la version existante`);
          posts.push(existingPost);
          skippedCount++;
          continue;
        }
      }
      
      console.log(`🔄 Traitement de l'article: ${title} (${status})`);
      const post = await convertNotionPageToBlogPost(page, apiKey);
      if (post) {
        posts.push(post);
        updatedCount++;
      }
    }

    // Sauvegarde de la liste des articles
    const publicDir = path.join(__dirname, '../public');
    fs.writeFileSync(
      path.join(publicDir, 'blog-posts.json'),
      JSON.stringify(posts, null, 2)
    );

    // Sauvegarde de chaque article individuellement (seulement les nouveaux/modifiés)
    const postsDir = path.join(publicDir, 'posts');
    if (!fs.existsSync(postsDir)) {
      fs.mkdirSync(postsDir, { recursive: true });
    }

    // Sauvegarder seulement les articles mis à jour
    const updatedPosts = posts.filter(post => {
      const existingPost = existingPostsMap.get(post.id);
      return !existingPost || shouldUpdatePost(post, existingPost);
    });

    for (const post of updatedPosts) {
      fs.writeFileSync(
        path.join(postsDir, `${post.slug}.json`),
        JSON.stringify(post, null, 2)
      );
    }

    console.log(`✅ ${posts.length} articles traités au total`);
    console.log(`🔄 ${updatedCount} articles mis à jour`);
    console.log(`⏭️  ${skippedCount} articles inchangés`);
  } catch (error) {
    console.error('❌ Erreur lors de la génération du blog:', error);
    process.exit(1);
  }
}

// Exécution si appelé directement
if (require.main === module) {
  buildBlog();
}

module.exports = { buildBlog };