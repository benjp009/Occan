import React from 'react';

export function ClockLoader() {
  return (
    <div className="clock-loader" aria-label="Chargement">
      <svg viewBox="0 0 100 100" className="clock">
        <circle cx="50" cy="50" r="45" fill="none" stroke="#000091" strokeWidth="5" />
        <line x1="50" y1="50" x2="50" y2="25" className="clock-hour" stroke="#000" strokeWidth="5" strokeLinecap="round" />
        <line x1="50" y1="50" x2="50" y2="15" className="clock-minute" stroke="#E1000F" strokeWidth="3" strokeLinecap="round" />
      </svg>
    </div>
  );
}

export default ClockLoader;