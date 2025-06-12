import React from 'react';
import type { SubscriberInfo, Field } from '../pages/Contactos';

interface SubscriberInfoTableProps {
  subscriberInfo: SubscriberInfo;
}

export const SubscriberInfoTable: React.FC<SubscriberInfoTableProps> = ({ subscriberInfo }) => {
  const firstNameField = subscriberInfo.fields?.find((field: Field) => field.name === 'FIRSTNAME');
  const lastNameField = subscriberInfo.fields?.find((field: Field) => field.name === 'LASTNAME');
  // Asumiendo que el campo 'CREATEDDATE' existe en 'fields' si es necesario, de lo contrario se usa 'N/A'
  const createdDateField = subscriberInfo.fields?.find((field: Field) => field.name === 'CREATEDDATE');
  const formattedCreatedDate = createdDateField?.value ? new Date(createdDateField.value).toLocaleDateString('es-ES') : 'N/A';

  return (
    <div className="mb-4 p-4" style={{ backgroundColor: '#1A1A1A', borderRadius: '16px', border: '1px solid #353535' }}>
      <h5 className="text-white mb-3">Resultados de la búsqueda: Subscriber Info</h5>
      <div className="table-responsive">
        <table className="table table-dark table-striped" style={{ '--bs-table-bg': '#1A1A1A', '--bs-table-striped-bg': '#232323', '--bs-table-color': '#FAFAFA' } as React.CSSProperties}>
          <thead>
            <tr>
              <th>Estado</th>
              <th>Email</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Origen</th>
              <th>Fecha de creación</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{subscriberInfo.status === 'active' ? 'Activo' : subscriberInfo.status}</td>
              <td>{subscriberInfo.email}</td>
              <td>{firstNameField?.value || 'N/A'}</td>
              <td>{lastNameField?.value || 'N/A'}</td>
              <td>{'Rest API'}</td>
              <td>{formattedCreatedDate}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}; 