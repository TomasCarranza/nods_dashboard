// src/components/WeeklySummary.tsx
import React from 'react';
import SummaryCard from './SummaryCard';

const WeeklySummary: React.FC = () => {
  return (
    <div className="row g-4">
      <div className="col-12 col-md-6">
        <SummaryCard title="Emails enviados" value="12.456" />
      </div>
      <div className="col-12 col-md-6">
        <SummaryCard title="Tasa de apertura (O.R)" value="23.6 %" />
      </div>
      <div className="col-12 col-md-6">
        <SummaryCard title="Tasa de clics (CTR)" value="2.3 %" />
      </div>
      <div className="col-12 col-md-6">
        <SummaryCard title="Tasa de rebote (B.R)" value="0.98 %" />
      </div>
    </div>
  );
};

export default WeeklySummary;