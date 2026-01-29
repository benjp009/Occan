import { useState } from 'react';
import { CompanyRow } from '../types';

interface AlphabetNavProps {
  companies: CompanyRow[];
}

export default function AlphabetNav({ companies }: AlphabetNavProps) {
  const letters = Array.from(
    new Set(companies.map(c => c.name.charAt(0).toUpperCase()))
  ).sort();

  const [start, setStart] = useState(0);

  const visible = letters.slice(start, start + 10);

  const showArrows = letters.length > 10;

  return (
    <div className="alphabet-nav">
      {showArrows && (
        <button
          className="alphabet-arrow"
          onClick={() => setStart(Math.max(0, start - 10))}
          disabled={start === 0}
        >
          {'<'}
        </button>
      )}
      {visible.map(letter => (
        <a key={letter} href={`#letter-${letter}`} className="alphabet-letter">
          {letter}
        </a>
      ))}
      {showArrows && (
        <button
          className="alphabet-arrow"
          onClick={() =>
            setStart(
              Math.min(start + 10, Math.max(letters.length - 10, 0))
            )
          }
          disabled={start + 10 >= letters.length}
        >
          {'>'}
        </button>
      )}
    </div>
  );
}
