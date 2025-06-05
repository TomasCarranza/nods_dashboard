import React from 'react';
import './LineChart.css';

interface DataPoint {
  x: number | string;
  y: number;
}

interface LineChartProps {
  data: DataPoint[];
  title: string;
  xLabel?: string;
  yLabel?: string;
}

const LineChart: React.FC<LineChartProps> = ({ data, title, xLabel, yLabel }) => {
  const maxY = Math.max(...data.map(point => point.y));
  const minY = Math.min(...data.map(point => point.y));
  const range = maxY - minY;

  return (
    <div className="line-chart">
      <h2>{title}</h2>
      <div className="chart-container">
        {yLabel && <div className="y-label">{yLabel}</div>}
        <div className="chart">
          <svg viewBox={`0 0 ${data.length * 50} 200`}>
            <path
              d={data.map((point, index) => {
                const x = index * 50;
                const y = 200 - ((point.y - minY) / range) * 180;
                return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
              }).join(' ')}
              className="line"
            />
            {data.map((point, index) => (
              <circle
                key={index}
                cx={index * 50}
                cy={200 - ((point.y - minY) / range) * 180}
                r="4"
                className="point"
              />
            ))}
          </svg>
        </div>
        {xLabel && <div className="x-label">{xLabel}</div>}
      </div>
    </div>
  );
};

export default LineChart; 