import { filterCompanies } from './search';
import { CompanyRow } from '../types';

const data: CompanyRow[] = [
  {
    id: '1',
    date_added: '',
    date_updated: '',
    date_deleted: '',
    name: 'Alpha Tool',
    description: '',
    website: '',
    email: '',
    phone: '',
    siret: '',
    revenue2023: '',
    categories: 'Finance, SaaS',
    keywords: 'alpha, accounts',
    referral: '',
    logo: '',
    hq_address: '',
    hq_zip: '',
    hq_city: '',
    hq_country: '',
  },
  {
    id: '2',
    date_added: '',
    date_updated: '',
    date_deleted: '',
    name: 'Beta CRM',
    description: '',
    website: '',
    email: '',
    phone: '',
    siret: '',
    revenue2023: '',
    categories: 'CRM, Management',
    keywords: 'crm, sales',
    referral: '',
    logo: '',
    hq_address: '',
    hq_zip: '',
    hq_city: '',
    hq_country: '',
  },
];

describe('filterCompanies', () => {
  it('returns all data when query is empty', () => {
    expect(filterCompanies('', data)).toEqual(data);
  });

  it('matches company name', () => {
    const result = filterCompanies('alpha', data);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Alpha Tool');
  });

  it('matches category or keyword', () => {
    expect(filterCompanies('crm', data)).toEqual([data[1]]);
    expect(filterCompanies('sales', data)).toEqual([data[1]]);
  });
});
