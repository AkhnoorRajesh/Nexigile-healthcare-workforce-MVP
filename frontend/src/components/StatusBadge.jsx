import React from 'react';

export const StatusBadge = ({ status }) => {
  const norm = (status || '').toLowerCase();
  let badgeClass = 'badge-open';

  if (norm === 'confirmed' || norm === 'accepted') {
    badgeClass = 'badge-confirmed';
  } else if (norm === 'applied') {
    badgeClass = 'badge-applied';
  } else if (norm === 'rejected' || norm === 'cancelled') {
    badgeClass = 'badge-rejected';
  }

  return (
    <span className={`badge ${badgeClass}`}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor', display: 'inline-block' }}></span>
      {status}
    </span>
  );
};
