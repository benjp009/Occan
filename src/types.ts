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