import { useClient } from '../context/ClientContext';

// Lista de clientes de ejemplo
const CLIENTES = [
  { id: 'unab', nombre: 'UNAB' },
  { id: 'crexe', nombre: 'Crexe' },
  { id: 'anahuac', nombre: 'Anahuac' }
];

export function ClientDropdown() {
  const { client, setClient } = useClient();

  return (
    <div className="dropdown">
      <select
        className="form-select custom-input-bg custom-text-color"
        value={client || ''}
        onChange={(e) => setClient(e.target.value)}
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