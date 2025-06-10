import React from 'react';
import WeeklySummary from '../components/WeeklySummary';
import InsightCard from '../components/InsightCard';
import LineChart from '../components/LineChart';
import { BsCalendar } from 'react-icons/bs';

const Home: React.FC = () => (
  <div className="container py-5">
    <div className="row g-4">
      <div className="col-md-6">
        <div className="card rounded-4 h-100 p-4" style={{ backgroundColor: '#1A1A1A', border: '1px solid #353535' }}>
          <div className="d-flex align-items-center mb-3">
            <div className="p-2 bg-primary bg-opacity-10 rounded-3 me-2">
              <BsCalendar className="text-primary" size={20} />
            </div>
            <span className="text-secondary fw-semibold">Resumen semanal</span>
          </div>
          <WeeklySummary />
        </div>
      </div>
      <div className="col-md-6">
        <div className="card rounded-4 h-100 p-4" style={{ backgroundColor: '#1A1A1A', border: '1px solid #353535' }}>
          <LineChart />
        </div>
      </div>
      <div className="col-md-6">
        <div className="card rounded-4 h-100 p-4" style={{ backgroundColor: '#1A1A1A', border: '1px solid #353535' }}>
          <InsightCard />
        </div>
      </div>
      <div className="col-md-6">
        <div className="card rounded-4 h-100 p-4" style={{ backgroundColor: '#1A1A1A', border: '1px solid #353535' }}></div>
      </div>
    </div>
  </div>
);

export default Home; 