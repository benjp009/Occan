import { useState, useEffect } from 'react';

export interface Metrics {
  totalSoftwares: number;
  totalCategories: number;
  visitsPerMonth: number;
  frenchPercentage: string;
}

// Published CSV URL
const CSV_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vQuHiS0jgp1NpIHZdALbnQxrqF1aWnEVkI2w-ZHZojfbRsdEGgOXeW4Et7L3B6pMuW2wMOvMc97M210/pub?gid=636892040&single=true&output=csv';

/**
 * Hook to fetch and parse the metrics CSV.
 * Falls back to 0 or '100 %' if parsing fails.
 */
export function useMetrics(): Metrics | null {
  const [metrics, setMetrics] = useState<Metrics | null>(null);

  useEffect(() => {
    fetch(CSV_URL)
      .then(res => res.text())
      .then(csv => {
        const lines = csv.trim().split(/\r?\n/);
        if (lines.length < 2) return;

        const headers = lines[0].split(',');
        const values = lines[1].split(',');

        // Normalize header to lowercase single-space key
        const normalize = (s: string) =>
          s.trim().toLowerCase().replace(/\s+/g, ' ');

        const headerIndex: Record<string, number> = {};
        headers.forEach((h, i) => {
          headerIndex[normalize(h)] = i;
        });

        const get = (key: string) => {
          const idx = headerIndex[normalize(key)];
          return idx !== undefined ? values[idx].trim() : '';
        };

        setMetrics({
          totalSoftwares: parseInt(get('logiciels'), 10) || 0,
          totalCategories: parseInt(get('catégories'), 10) || 0,
          visitsPerMonth:
            parseInt(get('visits / months'), 10) ||
            parseInt(get('visits / mois'), 10) ||
            parseInt(get('visits'), 10) ||
            0,
          frenchPercentage: get('français') || '100 %',
        });
      })
      .catch(err => console.error('Error loading metrics:', err));
  }, []);

  return metrics;
}
