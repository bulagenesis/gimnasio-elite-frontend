// src/components/clients/ClientModal.jsx
import React, { useState, useEffect } from "react";

const ClientModal = ({ onClose, onSave, editingClient }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    cedula: "",
    telefono: "",
    email: "",
    fecha_registro: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    if (editingClient) {
      setFormData({
        nombre: editingClient.nombre || "",
        apellido: editingClient.apellido || "",
        cedula: editingClient.cedula || "",
        telefono: editingClient.telefono || "",
        email: editingClient.email || "",
        fecha_registro:
          editingClient.fecha_registro ||
          new Date().toISOString().split("T")[0],
      });
    }
  }, [editingClient]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData, editingClient?.id);
  };

  const modalTitle = editingClient ? "Editar Cliente" : "Nuevo Cliente";
  const submitButtonText = editingClient ? "Actualizar Cliente" : "Guardar Cliente";

  return (
    <div className="custom-modal-overlay">
      <div className="custom-modal">
        <div className="custom-modal-header">
          <h5>{modalTitle}</h5>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="custom-modal-body">
            <div className="row">
              <div className="col-md-6 mb-3">
                <label>Nombre *</label>
                <input
                  type="text"
                  name="nombre"
                  className="form-control"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label>Apellido *</label>
                <input
                  type="text"
                  name="apellido"
                  className="form-control"
                  value={formData.apellido}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="mb-3">
              <label>Cédula *</label>
              <input
                type="text"
                name="cedula"
                className="form-control"
                value={formData.cedula}
                onChange={handleChange}
                required
                disabled={!!editingClient}
              />
            </div>

            <div className="mb-3">
              <label>Teléfono *</label>
              <input
                type="tel"
                name="telefono"
                className="form-control"
                value={formData.telefono}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label>Email *</label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label>Fecha de Registro</label>
              <input
                type="date"
                name="fecha_registro"
                className="form-control"
                value={formData.fecha_registro}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="custom-modal-footer">
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
  );
};

export default ClientModal;
