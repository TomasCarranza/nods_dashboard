import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

// Import the logo image
import NodsLogo from '/LogoNods.png';

const Header: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const navigate = useNavigate();

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

  // Only render the header if there's a session (user is logged in)
  if (!session) {
    return null; // Or a minimal header if needed when not logged in
  }

  return (
    <nav
      style={{
        background: 'linear-gradient(to bottom, #131313, #0A0A0A)',
        padding: '16px 32px',
        borderBottom: '1px solid #353535',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between', // Space out the main sections
        fontFamily: 'Poppins',
      }}
    >
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img src={NodsLogo} alt="Logo NODS" style={{ height: 28 }} />
      </div>

      {/* Navigation and Client Selector */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}> {/* Gap between selector and menu */}

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
          <span style={{ fontSize: '12px' }}>▼</span> UNAB
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
