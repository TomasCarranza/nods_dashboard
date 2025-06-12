import React from 'react';
import type { DeliveryInfo } from '../pages/Contactos';

interface CampaignDeliveriesTableProps {
  deliveriesInfo: DeliveryInfo[];
}

export const CampaignDeliveriesTable: React.FC<CampaignDeliveriesTableProps> = ({ deliveriesInfo }) => {
  if (!deliveriesInfo || deliveriesInfo.length === 0) {
    return null; // No renderizar si no hay datos de entregas
  }

  return (
    <div className="p-4" style={{ backgroundColor: '#1A1A1A', borderRadius: '16px', border: '1px solid #353535' }}>
      <h5 className="text-white mb-3">Resultados de la búsqueda: Campaign Deliveries</h5>
      <div className="table-responsive">
        <table className="table table-dark table-striped" style={{ '--bs-table-bg': '#1A1A1A', '--bs-table-striped-bg': '#232323', '--bs-table-color': '#FAFAFA' } as React.CSSProperties}>
          <thead>
            <tr>
              <th>Campaña</th>
              <th>Asunto</th>
              <th>Comportamiento</th>
              <th>Clicks únicos</th>
            </tr>
          </thead>
          <tbody>
            {deliveriesInfo.map((delivery, index) => (
              <tr key={index}>
                <td>{delivery.campaignName}</td>
                <td>{delivery.campaignSubject}</td>
                <td>{delivery.deliveryStatus === 'opened' ? 'Abierto' : delivery.deliveryStatus}</td>
                <td>{delivery.clicksCount} clicks</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}; 