import { useState, useEffect } from 'react';
import { CompanyRow } from '../types';

interface AlphabetNavProps {
  companies: CompanyRow[];
}

export default function AlphabetNav({ companies }: AlphabetNavProps) {
  const letters = Array.from(
    new Set(companies.map(c => c.name.charAt(0).toUpperCase()))
  ).sort();

  const [start, setStart] = useState(0);
  const [visibleCount, setVisibleCount] = useState(10);

  useEffect(() => {
    const updateVisibleCount = () => {
      if (window.innerWidth < 480) {
        setVisibleCount(6);
      } else if (window.innerWidth < 768) {
        setVisibleCount(8);
      } else {
        setVisibleCount(10);
      }
    };

    updateVisibleCount();
    window.addEventListener('resize', updateVisibleCount);
    return () => window.removeEventListener('resize', updateVisibleCount);
  }, []);

  const visible = letters.slice(start, start + visibleCount);

  const showArrows = letters.length > visibleCount;

  return (
    <div className="alphabet-nav">
      {showArrows && (
        <button
          className="alphabet-arrow"
          onClick={() => setStart(Math.max(0, start - visibleCount))}
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
              Math.min(start + visibleCount, Math.max(letters.length - visibleCount, 0))
            )
          }
          disabled={start + visibleCount >= letters.length}
        >
          {'>'}
        </button>
      )}
    </div>
  );
}
