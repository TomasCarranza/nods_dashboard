import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useClient } from '../context/ClientContext'
import { motion, AnimatePresence } from 'framer-motion';

// Import the logo image
import NodsLogo from '/LogoNods.png';

// Lista de clientes de ejemplo
const CLIENTES = [
  { id: 'unab', nombre: 'UNAB' },
  { id: 'crexe', nombre: 'Crexe' },
  { id: 'anahuac', nombre: 'Anahuac' },
  { id: 'cesa_admisiones', nombre: 'Cesa Admisiones', remitente: 'educontinua.aspirante@cesa.edu.co' },
  { id: 'cesa_servicios', nombre: 'Cesa Servicios', remitente: 'experiencia.luna@cesa.edu.co' },
  { id: 'ulinea', nombre: 'Ulinea' },
  { id: 'aliatb2c', nombre: 'Aliat B2C' },
  { id: 'aliatb2b', nombre: 'Aliat B2B' }
];

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { client, setClient, setSelectedRemitente } = useClient();
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const location = useLocation();

  // Sincronizar el selectedClientId con el client del contexto
  useEffect(() => {
    if (client) {
      // Si el cliente es 'cesa', necesitamos determinar cuál de los dos clientes Cesa está seleccionado
      if (client === 'cesa') {
        const cesaClient = CLIENTES.find(c => c.id === 'cesa_admisiones' || c.id === 'cesa_servicios');
        if (cesaClient) {
          setSelectedClientId(cesaClient.id);
        }
      } else {
        setSelectedClientId(client);
      }
    } else {
      setSelectedClientId('');
    }
  }, [client]);

  const handleClientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedClient = CLIENTES.find(c => c.id === e.target.value);
    if (selectedClient) {
      setSelectedClientId(e.target.value);
      // Para Cesa Admisiones y Cesa Servicios, usamos cliente_id 'cesa'
      if (selectedClient.id === 'cesa_admisiones' || selectedClient.id === 'cesa_servicios') {
        setClient('cesa');
      } else {
        setClient(selectedClient.id);
      }
      setSelectedRemitente(selectedClient.remitente || null);
    }
  };

  const handleLogout = async () => {
    if (isSupabaseConfigured() && supabase) {
      await supabase.auth.signOut();
    }
    navigate('/login');
  };

  return (
    <nav
      style={{
        background: 'linear-gradient(to bottom, #131313, #0A0A0A)',
        padding: '16px 32px',
        borderBottom: '1px solid #353535',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontFamily: 'Poppins',
      }}
    >
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img src={NodsLogo} alt="Logo NODS" style={{ height: 28 }} />
      </div>

      {/* Navigation and Client Selector */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        {/* Dropdown cliente */}
        <div
          style={{
            border: '2px solid #1946E3',
            borderRadius: '999px',
            padding: '6px 16px',
            backgroundColor: '#0A0A0A',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#FAFAFA',
            fontWeight: 600,
            letterSpacing: '-0.03em',
            cursor: 'pointer',
            fontSize: '1.25em',
          }}
        >
          <select
            value={selectedClientId}
            onChange={handleClientChange}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#FAFAFA',
              fontWeight: 600,
              fontSize: '1em',
              cursor: 'pointer',
              outline: 'none',
              width: '100%',
            }}
          >
            <option value="">Seleccionar cliente</option>
            {CLIENTES.map((cliente) => (
              <option key={cliente.id} value={cliente.id} style={{ background: '#0A0A0A' }}>
                {cliente.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Menú de navegación */}
        <div
          style={{
            border: '2px solid #1946E3',
            borderRadius: '999px',
            padding: '8px 24px',
            backgroundColor: '#0A0A0A',
            display: 'flex',
            alignItems: 'center',
            gap: '30px',
            color: '#FAFAFA',
            fontWeight: 500,
            letterSpacing: '-0.03em',
            fontSize: '1.25em',
          }}
        >
          <Link to="/" style={{ color: '#FAFAFA', textDecoration: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
            Inicio
            <AnimatePresence mode="wait">
              {location.pathname === '/' && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: '40%', opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  style={{ 
                    height: '5px', 
                    backgroundColor: '#1946E3', 
                    borderRadius: '999px', 
                    marginTop: '4px',
                    position: 'absolute',
                    bottom: '-9px'
                  }}
                />
              )}
            </AnimatePresence>
          </Link>
          <Link to="/campanas-enviadas" style={{ color: '#FAFAFA', textDecoration: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
            Campañas enviadas
            <AnimatePresence mode="wait">
              {location.pathname === '/campanas-enviadas' && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: '40%', opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  style={{ 
                    height: '5px', 
                    backgroundColor: '#1946E3', 
                    borderRadius: '999px', 
                    marginTop: '4px',
                    position: 'absolute',
                    bottom: '-9px'
                  }}
                />
              )}
            </AnimatePresence>
          </Link>
          <Link to="/contactos" style={{ color: '#FAFAFA', textDecoration: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
            Contactos
            <AnimatePresence mode="wait">
              {location.pathname === '/contactos' && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: '40%', opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  style={{ 
                    height: '5px', 
                    backgroundColor: '#1946E3', 
                    borderRadius: '999px', 
                    marginTop: '4px',
                    position: 'absolute',
                    bottom: '-9px'
                  }}
                />
              )}
            </AnimatePresence>
          </Link>
          <Link to="/chat-ia" style={{ color: '#FAFAFA', textDecoration: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
            Chat IA
            <AnimatePresence mode="wait">
              {location.pathname === '/chat-ia' && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: '40%', opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  style={{ 
                    height: '5px', 
                    backgroundColor: '#1946E3', 
                    borderRadius: '999px', 
                    marginTop: '4px',
                    position: 'absolute',
                    bottom: '-9px'
                  }}
                />
              )}
            </AnimatePresence>
          </Link>
        </div>
      </div>

      {/* Logout Icon */}
      <img
        src="/log-out-svgrepo-com.svg"
        alt="Log out"
        onClick={handleLogout}
        style={{
          height: 28,
          cursor: 'pointer',
        }}
      />
    </nav>
  );
};

export default Header;
