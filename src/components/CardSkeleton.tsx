import React from 'react';
import Skeleton from 'react-loading-skeleton';

export default function CardSkeleton() {
  return (
    <div className="card">
      <div className="card-header">
        <div className="company-logo">
          <Skeleton width={80} height={80} />
        </div>
        <h2 className="subtitle" style={{ width: '50%' }}>
          <Skeleton />
        </h2>
        <div className="visit-button" style={{ width: 60 }}>
          <Skeleton />
        </div>
      </div>
      <p className="text">
        <Skeleton count={3} />
      </p>
    </div>
  );
}