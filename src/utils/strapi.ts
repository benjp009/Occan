/**
 * Strapi CMS API Client
 * Fetches data from Strapi and transforms it to match existing interfaces
 */

import { CompanyRow, CategoryRow, BlogPost, NotionBlock } from '../types';

// Strapi API configuration
const STRAPI_URL = process.env.REACT_APP_STRAPI_URL || 'http://localhost:1337';
const STRAPI_TOKEN = process.env.REACT_APP_STRAPI_TOKEN;

// In-memory cache for API responses
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const cache: Map<string, CacheEntry<unknown>> = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (entry && Date.now() - entry.timestamp < CACHE_TTL) {
    return entry.data as T;
  }
  return null;
}

function setCache<T>(key: string, data: T): void {
  cache.set(key, { data, timestamp: Date.now() });
}

// Strapi response types
interface StrapiResponse<T> {
  data: T[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

interface StrapiSoftware {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  description: string;
  long_content: string;
  website: string;
  email: string;
  phone: string;
  siret: string;
  pappers: string;
  revenue2023: string;
  keywords: string;
  referral: string;
  hq_address: string;
  hq_zip: string;
  hq_city: string;
  hq_country: string;
  description_1: string;
  description_2: string;
  description_3: string;
  meta_description: string;
  month_choice: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  logo?: StrapiMedia;
  assets?: StrapiMedia[];
  categories?: StrapiCategory[];
  company?: StrapiCompany;
}

interface StrapiCategory {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  description: string;
  long_description: string;
  meta_description: string;
  icon?: StrapiMedia;
}

interface StrapiArticle {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string; // HTML content
  tags: string[];
  order: number;
  seo_description: string;
  seo_keywords: string[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  cover_image?: StrapiMedia;
  author?: { username: string };
  review_status?: 'draft' | 'need_review' | 'approved';
  reviewer?: { username: string };
  reviewed_at?: string;
  review_notes?: string;
}

interface StrapiCompany {
  id: number;
  documentId: string;
  siren: string;
  name: string;
  legal_name: string;
  address: string;
  postal_code: string;
  city: string;
  country: string;
  creation_date: string;
  status: string;
}

interface StrapiMedia {
  id: number;
  url: string;
  formats?: {
    thumbnail?: { url: string };
    small?: { url: string };
    medium?: { url: string };
    large?: { url: string };
  };
}

// Helper function to build headers
function getHeaders(): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (STRAPI_TOKEN) {
    headers['Authorization'] = `Bearer ${STRAPI_TOKEN}`;
  }
  return headers;
}

// Helper function to get full media URL
function getMediaUrl(media?: StrapiMedia): string {
  if (!media) return '';
  const url = media.url;
  // If URL is relative, prepend Strapi URL
  if (url.startsWith('/')) {
    return `${STRAPI_URL}${url}`;
  }
  return url;
}

/**
 * Transform Strapi software to CompanyRow format
 */
function transformSoftwareToCompanyRow(software: StrapiSoftware): CompanyRow {
  const categoryNames = software.categories?.map(c => c.name).join(', ') || '';

  return {
    id: software.documentId || String(software.id),
    month_choice: software.month_choice ? 'true' : undefined,
    date_added: software.createdAt,
    date_updated: software.updatedAt,
    date_deleted: '',
    name: software.name,
    description: software.description || '',
    website: software.website || '',
    email: software.email || '',
    phone: software.phone || '',
    siret: software.siret || '',
    pappers: software.pappers || '',
    revenue2023: software.revenue2023 || '',
    categories: categoryNames,
    keywords: software.keywords || '',
    referral: software.referral || '',
    logo: getMediaUrl(software.logo),
    hq_address: software.hq_address || '',
    hq_zip: software.hq_zip || '',
    hq_city: software.hq_city || '',
    hq_country: software.hq_country || 'France',
    long_content: software.long_content || '',
    description_1: software.description_1 || '',
    description_2: software.description_2 || '',
    description_3: software.description_3 || '',
    asset_1: software.assets?.[0] ? getMediaUrl(software.assets[0]) : '',
    asset_2: software.assets?.[1] ? getMediaUrl(software.assets[1]) : '',
    asset_3: software.assets?.[2] ? getMediaUrl(software.assets[2]) : '',
    meta_description: software.meta_description || '',
  };
}

/**
 * Transform Strapi category to CategoryRow format
 */
function transformCategoryToCategoryRow(category: StrapiCategory, softwareCount: number): CategoryRow {
  return {
    id: category.documentId || String(category.id),
    icon: getMediaUrl(category.icon),
    name: category.name,
    description: category.description || '',
    long_description: category.long_description || '',
    meta_description: category.meta_description || '',
    count: String(softwareCount),
  };
}

/**
 * Transform Strapi article to BlogPost format
 */
function transformArticleToBlogPost(article: StrapiArticle): BlogPost {
  // Convert HTML content to NotionBlock format for compatibility
  const contentBlocks: NotionBlock[] = [{
    id: 'html-content',
    type: 'html',
    content: { html: article.content },
  }];

  // Map review_status to BlogPost status
  // published: article is live (publishedAt is set)
  // need review: article is pending review (review_status === 'need_review')
  // draft: everything else
  let status: 'draft' | 'need review' | 'published' = 'draft';
  if (article.publishedAt) {
    status = 'published';
  } else if (article.review_status === 'need_review') {
    status = 'need review';
  }

  return {
    id: article.documentId || String(article.id),
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt || '',
    content: contentBlocks,
    publishedAt: article.publishedAt || article.createdAt,
    updatedAt: article.updatedAt,
    author: article.author?.username || 'Logiciel France',
    tags: article.tags || [],
    coverImage: getMediaUrl(article.cover_image),
    status,
    seo: {
      metaDescription: article.seo_description || article.excerpt || '',
      keywords: article.seo_keywords || [],
    },
  };
}

/**
 * Fetch all software from Strapi
 */
export async function fetchSoftwares(): Promise<CompanyRow[]> {
  const cached = getCached<CompanyRow[]>('softwares');
  if (cached) return cached;

  try {
    const response = await fetch(
      `${STRAPI_URL}/api/softwares?populate[0]=logo&populate[1]=assets&populate[2]=categories&pagination[pageSize]=200`,
      { headers: getHeaders() }
    );

    if (!response.ok) {
      throw new Error(`Strapi API error: ${response.status}`);
    }

    const result: StrapiResponse<StrapiSoftware> = await response.json();
    const softwares = result.data.map(transformSoftwareToCompanyRow);

    setCache('softwares', softwares);
    return softwares;
  } catch (error) {
    console.error('Failed to fetch softwares from Strapi:', error);
    return [];
  }
}

/**
 * Fetch single software by slug
 */
export async function fetchSoftwareBySlug(slug: string): Promise<CompanyRow | null> {
  try {
    const response = await fetch(
      `${STRAPI_URL}/api/softwares?filters[slug][$eq]=${encodeURIComponent(slug)}&populate[0]=logo&populate[1]=assets&populate[2]=categories`,
      { headers: getHeaders() }
    );

    if (!response.ok) {
      throw new Error(`Strapi API error: ${response.status}`);
    }

    const result: StrapiResponse<StrapiSoftware> = await response.json();
    if (result.data.length === 0) return null;

    return transformSoftwareToCompanyRow(result.data[0]);
  } catch (error) {
    console.error('Failed to fetch software by slug:', error);
    return null;
  }
}

/**
 * Fetch all categories from Strapi
 */
export async function fetchCategoriesFromStrapi(): Promise<CategoryRow[]> {
  const cached = getCached<CategoryRow[]>('categories');
  if (cached) return cached;

  try {
    // Fetch categories with their software count
    const response = await fetch(
      `${STRAPI_URL}/api/categories?populate[0]=icon&populate[1]=softwares&pagination[pageSize]=100`,
      { headers: getHeaders() }
    );

    if (!response.ok) {
      throw new Error(`Strapi API error: ${response.status}`);
    }

    const result: StrapiResponse<StrapiCategory & { softwares?: any[] }> = await response.json();
    const categories = result.data.map(cat =>
      transformCategoryToCategoryRow(cat, cat.softwares?.length || 0)
    );

    setCache('categories', categories);
    return categories;
  } catch (error) {
    console.error('Failed to fetch categories from Strapi:', error);
    return [];
  }
}

/**
 * Fetch category by slug with its software
 */
export async function fetchCategoryBySlug(slug: string): Promise<CategoryRow | null> {
  try {
    const response = await fetch(
      `${STRAPI_URL}/api/categories?filters[slug][$eq]=${encodeURIComponent(slug)}&populate[0]=icon&populate[1]=softwares`,
      { headers: getHeaders() }
    );

    if (!response.ok) {
      throw new Error(`Strapi API error: ${response.status}`);
    }

    const result: StrapiResponse<StrapiCategory & { softwares?: any[] }> = await response.json();
    if (result.data.length === 0) return null;

    const cat = result.data[0];
    return transformCategoryToCategoryRow(cat, cat.softwares?.length || 0);
  } catch (error) {
    console.error('Failed to fetch category by slug:', error);
    return null;
  }
}

/**
 * Fetch all published articles from Strapi
 */
export async function fetchArticles(): Promise<BlogPost[]> {
  const cached = getCached<BlogPost[]>('articles');
  if (cached) return cached;

  try {
    const response = await fetch(
      `${STRAPI_URL}/api/articles?populate[0]=cover_image&populate[1]=author&sort=order:asc&pagination[pageSize]=100`,
      { headers: getHeaders() }
    );

    if (!response.ok) {
      throw new Error(`Strapi API error: ${response.status}`);
    }

    const result: StrapiResponse<StrapiArticle> = await response.json();
    const articles = result.data.map(transformArticleToBlogPost);

    setCache('articles', articles);
    return articles;
  } catch (error) {
    console.error('Failed to fetch articles from Strapi:', error);
    return [];
  }
}

/**
 * Fetch all articles including drafts (requires auth)
 */
export async function fetchAllArticles(): Promise<BlogPost[]> {
  try {
    const response = await fetch(
      `${STRAPI_URL}/api/articles?status=draft&populate[0]=cover_image&populate[1]=author&sort=order:asc&pagination[pageSize]=100`,
      { headers: getHeaders() }
    );

    if (!response.ok) {
      throw new Error(`Strapi API error: ${response.status}`);
    }

    const result: StrapiResponse<StrapiArticle> = await response.json();
    return result.data.map(transformArticleToBlogPost);
  } catch (error) {
    console.error('Failed to fetch all articles from Strapi:', error);
    return [];
  }
}

/**
 * Fetch single article by slug
 */
export async function fetchArticleBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const response = await fetch(
      `${STRAPI_URL}/api/articles?filters[slug][$eq]=${encodeURIComponent(slug)}&populate[0]=cover_image&populate[1]=author`,
      { headers: getHeaders() }
    );

    if (!response.ok) {
      throw new Error(`Strapi API error: ${response.status}`);
    }

    const result: StrapiResponse<StrapiArticle> = await response.json();
    if (result.data.length === 0) return null;

    return transformArticleToBlogPost(result.data[0]);
  } catch (error) {
    console.error('Failed to fetch article by slug:', error);
    return null;
  }
}

/**
 * Fetch software by month choice flag
 */
export async function fetchMonthlySelectionFromStrapi(): Promise<CompanyRow[]> {
  try {
    const response = await fetch(
      `${STRAPI_URL}/api/softwares?filters[month_choice][$eq]=true&populate[0]=logo&populate[1]=assets&populate[2]=categories`,
      { headers: getHeaders() }
    );

    if (!response.ok) {
      throw new Error(`Strapi API error: ${response.status}`);
    }

    const result: StrapiResponse<StrapiSoftware> = await response.json();
    return result.data.map(transformSoftwareToCompanyRow);
  } catch (error) {
    console.error('Failed to fetch monthly selection from Strapi:', error);
    return [];
  }
}

/**
 * Submit article for review (author action)
 */
export async function submitArticleForReview(articleId: string): Promise<BlogPost | null> {
  try {
    const response = await fetch(
      `${STRAPI_URL}/api/articles/${articleId}/submit-for-review`,
      {
        method: 'POST',
        headers: getHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error(`Strapi API error: ${response.status}`);
    }

    const result: { data: StrapiArticle } = await response.json();
    return transformArticleToBlogPost(result.data);
  } catch (error) {
    console.error('Failed to submit article for review:', error);
    return null;
  }
}

/**
 * Approve article (editor action)
 */
export async function approveArticle(articleId: string, notes?: string): Promise<BlogPost | null> {
  try {
    const response = await fetch(
      `${STRAPI_URL}/api/articles/${articleId}/approve`,
      {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ notes }),
      }
    );

    if (!response.ok) {
      throw new Error(`Strapi API error: ${response.status}`);
    }

    const result: { data: StrapiArticle } = await response.json();
    return transformArticleToBlogPost(result.data);
  } catch (error) {
    console.error('Failed to approve article:', error);
    return null;
  }
}

/**
 * Request changes on article (editor action)
 */
export async function requestArticleChanges(articleId: string, notes: string): Promise<BlogPost | null> {
  try {
    const response = await fetch(
      `${STRAPI_URL}/api/articles/${articleId}/request-changes`,
      {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ notes }),
      }
    );

    if (!response.ok) {
      throw new Error(`Strapi API error: ${response.status}`);
    }

    const result: { data: StrapiArticle } = await response.json();
    return transformArticleToBlogPost(result.data);
  } catch (error) {
    console.error('Failed to request article changes:', error);
    return null;
  }
}

/**
 * Fetch articles pending review (editor view)
 */
export async function fetchArticlesPendingReview(): Promise<BlogPost[]> {
  try {
    const response = await fetch(
      `${STRAPI_URL}/api/articles/pending-review`,
      { headers: getHeaders() }
    );

    if (!response.ok) {
      throw new Error(`Strapi API error: ${response.status}`);
    }

    const result: { data: StrapiArticle[] } = await response.json();
    return result.data.map(transformArticleToBlogPost);
  } catch (error) {
    console.error('Failed to fetch articles pending review:', error);
    return [];
  }
}

// Export aliases for backward compatibility
export const fetchCompanies = fetchSoftwares;
export const fetchCategories = fetchCategoriesFromStrapi;
export const getBlogPosts = fetchArticles;
export const getBlogPostBySlug = fetchArticleBySlug;
