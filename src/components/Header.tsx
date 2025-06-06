import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <nav
      style={{
        background: 'linear-gradient(to bottom, #131313, #0A0A0A)',
        padding: '16px 32px',
        borderBottom: '1px solid #353535',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Poppins',
      }}
    >
      {/* Logo y texto NODS */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <img src="/LogoNods.png" alt="Logo NODS" style={{ height: 28 }} />
        <span
          style={{
            color: '#fff',
            fontWeight: 600,
            fontSize: '24px',
            letterSpacing: '-0.03em',
            marginRight: '35px',
          }}
        >
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
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
            padding: '6px 24px',
            backgroundColor: '#0A0A0A',
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
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
    </nav>
  );
};

export default Header;
