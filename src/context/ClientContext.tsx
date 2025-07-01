import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

// Definimos la interfaz para el contexto
interface ClientContextType {
  client: string | null;
  setClient: (value: string | null) => void;
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
  // Inicializar desde localStorage si existe
  const [client, setClientState] = useState<string | null>(() => {
    return localStorage.getItem('client') || null;
  });
  const [selectedRemitente, setSelectedRemitenteState] = useState<string | null>(() => {
    return localStorage.getItem('selectedRemitente') || null;
  });

  // Sincronizar con localStorage
  const setClient = (value: string | null) => {
    setClientState(value);
    if (value === null) {
      localStorage.removeItem('client');
    } else {
      localStorage.setItem('client', value);
    }
  };
  const setSelectedRemitente = (value: string | null) => {
    setSelectedRemitenteState(value);
    if (value === null) {
      localStorage.removeItem('selectedRemitente');
    } else {
      localStorage.setItem('selectedRemitente', value);
    }
  };

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