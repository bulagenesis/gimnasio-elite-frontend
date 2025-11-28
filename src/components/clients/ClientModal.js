// src/components/clients/ClientModal.js
import React, { useState, useEffect } from 'react';

const ClientModal = ({ onClose, onSave, editingClient }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    cedula: '',
    telefono: '',
    email: '',
    fecha_registro: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (editingClient) {
      setFormData({
        nombre: editingClient.nombre || '',
        apellido: editingClient.apellido || '',
        cedula: editingClient.cedula || '',
        telefono: editingClient.telefono || '',
        email: editingClient.email || '',
        fecha_registro: editingClient.fecha_registro || new Date().toISOString().split('T')[0]
      });
    }
  }, [editingClient]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData, editingClient?.id);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const modalTitle = editingClient ? 'Editar Cliente' : 'Nuevo Cliente';
  const submitButtonText = editingClient ? 'Actualizar Cliente' : 'Guardar Cliente';

  return (
    <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{modalTitle}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Nombre *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Apellido *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              <div className="mb-3">
                <label className="form-label">Cédula *</label>
                <input
                  type="text"
                  className="form-control"
                  name="cedula"
                  value={formData.cedula}
                  onChange={handleChange}
                  required
                  disabled={editingClient}
                />
              </div>
              
              <div className="mb-3">
                <label className="form-label">Teléfono *</label>
                <input
                  type="tel"
                  className="form-control"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="mb-3">
                <label className="form-label">Email *</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="mb-3">
                <label className="form-label">Fecha de Registro</label>
                <input
                  type="date"
                  className="form-control"
                  name="fecha_registro"
                  value={formData.fecha_registro}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary">
                {submitButtonText}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ClientModal;