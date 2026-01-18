import { BlogPost, NotionBlock } from '../types';

const NOTION_API_URL = 'https://api.notion.com/v1';
const NOTION_VERSION = '2022-06-28';

interface NotionDatabaseResponse {
  results: any[];
  next_cursor?: string;
  has_more: boolean;
}

interface NotionBlockResponse {
  results: any[];
  next_cursor?: string;
  has_more: boolean;
}

// Cette fonction sera appelée depuis le script de build
export async function getBlogPosts(): Promise<BlogPost[]> {
  const databaseId = process.env.REACT_APP_NOTION_BLOG_DATABASE_ID;
  const apiKey = process.env.REACT_APP_NOTION_API_KEY;

  if (!databaseId || !apiKey) {
    console.warn('Configuration Notion manquante');
    return [];
  }

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
          property: 'Status',
          select: {
            equals: 'Published'
          }
        },
        sorts: [
          {
            property: 'Published',
            direction: 'descending'
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`Erreur API Notion: ${response.status}`);
    }

    const data: NotionDatabaseResponse = await response.json();
    
    const posts: BlogPost[] = [];
    
    for (const page of data.results) {
      const post = await convertNotionPageToBlogPost(page);
      if (post) {
        posts.push(post);
      }
    }

    return posts;
  } catch (error) {
    console.error('Erreur lors de la récupération des articles:', error);
    return [];
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const posts = await getBlogPosts();
  return posts.find(post => post.slug === slug) || null;
}

async function convertNotionPageToBlogPost(page: any): Promise<BlogPost | null> {
  try {
    const properties = page.properties;
    
    // Extraction des propriétés de base
    const title = properties.Title?.title?.[0]?.plain_text || '';
    const slug = properties.Slug?.rich_text?.[0]?.plain_text || generateSlug(title);
    const excerpt = properties.Excerpt?.rich_text?.[0]?.plain_text || '';
    const publishedAt = properties.Published?.date?.start || new Date().toISOString();
    const updatedAt = properties.Updated?.date?.start;
    const author = properties.Author?.rich_text?.[0]?.plain_text || 'Équipe Logiciel France';
    const status = properties.Status?.select?.name?.toLowerCase() === 'published' ? 'published' as const : 'draft' as const;
    
    // Tags
    const tags = properties.Tags?.multi_select?.map((tag: any) => tag.name) || [];
    
    // Image de couverture
    const coverImage = page.cover?.file?.url || page.cover?.external?.url;
    
    // SEO
    const metaDescription = properties['Meta Description']?.rich_text?.[0]?.plain_text || excerpt;
    const keywords = properties.Keywords?.rich_text?.[0]?.plain_text?.split(',').map((k: string) => k.trim()) || [];

    // Récupération du contenu de la page
    const content = await getPageBlocks(page.id);

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

async function getPageBlocks(pageId: string): Promise<NotionBlock[]> {
  const apiKey = process.env.REACT_APP_NOTION_API_KEY;
  
  if (!apiKey) {
    return [];
  }

  try {
    let blocks: NotionBlock[] = [];
    let cursor: string | undefined;
    let hasMore = true;

    while (hasMore) {
      const url = `${NOTION_API_URL}/blocks/${pageId}/children${cursor ? `?start_cursor=${cursor}` : ''}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Notion-Version': NOTION_VERSION,
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur API Notion: ${response.status}`);
      }

      const data: NotionBlockResponse = await response.json();
      
      for (const block of data.results) {
        const convertedBlock = await convertNotionBlock(block);
        if (convertedBlock) {
          blocks.push(convertedBlock);
        }
      }

      hasMore = data.has_more;
      cursor = data.next_cursor || undefined;
    }

    return blocks;
  } catch (error) {
    console.error('Erreur lors de la récupération des blocs:', error);
    return [];
  }
}

async function convertNotionBlock(block: any): Promise<NotionBlock | null> {
  try {
    const baseBlock: NotionBlock = {
      id: block.id,
      type: block.type,
      content: block[block.type] || {},
    };

    // Traitement spécial pour les images
    if (block.type === 'image') {
      const imageUrl = block.image?.file?.url || block.image?.external?.url;
      if (imageUrl) {
        // Ici, on pourrait télécharger l'image et la sauvegarder localement
        // Pour l'instant, on garde l'URL Notion
        baseBlock.content = {
          ...baseBlock.content,
          file: { url: imageUrl }
        };
      }
    }

    // Récupération des blocs enfants si nécessaire
    if (block.has_children) {
      baseBlock.children = await getPageBlocks(block.id);
    }

    return baseBlock;
  } catch (error) {
    console.error('Erreur lors de la conversion du bloc:', error);
    return null;
  }
}

function generateSlug(title: string): string {
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

// Version statique pour le build - lit depuis les fichiers JSON générés via serveur API
// Ceci garantit que les clés API Notion ne sont jamais exposées au client
export async function getBlogPostsStatic(): Promise<BlogPost[]> {
  try {
    // Use server API endpoint instead of direct static file access
    const response = await fetch('/api/blog/posts');
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    const data = await response.json();

    // Vérifier que les données sont valides
    if (!Array.isArray(data)) {
      throw new Error('Format de données invalide');
    }

    return data;
  } catch (error) {
    console.error('Erreur lors du chargement des articles:', error);
    throw error;
  }
}

export async function getBlogPostBySlugStatic(slug: string): Promise<BlogPost | null> {
  try {
    // Use server API endpoint instead of direct static file access
    const response = await fetch(`/api/blog/posts/${encodeURIComponent(slug)}`);
    if (!response.ok) {
      if (response.status === 404) {
        return null; // Article non trouvé
      }
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    const data = await response.json();

    // Vérifier que les données sont valides
    if (!data || typeof data !== 'object') {
      throw new Error('Format de données invalide');
    }

    return data;
  } catch (error) {
    console.error('Erreur lors du chargement de l\'article:', error);
    throw error;
  }
}

// Fonctions principales - utilisent les endpoints serveur qui lisent les fichiers statiques
// Les clés API Notion ne sont jamais exposées au client
export const getBlogPostsMain = async (): Promise<BlogPost[]> => {
  return getBlogPostsStatic();
};

export const getBlogPostBySlugMain = async (slug: string): Promise<BlogPost | null> => {
  return getBlogPostBySlugStatic(slug);
};