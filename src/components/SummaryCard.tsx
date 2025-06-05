import React from 'react';
import './SummaryCard.css';

interface SummaryCardProps {
  title: string;
  value: number | string;
  icon?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, icon, trend }) => {
  return (
    <div className="summary-card">
      <div className="summary-card-header">
        <h3>{title}</h3>
        {icon && <span className="material-icons">{icon}</span>}
      </div>
      <div className="summary-card-value">{value}</div>
      {trend && (
        <div className={`summary-card-trend ${trend.isPositive ? 'positive' : 'negative'}`}>
          <span className="material-icons">
            {trend.isPositive ? 'trending_up' : 'trending_down'}
          </span>
          {trend.value}%
        </div>
      )}
    </div>
  );
};

export default SummaryCard; 