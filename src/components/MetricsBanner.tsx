import React, { useState, useEffect } from 'react';
import '../index.css';

// Hook to animate from 0 up to `end` over `duration` seconds
function useCountUp(end: number, duration: number = 1) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let rafId: number;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / (duration * 2500), 1);
      setValue(Math.floor(progress * end));
      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [end, duration]);

  return value;
}

interface MetricsBannerProps {
  totalSoftwares: number;
  totalCategories: number;
  visitsPerMonth: number;
  frenchPercentage: string; // e.g. "100 %"
}

const MetricsBanner: React.FC<MetricsBannerProps> = ({
  totalSoftwares,
  totalCategories,
  visitsPerMonth,
  frenchPercentage,
}) => {
  const animatedSoftwares = useCountUp(totalSoftwares, 1.5);
  const animatedCategories = useCountUp(totalCategories, 1.5);
  // const animatedVisits = useCountUp(visitsPerMonth, 1.5); // Hidden for now
  // parse percentage number, animate, then append "%"
  const pctNumber = parseInt(frenchPercentage, 10) || 100;
  const animatedPct = useCountUp(pctNumber, 1.5);

  return (
    <div className="metrics-banner">
      <div className="metric">
        <div className="metric-value">{animatedSoftwares}</div>
        <div className="metric-label">logiciels</div>
      </div>

      <div className="metric">
        <div className="metric-value">{animatedCategories}</div>
        <div className="metric-label">catégories</div>
      </div>

      {/* Hidden for now
      <div className="metric">
        <div className="metric-value">{animatedVisits.toLocaleString()}</div>
        <div className="metric-label">visits / mois</div>
      </div>
      */}

      <div className="metric">
        <div className="metric-value">{animatedPct}%</div>
        <div className="metric-label">français</div>
      </div>
    </div>
  );
};

export default MetricsBanner;
