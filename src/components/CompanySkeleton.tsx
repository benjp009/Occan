import React from 'react';
import Skeleton from 'react-loading-skeleton';

export default function CompanySkeleton() {
  return (
    <div className="company">
      <div className="company-header">
        <div>
          <div className="company-logo modal-logo">
            <Skeleton width={80} height={80} />
          </div>
          <h2 className="company-name">
            <Skeleton width={200} />
          </h2>
        </div>
        <div className="company-buttons">
          {Array.from({ length: 3 }).map((_, idx) => (
            <button
              key={idx}
              type="button"
              className="button modal-button"
              style={{ width: 80 }}
            >
              <Skeleton />
            </button>
          ))}
        </div>
      </div>
      <p className="company-description">
        <Skeleton count={3} />
      </p>
      <div className="company-info">
        {Array.from({ length: 3 }).map((_, idx) => (
          <p key={idx}>
            <Skeleton width={150} />
          </p>
        ))}
      </div>
    </div>
  );
}
