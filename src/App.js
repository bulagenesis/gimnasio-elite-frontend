import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import Payments from './pages/Payments';
import Products from './pages/Products';
import Sales from './pages/Sales';   // <-- IMPORTANTE

import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/custom.css';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/clientes" element={<Clients />} />
          <Route path="/pagos" element={<Payments />} />
          <Route path="/productos" element={<Products />} />

          {/* ✅ NUEVA RUTA PARA VENTAS */}
          <Route path="/ventas" element={<Sales />} />

        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
