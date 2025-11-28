import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    { path: '/productos', icon: '📦', label: 'Productos' },
    { path: '/', icon: '📊', label: 'Dashboard' },
    { path: '/clientes', icon: '👥', label: 'Clientes' },
    { path: '/pagos', icon: '💳', label: 'Pagos' },
  ];

  return (
    <div className="sidebar text-white" style={{ width: '250px', minHeight: '100vh', background: 'linear-gradient(180deg, #2c3e50 0%, #3498db 100%)' }}>
      <div className="p-4">
        <h3 className="mb-0">🏋️ Gimnasio Elite</h3>
      </div>
      
      <nav className="mt-3">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`d-block px-4 py-3 text-white text-decoration-none ${
              location.pathname === item.path ? 'bg-primary' : ''
            }`}
            style={{ 
              backgroundColor: location.pathname === item.path ? '#0d6efd' : 'transparent'
            }}
          >
            <span className="me-3">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;