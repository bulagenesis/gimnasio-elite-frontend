import React from 'react';

const Header = () => {
  return (
    <header className="bg-white shadow-sm border-bottom border-light py-2">
      <div className="container-fluid">
        <div className="d-flex justify-content-between align-items-center">

          {/* Texto izquierda */}
          <div>
            <h4 className="mb-0 fw-semibold text-dark">Bienvenido Administrador</h4>
            <small className="text-muted">Panel de Control • Gimnasio Elite</small>
          </div>

          {/* Controles derecha */}
          <div className="d-flex align-items-center gap-3">

            {/* Botón notificaciones */}
            <button className="btn btn-light border btn-sm d-flex align-items-center">
              <span className="me-1">🔔</span> Notificaciones
            </button>

            {/* Perfil usuario */}
            <div className="d-flex align-items-center">
              <div
                className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-2"
                style={{ width: '36px', height: '36px' }}
              >
                <span className="text-white fw-bold">A</span>
              </div>
              <span className="text-dark fw-semibold">Administrador</span>
            </div>

          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
