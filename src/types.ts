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
}

export interface CategoryRow {
  id: string;           
  icon: string;         
  name: string;    
  description: string; 
  count: string;        
}