// src/pages/Clients.js
import React, { useState, useEffect } from 'react';
import ClientTable from '../components/clients/ClientTable';
import ClientModal from '../components/clients/ClientModal';
import api from '../services/api';

const Clients = () => {
  const [showModal, setShowModal] = useState(false);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingClient, setEditingClient] = useState(null);

  useEffect(() => {
    cargarClientes();
  }, []);

  const cargarClientes = async () => {
    try {
      setLoading(true);
      const data = await api.getClientes();
      setClientes(data);
    } catch (error) {
      console.error('Error cargando clientes:', error);
      setClientes([
        { 
          id: 1, 
          nombre: 'Juan', 
          apellido: 'Pérez Demo', 
          cedula: '12345678',
          telefono: '3001234567', 
          email: 'juan@demo.com', 
          fecha_registro: '2025-11-27' 
        },
        { 
          id: 2, 
          nombre: 'María', 
          apellido: 'García Demo', 
          cedula: '87654321',
          telefono: '3007654321', 
          email: 'maria@demo.com', 
          fecha_registro: '2025-11-26' 
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCliente = async (clienteData, clientId = null) => {
    try {
      if (clientId) {
        await api.updateCliente(clientId, clienteData);
        alert('✅ Cliente actualizado exitosamente!');
      } else {
        await api.createCliente(clienteData);
        alert('✅ Cliente creado exitosamente!');
      }
      
      await cargarClientes();
      setShowModal(false);
      setEditingClient(null);
    } catch (error) {
      console.error('Error guardando cliente:', error);
      alert('❌ Error al guardar cliente: ' + error.message);
    }
  };

  const handleEditCliente = (cliente) => {
    setEditingClient(cliente);
    setShowModal(true);
  };

  const handleDeleteCliente = async (id) => {
    try {
      await api.deleteCliente(id);
      await cargarClientes();
    } catch (error) {
      console.error('Error eliminando cliente:', error);
      throw error;
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
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-dark mb-0">Gestión de Clientes</h2>
        <button 
          className="btn btn-gym text-white"
          onClick={handleNuevoCliente}
        >
          + Nuevo Cliente
        </button>
      </div>
      
      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      ) : (
        <ClientTable 
          clientes={clientes} 
          onUpdate={cargarClientes}
          onEdit={handleEditCliente}
          onDelete={handleDeleteCliente}
        />
      )}
      
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