// src/components/clients/ClientTable.jsx
import React from "react";

const ClientTable = ({ clientes, onEdit, onDelete }) => {
  const handleDelete = async (id, nombre) => {
    if (window.confirm(`¿Seguro que deseas eliminar a ${nombre}?`)) {
      try {
        await onDelete(id);
        alert("Cliente eliminado correctamente");
      } catch (error) {
        alert("Error al eliminar cliente");
      }
    }
  };

  return (
    <div className="card modern-card">
      <div className="card-body">
        <div className="table-responsive">
          <table className="table modern-table align-middle">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Cédula</th>
                <th>Teléfono</th>
                <th>Email</th>
                <th>Registro</th>
                <th className="text-center">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {clientes.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-3 text-muted">
                    No hay clientes registrados
                  </td>
                </tr>
              ) : (
                clientes.map((cliente) => (
                  <tr key={cliente.id}>
                    <td>{cliente.nombre}</td>
                    <td>{cliente.apellido}</td>
                    <td>{cliente.cedula}</td>
                    <td>{cliente.telefono}</td>
                    <td>{cliente.email}</td>
                    <td>{cliente.fecha_registro}</td>

                    <td className="text-center">
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => onEdit(cliente)}
                      >
                        Editar
                      </button>

                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() =>
                          handleDelete(cliente.id, `${cliente.nombre} ${cliente.apellido}`)
                        }
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ClientTable;
