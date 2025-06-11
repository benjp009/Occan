import React, { useState, useEffect } from 'react';

/**
 * Company entry structure
 */
export interface Company {
  id: string;
  name: string;
  keywords: string[];
  category: string;
}

export interface SearchBarProps {
  /**
   * Array of companies to search through
   */
  data: Company[];
  /**
   * Callback invoked with filtered results on each query
   */
  onResults?: (results: Company[]) => void;
  /**
   * Placeholder text for the input
   */
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ data, onResults, placeholder = 'Rechercher un logiciel...' }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Company[]>([]);

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setResults([]);
      onResults && onResults([]);
      return;
    }

    const q = trimmed.toLowerCase();
    const filtered = data.filter(item =>
      item.name.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.keywords.some(k => k.toLowerCase().includes(q))
    );

    setResults(filtered);
    onResults && onResults(filtered);
  }, [query, data, onResults]);

  return (
    <div className="search-bar">
      <input
        className="search-input"
        type="text"
        value={query}
        placeholder={placeholder}
        onChange={e => setQuery(e.target.value)}
      />

      {results.length > 0 && (
        <ul className="search-results">
          {results.map(item => (
            <li key={item.id} className="result-item">
              <strong>{item.name}</strong> <span className="category">({item.category})</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;