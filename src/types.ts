export interface CompanyRow {
  id: string;
  date_added : string;
  date_updated : string;
  date_deleted : string;
  name: string;
  description: string;
  website: string;
  email: string;
  phone: string;
  siret: string;
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
  asset_1: string;
  asset_2: string;
  asset_3: string;
}

export interface CategoryRow {
  id: string;           
  icon: string;         
  name: string;    
  description: string; 
  count: string;        
}