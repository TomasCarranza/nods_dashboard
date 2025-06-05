import React from 'react';
import WeeklySummary from '../components/WeeklySummary';
import InsightCard from '../components/InsightCard';
import LineChart from '../components/LineChart';

const Home: React.FC = () => (
  <div className="container py-5">
    <div className="row g-4">
      <div className="col-md-6">
        <div className="card bg-dark border border-secondary rounded-4 h-100 p-4">
          <div className="d-flex align-items-center mb-3">
            <span className="me-2 text-primary" style={{fontSize: '1.2em'}}>📅</span>
            <span className="text-secondary fw-semibold">Resumen semanal</span>
          </div>
          <WeeklySummary />
        </div>
      </div>
      <div className="col-md-6">
        <div className="card bg-dark border border-secondary rounded-4 h-100 p-4">
          <InsightCard />
        </div>
      </div>
      <div className="col-md-6">
        <div className="card bg-dark border border-secondary rounded-4 h-100 p-4">
          <LineChart />
        </div>
      </div>
      <div className="col-md-6">
        <div className="card bg-dark border border-secondary rounded-4 h-100 p-4"></div>
      </div>
    </div>
  </div>
);

export default Home; 