import React from 'react';

const Contactos: React.FC = () => (
  <div className="py-5" style={{ maxWidth: '1800px', margin: '0 auto' }}>
    <h2 className="text-white mb-4">Contactos</h2>
    
    {/* Sección para buscar información de un contacto */}
    <div 
      className="mb-4 p-4" 
      style={{ 
        backgroundColor: '#1A1A1A',
        borderRadius: '16px',
        border: '1px solid #353535'
      }}
    >
      <div className="text-white mb-3" style={{ fontSize: '1.1rem' }}>Busca la información de un contacto en Doppler</div>
      <div className="position-relative" style={{ width: '100%', maxWidth: '400px' }}>
        <input
          type="text"
          className="form-control"
          placeholder="tomas@gruponods.com"
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
    </div>

    {/* Sección para buscar campañas enviadas a un contacto */}
    <div 
      className="mb-4 p-4" 
      style={{ 
        backgroundColor: '#1A1A1A',
        borderRadius: '16px',
        border: '1px solid #353535'
      }}
    >
      <div className="text-white mb-3" style={{ fontSize: '1.1rem' }}>Busca las campañas de email marketing enviadas a un contacto</div>
      <div className="position-relative" style={{ width: '100%', maxWidth: '400px' }}>
        <input
          type="text"
          className="form-control"
          placeholder="tomas@gruponods.com"
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
    </div>

    {/* Aquí podrías añadir la sección para mostrar los contactos o resultados */}
    {/*
    <div className="bg-dark rounded-4 border border-secondary p-5 text-secondary">
      Aquí se mostrarán los contactos.
    </div>
    */}
  </div>
);

export default Contactos; 