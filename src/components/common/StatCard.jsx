import React from 'react';
import './StatCard.css';

export const StatCard = ({ title, value, change, icon: Icon, iconBg, changeType = 'positive', subtitle }) => {
  return (
    <div className="stat-card">
      <div className="stat-card-header">
        {Icon && (
          <div className="stat-card-icon" style={{ backgroundColor: iconBg || '#EFF6FF' }}>
            <Icon size={22} />
          </div>
        )}
        <div className="stat-card-info">
          <span className="stat-card-title">{title}</span>
          <h3 className="stat-card-value">{value}</h3>
        </div>
      </div>
      
      {(change || subtitle) && (
        <div className="stat-card-footer">
          {change && (
            <span className={`stat-card-change ${changeType}`}>
              {change}
            </span>
          )}
          {subtitle && (
            <span className="stat-card-subtitle">{subtitle}</span>
          )}
        </div>
      )}
    </div>
  );
};
