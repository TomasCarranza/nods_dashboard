// src/components/InsightCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { BsLightningCharge, BsGraphUp, BsChatDots } from 'react-icons/bs';

const InsightCard: React.FC = () => (
  <div className="h-100">
    <div className="mb-4">
      <div className="d-flex align-items-center gap-2 mb-3">
        <div className="p-2 bg-primary bg-opacity-10 rounded-3">
          <BsLightningCharge className="text-primary" size={20} />
        </div>
        <h6 className="mb-0 text-white">Análisis de IA</h6>
      </div>
      <p className="text-white-50 mb-4">
        La campaña <strong className="text-white">"UNAB Pregrado"</strong> fue la que mayor tasa de clics registró en toda la semana. <strong className="text-success">(4.1 %)</strong>
      </p>
    </div>

    <div className="mb-4">
      <div className="d-flex align-items-center gap-2 mb-3">
        <div className="p-2 bg-success bg-opacity-10 rounded-3">
          <BsGraphUp className="text-success" size={20} />
        </div>
        <h6 className="mb-0 text-white">Tendencia</h6>
      </div>
      <p className="text-white-50">
        Las campañas enviadas en horario de la tarde (15:00 - 17:00) muestran un 15% más de engagement que las enviadas en la mañana.
      </p>
    </div>

    <Link to="/chat-ia">
      <button className="btn btn-primary w-100 mt-3">
        <BsChatDots className="me-2" /> Hacer preguntas sobre las campañas
      </button>
    </Link>
  </div>
);

export default InsightCard;