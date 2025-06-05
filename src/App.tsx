// src/App.tsx
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import CampanasEnviadas from './pages/CampanasEnviadas';
import Contactos from './pages/Contactos';
import ChatIA from './pages/ChatIA';

function App(): JSX.Element {
  return (
    <Router>
      <div className="bg-black min-vh-100">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/campanas-enviadas" element={<CampanasEnviadas />} />
          <Route path="/contactos" element={<Contactos />} />
          <Route path="/chat-ia" element={<ChatIA />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
