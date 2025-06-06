// src/components/SummaryCard.tsx
import React from 'react';

interface Props {
  title: string;
  value: string;
}

const SummaryCard: React.FC<Props> = ({ title, value }) => (
  <div
    className="d-flex flex-column align-items-center justify-content-center w-100 h-100"
    style={{
      background: '#232323',
      borderRadius: '32px',
      padding: '2.5rem 1rem',
      minHeight: '160px',
      boxShadow: '0 0 0 1.5px #353535',
    }}
  >
    <div className="fw-bold" style={{ fontSize: '2.3rem', color: '#E6E6E6', lineHeight: 1 }}>{value}</div>
    <div className="mt-2" style={{ color: '#A0A0A0', fontSize: '1rem', fontWeight: 500 }}>{title}</div>
  </div>
);

export default SummaryCard;
