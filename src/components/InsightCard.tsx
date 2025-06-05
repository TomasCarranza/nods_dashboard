import React from 'react';
import './InsightCard.css';

interface InsightCardProps {
  title: string;
  description: string;
  icon: string;
  type: 'info' | 'warning' | 'success' | 'error';
}

const InsightCard: React.FC<InsightCardProps> = ({ title, description, icon, type }) => {
  return (
    <div className={`insight-card ${type}`}>
      <div className="insight-icon">
        <span className="material-icons">{icon}</span>
      </div>
      <div className="insight-content">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
};

export default InsightCard; 