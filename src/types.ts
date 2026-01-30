export interface CompanyRow {
  id: string;
  month_choice?: string;
  date_added : string;
  date_updated : string;
  date_deleted : string;
  name: string;
  description: string;
  website: string;
  email: string;
  phone: string;
  siret: string;
  pappers?: string;
  revenue2023: string;
  categories: string; // comma-separated
  keywords: string;   // comma-separated
  referral: string;
  logo: string;
  hq_address: string;
  hq_zip: string;
  hq_city: string;
  hq_country: string;
  long_content: string;
  description_1: string;
  description_2: string;
  description_3: string;
  asset_1: string;
  asset_2: string;
  asset_3: string;
  meta_description?: string;
}

export interface CategoryRow {
  id: string;           
  icon: string;         
  name: string;    
  description: string; 
  long_description?: string;
  meta_description?: string;
  count: string;        
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: NotionBlock[];
  publishedAt: string;
  updatedAt?: string;
  author: string;
  tags: string[];
  coverImage?: string;
  status: 'draft' | 'need review' | 'published';
  seo: {
    metaDescription: string;
    keywords: string[];
  };
}

export interface NotionBlock {
  id: string;
  type: string;
  content?: any;
  children?: NotionBlock[];
}

export interface CompetitorRow {
  competitor_name: string;
  slug: string;
  categories: string; // comma-separated
  description: string;
}

export interface UseCaseRow {
  usecase_name: string;
  slug: string;
  categories: string; // comma-separated
  description: string;
}

export interface GlossaryRow {
  slug: string;
  term_name: string;
  title: string;
  meta_description: string;
  keywords: string;
  short_definition: string;
  long_definition: string;
  how_it_works: string;
  advantages: string; // pipe-separated
  faq_1_question: string;
  faq_1_answer: string;
  faq_2_question: string;
  faq_2_answer: string;
  faq_3_question: string;
  faq_3_answer: string;
  related_categories: string; // comma-separated
  related_terms: string; // comma-separated slugs
  status: string;
}

export interface SponsorRow {
  id: string;
  name: string;
  logo: string;
  tagline: string;
  url: string;
  active: string; // "true" or "false" from CSV
  border_color?: string; // optional hex color for border
  bg_color?: string; // optional hex color for background
}