// src/components/LineChart.tsx
import React from 'react';

const LineChart: React.FC = () => (
  <div className="h-100">
    <div className="d-flex justify-content-between align-items-center mb-3">
      <div className="d-flex gap-3">
        <button className="btn btn-outline-light btn-sm">7 días</button>
        <button className="btn btn-outline-light btn-sm">30 días</button>
        <button className="btn btn-outline-light btn-sm">90 días</button>
      </div>
      <div className="d-flex gap-2">
        <span className="badge bg-primary">Enviados</span>
        <span className="badge bg-success">Aperturas</span>
        <span className="badge bg-info">Clics</span>
      </div>
    </div>
    <div 
      style={{ 
        height: '300px', 
        background: 'linear-gradient(180deg, rgba(25, 70, 227, 0.1) 0%, rgba(25, 70, 227, 0) 100%)',
        borderRadius: '12px',
        border: '1px solid rgba(25, 70, 227, 0.2)',
        padding: '20px'
      }}
    >
      {/* Aquí iría el gráfico real */}
      <div className="d-flex justify-content-center align-items-center h-100 text-secondary">
        Gráfico de rendimiento
      </div>
    </div>
  </div>
);

export default LineChart;