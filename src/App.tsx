// src/App.tsx
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Header from './components/Header';
import Home from './pages/Home';
import CampanasEnviadas from './pages/CampanasEnviadas';
import Contactos from './pages/Contactos';
import ChatIA from './pages/ChatIA';
import Login from './pages/Login';
import { supabase } from './lib/supabase';
import { useClient } from './context/ClientContext'
import { ClientDropdown } from './components/ClientDropdown'

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div>Cargando...</div>; // O un spinner de carga
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <Header />
      {children}
    </>
  );
}

function App(): JSX.Element {
  const { client } = useClient();

  return (
    <Router>
      <div className="bg-black min-vh-100">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/campanas-enviadas"
            element={
              <ProtectedRoute>
                <CampanasEnviadas />
              </ProtectedRoute>
            }
          />
          <Route
            path="/contactos"
            element={
              <ProtectedRoute>
                <Contactos />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat-ia"
            element={
              <ProtectedRoute>
                <ChatIA />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
