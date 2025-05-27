import React from 'react';

interface MetricsBannerProps {
  totalSoftwares: number;
  totalCategories: number;
  visitsPerMonth: number;
  frenchPercentage: string;

}

/**
 * A horizontal banner showing four key metrics:
 * - total number of softwares
 * - total number of categories
 * - visits/month
 * - “100 % français”
 */
const MetricsBanner: React.FC<MetricsBannerProps> = ({
  totalSoftwares,
  totalCategories,
  visitsPerMonth,
  frenchPercentage,
}) => (
  <div className="metrics-banner">
    <div className="metric">
      <div className="metric-value">{totalSoftwares}</div>
      <div className="metric-label">logiciels</div>
    </div>
    <div className="metric">
      <div className="metric-value">{totalCategories}</div>
      <div className="metric-label">catégories</div>
    </div>
    <div className="metric">
      <div className="metric-value">{visitsPerMonth.toLocaleString()}</div>
      <div className="metric-label">visits / mois</div>
    </div>
    <div className="metric">
      <div className="metric-value">{frenchPercentage}</div>
      <div className="metric-label">français</div>
    </div>
  </div>
);

export default MetricsBanner;
