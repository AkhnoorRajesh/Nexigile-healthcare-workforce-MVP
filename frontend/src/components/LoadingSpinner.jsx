import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner = ({ text = 'Loading data...' }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4rem 1rem',
        gap: '0.75rem',
        color: 'var(--text-secondary)',
      }}
    >
      <Loader2 size={36} className="animate-spin" style={{ color: 'var(--brand-blue)' }} />
      <span style={{ fontSize: '0.88rem', fontWeight: 500 }}>{text}</span>
    </div>
  );
};
