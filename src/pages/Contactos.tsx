import React, { useState } from 'react';
import { BsSearch } from 'react-icons/bs';
import { useClient } from '../context/ClientContext';
import { SubscriberInfoTable } from '../components/SubscriberInfoTable';
import { CampaignDeliveriesTable } from '../components/CampaignDeliveriesTable';

const WEBHOOK_URL = 'https://n8n.srv837604.hstgr.cloud/webhook/get-suscriber-info';

export interface Field {
  name: string;
  value: string;
  predefined: boolean;
  private: boolean;
  readonly: boolean;
  type: string;
}

export interface SubscriberInfo {
  email: string;
  fields: Field[];
  belongsToLists: string[];
  status: string;
  score: number;
}

export interface DeliveryInfo {
  campaignId: number;
  campaignName: string;
  campaignSubject: string;
  subscriberEmail: string;
  deliveryStatus: string;
  lastOpenDate: string | null;
  sentDate: string;
  opensCount: number;
  clicksCount: number;
  isSendingNow: boolean;
  _links: Array<{ href: string; description: string; rel: string }>;
}

export interface WebhookResult {
  subscriberInfo?: SubscriberInfo;
  deliveriesInfo?: DeliveryInfo[];
}

const Contactos: React.FC = () => {
  const { client } = useClient();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<WebhookResult | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!email) {
      setError('Por favor ingresa un email');
      return;
    }

    if (!client) {
      setError('Por favor selecciona un cliente');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setHasSearched(true);

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          client_id: client,
          timestamp: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error(`Error al buscar el contacto: ${response.statusText}`);
      }

      const data: WebhookResult = await response.json();
      console.log('Respuesta del webhook:', data);
      setResult(data);

    } catch (err) {
      setError('No se pudo encontrar el contacto en Doppler. Revisá que el mail esté escrito correctamente o intentá de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="py-5 px-4" style={{ maxWidth: '1800px', margin: '0 auto' }}>
      <h2 className="text-white mb-4">Contactos</h2>

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
            type="email"
            className="form-control"
            placeholder="tomas@gruponods.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={handleKeyPress}
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
            <BsSearch size={18} onClick={handleSearch} style={{ cursor: 'pointer' }} />
          </span>
        </div>

        {error && (
          <div className="text-danger mt-2" style={{ fontSize: '0.9rem' }}>
            {error}
          </div>
        )}

        {loading && (
          <div className="text-white mt-2" style={{ fontSize: '0.9rem' }}>
            Buscando...
          </div>
        )}

        {(result?.subscriberInfo || (Array.isArray(result?.deliveriesInfo) && result?.deliveriesInfo.length > 0)) && (
          <div className="mt-4">
            {result?.subscriberInfo && (
              <SubscriberInfoTable subscriberInfo={result.subscriberInfo} />
            )}
            
            {result?.deliveriesInfo && Array.isArray(result.deliveriesInfo) && result.deliveriesInfo.length > 0 && (
              <CampaignDeliveriesTable deliveriesInfo={result.deliveriesInfo} />
            )}
          </div>
        )}

        {!loading && !error && hasSearched && !(result?.subscriberInfo || (Array.isArray(result?.deliveriesInfo) && result?.deliveriesInfo.length > 0)) && (
          <div className="text-white mt-4 text-center">
            <p>No se encontraron resultados para el email ingresado o cliente seleccionado.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Contactos; 