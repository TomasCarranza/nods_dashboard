// src/App.tsx
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Header from './components/Header';
import Home from './pages/Home';
import CampanasEnviadas from './pages/CampanasEnviadas';
import Contactos from './pages/Contactos';
import ChatIA from './pages/ChatIA';
import Login from './pages/Login';
import Automatizaciones from './pages/Automatizaciones';
import { supabase, isSupabaseConfigured } from './lib/supabase';

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured() || !supabase) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

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

function AppContent(): JSX.Element {
  const location = useLocation();

  return (
    <div className="bg-black min-vh-100">
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.15, ease: "easeInOut" }}
          className="page-container"
        >
          <Routes location={location}>
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
            <Route
              path="/automatizaciones"
              element={
                <ProtectedRoute>
                  <Automatizaciones />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function App(): JSX.Element {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
