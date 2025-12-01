import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/', icon: '📊', label: 'Dashboard' },
    { path: '/clientes', icon: '👥', label: 'Clientes' },
    { path: '/pagos', icon: '💳', label: 'Pagos' },
    { path: '/ventas', icon: '🛍️', label: 'Ventas' },
    { path: '/productos', icon: '📦', label: 'Productos' },
  ];

  return (
    <div className="sidebar d-flex flex-column text-white">

      {/* Branding */}
      <div className="p-4 border-bottom border-white border-opacity-25">
        <h3 className="fw-bold mb-1">🏋️ Gimnasio Elite</h3>
        <small className="opacity-75">Sistema de Gestión</small>
      </div>

      {/* Navegación */}
      <nav className="mt-3 flex-grow-1">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-item d-flex align-items-center px-4 py-2 text-decoration-none 
                ${isActive ? "active" : "text-white opacity-75"}`}
            >
              <span className="me-3 fs-5">{item.icon}</span>
              <span className="fw-semibold">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="mt-auto p-3 border-top border-white border-opacity-25">
        <small className="opacity-75">💪 Potenciando tu éxito</small>
      </div>

    </div>
  );
};

export default Sidebar;
