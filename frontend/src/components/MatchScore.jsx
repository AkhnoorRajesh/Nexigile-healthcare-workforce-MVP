import React, { useState } from 'react';
import { Sparkles, ChevronDown, ChevronUp, CheckCircle } from 'lucide-react';

export const MatchScore = ({ score, factors = [], showBreakdown = true }) => {
  const [expanded, setExpanded] = useState(false);

  if (score === undefined || score === null) return null;

  let colorClass = 'ai-match-high';
  if (score < 75) {
    colorClass = 'ai-match-fair';
  } else if (score < 88) {
    colorClass = 'ai-match-medium';
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <div className={`ai-match-badge ${colorClass}`}>
          <Sparkles size={14} />
          <span>{score}% AI Match</span>
        </div>

        {showBreakdown && factors && factors.length > 0 && (
          <button
            onClick={() => setExpanded(!expanded)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.2rem',
              fontSize: '0.78rem',
              fontWeight: 600,
              color: 'var(--accent-cta)',
            }}
          >
            Why this match?
            {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>
        )}
      </div>

      {expanded && factors && factors.length > 0 && (
        <div
          style={{
            background: 'var(--bg-surface-secondary)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '0.75rem 1rem',
            marginTop: '0.45rem',
            animation: 'fadeIn 0.2s ease',
          }}
        >
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Match Determinants
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {factors.map((factor, idx) => (
              <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.8rem', color: 'var(--text-primary)' }}>
                <CheckCircle size={14} style={{ color: 'var(--accent-cta)', flexShrink: 0 }} />
                <span>{factor}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
