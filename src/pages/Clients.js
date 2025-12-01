// src/pages/Clients.js
import React, { useState, useEffect } from "react";
import ClientTable from "../components/clients/ClientTable";
import ClientModal from "../components/clients/ClientModal";
import api from "../services/api";
import "../components/clients/client.css"; // <--- asegura que se carguen los estilos

const Clients = () => {
  const [showModal, setShowModal] = useState(false);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingClient, setEditingClient] = useState(null);

  useEffect(() => {
    cargarClientes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cargarClientes = async () => {
    try {
      setLoading(true);
      const data = await api.getClientes();
      setClientes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error cargando clientes:", error);
      alert("Error al cargar clientes: " + (error?.message || "Error desconocido"));
      setClientes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCliente = async (clienteData, clientId = null) => {
    try {
      if (clientId) {
        await api.updateCliente(clientId, clienteData);
        alert("✅ Cliente actualizado exitosamente!");
      } else {
        await api.createCliente(clienteData);
        alert("✅ Cliente creado exitosamente!");
      }

      await cargarClientes();
      setShowModal(false);
      setEditingClient(null);
    } catch (error) {
      console.error("Error guardando cliente:", error);
      alert("❌ Error al guardar cliente: " + (error?.message || "Error desconocido"));
    }
  };

  const handleEditCliente = (cliente) => {
    setEditingClient(cliente);
    setShowModal(true);
  };

  const handleDeleteCliente = async (id) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar este cliente?")) return;

    try {
      await api.deleteCliente(id);
      await cargarClientes();
      alert("✅ Cliente eliminado exitosamente!");
    } catch (error) {
      console.error("Error eliminando cliente:", error);
      alert("❌ Error al eliminar cliente: " + (error?.message || "Error desconocido"));
    }
  };

  const handleNuevoCliente = () => {
    setEditingClient(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingClient(null);
  };

  return (
    <div className="page-container p-4">
      {/* Encabezado */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-0">Gestión de Clientes</h2>
          <small className="text-muted">Registro y administración de clientes — Gimnasio Elite</small>
        </div>

        <div>
          <button
            className="btn btn-primary"
            onClick={handleNuevoCliente}
            disabled={loading}
            title="Agregar nuevo cliente"
          >
            👤 + Nuevo Cliente
          </button>
        </div>
      </div>

      {/* Cargando */}
      {loading ? (
        <div className="d-flex flex-column align-items-center py-5">
          <div className="spinner-border text-primary" role="status" aria-hidden="true"></div>
          <span className="mt-3 text-muted">Cargando clientes...</span>
        </div>
      ) : (
        <div className="modern-card mb-4">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">📋 Lista de Clientes</h5>
              <div className="d-flex align-items-center gap-2">
                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={cargarClientes}
                  title="Refrescar lista"
                >
                  🔄 Actualizar
                </button>
                <span className="badge bg-primary">{clientes.length} clientes</span>
              </div>
            </div>

            {/* Contenido */}
            {clientes.length === 0 ? (
              <div className="text-center py-5">
                <p className="mb-3 text-muted">No hay clientes registrados</p>
                <button className="btn btn-primary" onClick={handleNuevoCliente}>
                  Agregar Primer Cliente
                </button>
              </div>
            ) : (
              <ClientTable
                clientes={clientes}
                onEdit={handleEditCliente}
                onDelete={handleDeleteCliente}
              />
            )}
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <ClientModal
          onClose={handleCloseModal}
          onSave={handleSaveCliente}
          editingClient={editingClient}
        />
      )}
    </div>
  );
};

export default Clients;
