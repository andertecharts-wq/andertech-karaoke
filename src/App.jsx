import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';
import Player from './pages/Player';
import PartyMode from './pages/Party';
import MobileRemote from './pages/MobileRemote';
import Settings from './pages/Settings';
import { KaraokeProvider } from './context/KaraokeContext';

function App() {
  return (
    <BrowserRouter>
      <KaraokeProvider>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="admin" element={<AdminDashboard />} />
            <Route path="library" element={<div className="p-8 text-2xl font-bold text-slate-500">Biblioteca em breve...</div>} />
            <Route path="party" element={<PartyMode />} />
            <Route path="favorites" element={<div className="p-8 text-2xl font-bold text-slate-500">Favoritos em breve...</div>} />
            <Route path="settings" element={<Settings />} />
          </Route>
          {/* Rota para controle remoto mobile */}
          <Route path="/remote" element={<MobileRemote />} />
          {/* Rota flexível para o player (aceita /player/custom, /player/1, etc) */}
          <Route path="/player/:id" element={<Player />} />
        </Routes>
      </KaraokeProvider>
    </BrowserRouter>
  );
}

export default App;
