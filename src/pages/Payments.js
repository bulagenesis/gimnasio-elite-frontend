import React, { useState, useEffect } from 'react';
import PaymentModal from '../components/payments/PaymentModal';
import api from '../services/api';

const Payments = () => {
  const [showModal, setShowModal] = useState(false);
  const [clientes, setClientes] = useState([]);
  const [membresias, setMembresias] = useState([]);
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      
      // Cargar datos reales del backend
      const [clientesData, pagosData] = await Promise.all([
        api.getClientes(),
        api.getPagos?.() || [] // Usar array vacío si no existe
      ]);
      
      setClientes(clientesData);
      
      // Si hay pagos reales del backend, usarlos
      if (pagosData && pagosData.length > 0) {
        // Enriquecer datos de pagos con información de clientes
        const pagosEnriquecidos = pagosData.map(pago => {
          const cliente = clientesData.find(c => c.id === pago.cliente_id);
          return {
            ...pago,
            cliente_nombre: cliente ? `${cliente.nombre} ${cliente.apellido}` : `Cliente ID: ${pago.cliente_id}`,
            cliente_cedula: cliente ? cliente.cedula : 'N/A'
          };
        });
        setPagos(pagosEnriquecidos);
      } else {
        // Datos de ejemplo temporal
        setPagos([
          { 
            id: 1, 
            cliente_id: 1,
            membresia_id: 2,
            valor: 55000, 
            fecha_pago: '2024-01-15',
            cliente_nombre: 'Juan Pérez Demo',
            cliente_cedula: '12345678',
            tipo_pago: 'completo'
          },
          { 
            id: 2, 
            cliente_id: 2,
            membresia_id: 2, 
            valor: 27500, 
            fecha_pago: '2024-01-10',
            cliente_nombre: 'María García Demo',
            cliente_cedula: '87654321',
            tipo_pago: 'fraccionado'
          }
        ]);
      }
    } catch (error) {
      console.error('Error cargando datos:', error);
      // Datos de ejemplo si hay error
      setPagos([
        { 
          id: 1, 
          cliente_id: 1,
          membresia_id: 2,
          valor: 55000, 
          fecha_pago: '2024-01-15',
          cliente_nombre: 'Juan Pérez Demo',
          cliente_cedula: '12345678',
          tipo_pago: 'completo'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleNuevoPago = async (pagoData) => {
    try {
      console.log('Datos del pago recibidos:', pagoData);
      
      // Validar regla de negocio: Dúo no permite fraccionado
      if (pagoData.membresia_id == 3 && pagoData.tipo_pago === 'fraccionado') {
        alert('ERROR: La promoción DÚO no permite pagos fraccionados. Debe pagarse completo.');
        return;
      }

      // Crear pago para el primer cliente
      const pagoPrimerCliente = {
        cliente_id: parseInt(pagoData.cliente_id),
        membresia_id: parseInt(pagoData.membresia_id),
        valor: pagoData.membresia_id == 3 ? 50000 : parseFloat(pagoData.monto),
        fecha_pago: pagoData.fecha_pago
      };

      console.log('Creando pago primer cliente:', pagoPrimerCliente);
      await api.createPago(pagoPrimerCliente);

      // Si es promoción dúo, crear pago para el segundo cliente
      if (pagoData.membresia_id == 3 && pagoData.segundo_cliente_id) {
        const pagoSegundoCliente = {
          cliente_id: parseInt(pagoData.segundo_cliente_id),
          membresia_id: parseInt(pagoData.membresia_id),
          valor: 50000, // Mitad del total
          fecha_pago: pagoData.fecha_pago
        };
        console.log('Creando pago segundo cliente:', pagoSegundoCliente);
        await api.createPago(pagoSegundoCliente);
      }

      await cargarDatos();
      setShowModal(false);
      alert('✅ Pago(s) registrado(s) exitosamente!');
    } catch (error) {
      console.error('Error registrando pago:', error);
      alert('❌ Error al registrar pago: ' + (error.message || 'Verifica la conexión con el backend'));
    }
  };

  const handleEliminarPago = async (pagoId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este pago?')) {
      try {
        await api.deletePago(pagoId);
        await cargarDatos();
        alert('✅ Pago eliminado exitosamente!');
      } catch (error) {
        console.error('Error eliminando pago:', error);
        alert('❌ Error al eliminar pago: ' + error.message);
      }
    }
  };

  const getBadgeColor = (tipoPago) => {
    switch (tipoPago) {
      case 'completo': return 'bg-success';
      case 'fraccionado': return 'bg-warning';
      default: return 'bg-secondary';
    }
  };

  const getMembresiaNombre = (membresiaId) => {
    const membresiasMap = {
      1: 'Día de Gimnasio',
      2: 'Membresía Individual', 
      3: 'Promoción Dúo'
    };
    return membresiasMap[membresiaId] || `Membresía ${membresiaId}`;
  };

  // Calcular estadísticas reales
  const totalRecaudado = pagos.reduce((sum, pago) => sum + (pago.valor || 0), 0);
  const pagosCompletados = pagos.filter(pago => pago.tipo_pago === 'completo').length;
  const pagosFraccionados = pagos.filter(pago => pago.tipo_pago === 'fraccionado').length;
  const totalPagos = pagos.length;

  if (loading) {
    return (
      <div className="container-fluid p-4">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3 text-muted">Cargando datos de pagos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="text-dark mb-0">Control de Pagos</h2>
          <small className="text-muted">Gestión de pagos y membresías - Gimnasio Elite</small>
        </div>
        <button 
          className="btn btn-success"
          onClick={() => setShowModal(true)}
        >
          💳 + Registrar Pago
        </button>
      </div>
      
      {/* Estadísticas Rápidas */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card gym-card">
            <div className="card-body text-center">
              <h6 className="card-title">Total Recaudado</h6>
              <h3 className="text-success">${totalRecaudado.toLocaleString()}</h3>
              <small className="text-muted">Histórico</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card gym-card">
            <div className="card-body text-center">
              <h6 className="card-title">Total Pagos</h6>
              <h3 className="text-primary">{totalPagos}</h3>
              <small className="text-muted">Registrados</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card gym-card">
            <div className="card-body text-center">
              <h6 className="card-title">Pagos Completos</h6>
              <h3 className="text-success">{pagosCompletados}</h3>
              <small className="text-muted">Completados</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card gym-card">
            <div className="card-body text-center">
              <h6 className="card-title">Pagos Fraccionados</h6>
              <h3 className="text-warning">{pagosFraccionados}</h3>
              <small className="text-muted">En proceso</small>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabla de Pagos */}
      <div className="card gym-card">
        <div className="card-header bg-white d-flex justify-content-between align-items-center">
          <h5 className="card-title mb-0">📋 Historial de Pagos</h5>
          <button 
            className="btn btn-outline-primary btn-sm"
            onClick={cargarDatos}
          >
            🔄 Actualizar
          </button>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th>Cliente</th>
                  <th>Cédula</th>
                  <th>Membresía</th>
                  <th>Valor</th>
                  <th>Tipo Pago</th>
                  <th>Fecha Pago</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {pagos.map(pago => (
                  <tr key={pago.id}>
                    <td>
                      <strong>{pago.cliente_nombre}</strong>
                    </td>
                    <td>
                      <small className="text-muted">{pago.cliente_cedula}</small>
                    </td>
                    <td>
                      <span className="badge bg-info">
                        {getMembresiaNombre(pago.membresia_id)}
                      </span>
                    </td>
                    <td>
                      <strong className="text-success">
                        ${(pago.valor || 0).toLocaleString()}
                      </strong>
                    </td>
                    <td>
                      <span className={`badge ${getBadgeColor(pago.tipo_pago)}`}>
                        {pago.tipo_pago || 'completo'}
                      </span>
                    </td>
                    <td>{pago.fecha_pago}</td>
                    <td>
                      <button 
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleEliminarPago(pago.id)}
                        title="Eliminar pago"
                      >
                        🗑️ Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {pagos.length === 0 && (
            <div className="text-center py-5">
              <div className="text-muted">
                <h5>No hay pagos registrados</h5>
                <p>Comienza registrando el primer pago</p>
                <button 
                  className="btn btn-success mt-2"
                  onClick={() => setShowModal(true)}
                >
                  💳 Registrar Primer Pago
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Modal de Pago */}
      {showModal && (
        <PaymentModal 
          onClose={() => setShowModal(false)}
          onSave={handleNuevoPago}
          clientes={clientes}
          membresias={membresias}
        />
      )}
    </div>
  );
};

export default Payments;