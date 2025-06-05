import React from 'react';
import './WeeklySummary.css';

interface WeeklyData {
  day: string;
  value: number;
}

interface WeeklySummaryProps {
  data: WeeklyData[];
  title: string;
}

const WeeklySummary: React.FC<WeeklySummaryProps> = ({ data, title }) => {
  return (
    <div className="weekly-summary">
      <h2>{title}</h2>
      <div className="weekly-chart">
        {data.map((item, index) => (
          <div key={index} className="weekly-bar">
            <div 
              className="bar" 
              style={{ height: `${(item.value / Math.max(...data.map(d => d.value))) * 100}%` }}
            />
            <span className="day-label">{item.day}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeeklySummary; 