import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

// Definimos la interfaz para el contexto
interface ClientContextType {
  client: string | null;
  setClient: (value: string) => void;
  selectedRemitente: string | null;
  setSelectedRemitente: (value: string | null) => void;
}

// Creamos el contexto con un valor inicial
const ClientContext = createContext<ClientContextType | undefined>(undefined);

// Props para el Provider
interface ClientProviderProps {
  children: ReactNode;
}

// Componente Provider
export function ClientProvider({ children }: ClientProviderProps) {
  const [client, setClient] = useState<string | null>(null);
  const [selectedRemitente, setSelectedRemitente] = useState<string | null>(null);

  return (
    <ClientContext.Provider value={{ client, setClient, selectedRemitente, setSelectedRemitente }}>
      {children}
    </ClientContext.Provider>
  );
}

// Hook personalizado para usar el contexto
export function useClient() {
  const context = useContext(ClientContext);
  
  if (context === undefined) {
    throw new Error('useClient debe ser usado dentro de un ClientProvider');
  }
  
  return context;
} 