import React from 'react';

const Header = () => {
  return (
    <header className="bg-white shadow-sm border-bottom">
      <div className="container-fluid">
        <div className="d-flex justify-content-between align-items-center py-3">
          <div>
            <h4 className="mb-0 text-dark">Bienvenido Administrador</h4>
            <small className="text-muted">Panel de Control Gimnasio Elite</small>
          </div>
          <div className="d-flex align-items-center gap-3">
            <button className="btn btn-outline-secondary btn-sm">
              🔔 Notificaciones
            </button>
            <div className="d-flex align-items-center">
              <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-2" 
                   style={{ width: '35px', height: '35px' }}>
                <span className="text-white">A</span>
              </div>
              <span className="text-dark">Administrador</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;