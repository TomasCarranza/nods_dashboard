import React from 'react';

const Contactos: React.FC = () => (
  <div className="container py-5">
    <h2 className="text-white mb-4">Contactos</h2>
    {/* Sección para buscar información de un contacto */}
    <div className="bg-dark rounded-4 border border-secondary p-4 mb-4">
      <div className="text-white mb-3">Busca la información de un contacto</div>
      <div className="input-group">
        <span className="input-group-text bg-dark border-secondary text-secondary">
          🔍
        </span>
        <input type="text" className="form-control bg-dark border-secondary text-white" placeholder="tomas@gruponods.com" />
      </div>
    </div>

    {/* Sección para buscar campañas enviadas a un contacto */}
    <div className="bg-dark rounded-4 border border-secondary p-4 mb-4">
      <div className="text-white mb-3">Busca las campañas enviadas a un contacto</div>
      <div className="input-group">
        <span className="input-group-text bg-dark border-secondary text-secondary">
          🔍
        </span>
        <input type="text" className="form-control bg-dark border-secondary text-white" placeholder="tomas@gruponods.com" />
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