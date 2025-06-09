import React from 'react';
import { BsRobot } from 'react-icons/bs';

const ChatIA: React.FC = () => (
  <div className="container py-5">
    <h2 className="text-white mb-4">Chat IA</h2>
    <div
      className="bg-dark rounded-4 border border-secondary p-4 d-flex flex-column"
      style={{ height: 'calc(100vh - 200px)' }} // Ajusta la altura según sea necesario
    >
      {/* Área de mensajes */}
      <div className="flex-grow-1 overflow-auto">
        {/* Mensaje inicial */}
        <div className="d-flex align-items-start gap-3 mb-3">
          <div className="p-2 bg-primary bg-opacity-10 rounded-circle">
            <BsRobot className="text-primary" size={24} />
          </div>
          <div className="flex-grow-1">
            <div className="text-white">¡Hola! ¿En qué te puedo ayudar?</div>
          </div>
        </div>
      </div>

      {/* Área de entrada de texto */}
      <div className="d-flex gap-3 mt-3">
        <div className="input-group">
          <span className="input-group-text bg-dark border-secondary text-secondary">
            +
          </span>
          <input
            type="text"
            className="form-control bg-dark border-secondary text-white"
            placeholder="Pregunta lo que quieras sobre las campañas"
            aria-label="Pregunta lo que quieras sobre las campañas"
          />
        </div>
      </div>
    </div>
  </div>
);

export default ChatIA; 