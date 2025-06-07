import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useClient } from '../context/ClientContext'

// Import the logo image
import NodsLogo from '/LogoNods.png';

// Lista de clientes de ejemplo
const CLIENTES = [
  { id: 'unab', nombre: 'UNAB' },
  { id: 'crexe', nombre: 'Crexe' },
  { id: 'anahuac', nombre: 'Anahuac' }
];

const Header: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const navigate = useNavigate();
  const { client, setClient } = useClient();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
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
            value={client || ''}
            onChange={(e) => setClient(e.target.value)}
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
          <Link to="/" style={{ color: '#FAFAFA', textDecoration: 'none', cursor: 'pointer' }}>Inicio</Link>
          <Link to="/campanas-enviadas" style={{ color: '#FAFAFA', textDecoration: 'none', cursor: 'pointer' }}>Campañas enviadas</Link>
          <Link to="/contactos" style={{ color: '#FAFAFA', textDecoration: 'none', cursor: 'pointer' }}>Contactos</Link>
          <Link to="/chat-ia" style={{ color: '#FAFAFA', textDecoration: 'none', cursor: 'pointer' }}>Chat IA</Link>
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
