import React, { useState } from 'react';
import CampaniasTable from '../components/CampaniasTable';

const CampanasEnviadas: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="py-5" style={{ maxWidth: '1800px', margin: '0 auto' }}>
      <h2 className="text-white mb-4">Campañas enviadas</h2>
      <div className="position-relative mb-4" style={{ width: '100%', maxWidth: '400px' }}>
        <input
          type="text"
          className="form-control"
          placeholder="Buscar por nombre de campaña..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            paddingLeft: '2.5rem',
            paddingRight: '1rem',
            paddingTop: '0.75rem',
            paddingBottom: '0.75rem',
            borderRadius: '12px',
            border: '1px solid #353535',
            backgroundColor: '#232323',
            color: '#E6E6E6',
            fontSize: '1rem',
            width: '100%',
            transition: 'all 0.2s ease-in-out'
          }}
        />
        <span
          className="position-absolute"
          style={{
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#A0A0A0'
          }}
        >
          🔍
        </span>
      </div>
      <CampaniasTable searchTerm={searchTerm} />
    </div>
  );
};

export default CampanasEnviadas; 