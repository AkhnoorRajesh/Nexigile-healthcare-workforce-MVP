import React from 'react';

export const DashboardCard = ({ title, value, subtext, icon: Icon, color = 'blue' }) => {
  return (
    <div className="stat-card">
      <div className="stat-info">
        <span className="stat-label">{title}</span>
        <span className="stat-value">{value}</span>
        {subtext && <span className="stat-subtext">{subtext}</span>}
      </div>
      {Icon && (
        <div className={`stat-icon-wrapper stat-icon-${color}`}>
          <Icon size={24} />
        </div>
      )}
    </div>
  );
};
