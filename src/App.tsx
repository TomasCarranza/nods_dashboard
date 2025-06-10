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
import { supabase, isSupabaseConfigured } from './lib/supabase';
import { useClient } from './context/ClientContext'

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    // Obtener la sesión actual
    supabase?.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Suscribirse a cambios en la autenticación
    const { data: { subscription } } = supabase?.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    }) || { data: { subscription: { unsubscribe: () => {} } } };

    // Limpiar la suscripción al desmontar
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-black">
        <div className="text-white">Cargando...</div>
      </div>
    );
  }

  if (!isSupabaseConfigured()) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-black">
        <div className="text-white">Error: Supabase no está configurado correctamente</div>
      </div>
    );
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
