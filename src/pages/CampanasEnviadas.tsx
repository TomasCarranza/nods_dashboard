import React from 'react';
import CampaniasTable from '../components/CampaniasTable';

const CampanasEnviadas: React.FC = () => (
  <div className="py-5" style={{ maxWidth: '1800px', margin: '0 auto' }}>
    <h2 className="text-white mb-4">Campañas enviadas</h2>
    <CampaniasTable />
  </div>
);

export default CampanasEnviadas; 