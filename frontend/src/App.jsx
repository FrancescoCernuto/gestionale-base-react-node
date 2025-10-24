import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Fatture from './pages/Fatture';
import Utenze from './pages/Utenze';
import FornitoriBeni from './pages/FornitoriBeni';
import FornitoriServizi from './pages/FornitoriServizi';
import TestApi from './pages/TestApi'; // 👈 import nuovo
import { StoreProvider } from './context/StoreContext';

export default function App() {
  return (
    <StoreProvider>
      <div className="d-flex" style={{ minHeight: '100vh' }}>
        <Sidebar />
        <main className="flex-grow-1 p-4 bg-light">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/fatture" element={<Fatture />} />
            <Route path="/utenze" element={<Utenze />} />
            <Route path="/fornitori-beni" element={<FornitoriBeni />} />
            <Route path="/fornitori-servizi" element={<FornitoriServizi />} />
            <Route path="/test-api" element={<TestApi />} /> {/* 👈 nuova rotta */}
          </Routes>
        </main>
      </div>
    </StoreProvider>
  );
}

