// src/components/clients/ClientTable.js
import React from 'react';

const ClientTable = ({ clientes, onUpdate, onEdit, onDelete }) => {
  const handleDelete = async (id, nombre) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar al cliente ${nombre}?`)) {
      try {
        await onDelete(id);
        alert('Cliente eliminado exitosamente');
      } catch (error) {
        alert('Error al eliminar cliente');
      }
    }
  };

  return (
    <div className="card">
      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Cédula</th>
                <th>Teléfono</th>
                <th>Email</th>
                <th>Fecha Registro</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map(cliente => (
                <tr key={cliente.id}>
                  <td>{cliente.nombre}</td>
                  <td>{cliente.apellido}</td>
                  <td>{cliente.cedula}</td>
                  <td>{cliente.telefono}</td>
                  <td>{cliente.email}</td>
                  <td>{cliente.fecha_registro}</td>
                  <td>
                    <button 
                      className="btn btn-sm btn-outline-primary me-1"
                      onClick={() => onEdit(cliente)}
                    >
                      Editar
                    </button>
                    <button 
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(cliente.id, `${cliente.nombre} ${cliente.apellido}`)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ClientTable;