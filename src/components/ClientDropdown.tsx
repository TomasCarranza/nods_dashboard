import { useClient } from '../context/ClientContext';
import { sendClientWebhook } from '../lib/webhook';

// Lista de clientes de ejemplo
const CLIENTES = [
  { id: 'unab', nombre: 'UNAB' },
  { id: 'crexe', nombre: 'Crexe' },
  { id: 'anahuac', nombre: 'Anahuac' },
  { id: 'ulinea', nombre: 'Ulinea' }
];

// URL del webhook - deberías mover esto a un archivo de configuración
const WEBHOOK_URL = 'https://tu-webhook-url.com/endpoint';

export function ClientDropdown() {
  const { client, setClient } = useClient();

  const handleClientChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newClientId = e.target.value;
    setClient(newClientId);
    
    if (newClientId) {
      try {
        await sendClientWebhook(newClientId, WEBHOOK_URL);
        console.log('Webhook enviado exitosamente');
      } catch (error) {
        console.error('Error al enviar webhook:', error);
        // Aquí podrías mostrar una notificación al usuario si lo deseas
      }
    }
  };

  return (
    <div className="dropdown">
      <select
        className="form-select custom-input-bg custom-text-color"
        value={client || ''}
        onChange={handleClientChange}
        aria-label="Seleccionar cliente"
      >
        <option value="">Seleccionar cliente</option>
        {CLIENTES.map((cliente) => (
          <option key={cliente.id} value={cliente.id}>
            {cliente.nombre}
          </option>
        ))}
      </select>
    </div>
  );
} 