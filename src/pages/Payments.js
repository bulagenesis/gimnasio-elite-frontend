import React, { useState, useEffect } from 'react';
import PaymentModal from '../components/payments/PaymentModal';
import api from '../services/api';

const Payments = () => {
  const [showModal, setShowModal] = useState(false);
  const [clientes, setClientes] = useState([]);
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(true);

  const membresiasFijas = [
    {
      id: 1,
      nombre: 'Día de Gimnasio',
      precio: 4000,
      duracion_meses: 0,
      tipo: 'dia'
    },
    {
      id: 2,
      nombre: 'Membresía Individual',
      precio: 55000,
      duracion_meses: 1,
      tipo: 'individual'
    },
    {
      id: 3,
      nombre: 'Promoción Dúo',
      precio: 100000,
      duracion_meses: 1,
      tipo: 'duo'
    }
  ];

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      
      const [clientesData, pagosData] = await Promise.all([
        api.getClientes(),
        api.getPagos()
      ]);
      
      setClientes(clientesData);
      
      const pagosEnriquecidos = pagosData.map(pago => {
        const cliente = clientesData.find(c => c.id === pago.cliente_id);
        
        return {
          ...pago,
          cliente_nombre: cliente ? `${cliente.nombre} ${cliente.apellido}` : `Cliente ID: ${pago.cliente_id}`,
          cliente_cedula: cliente ? cliente.cedula : 'N/A'
        };
      });
      
      setPagos(pagosEnriquecidos);
      
    } catch (error) {
      console.error('Error cargando datos:', error);
      alert('Error al cargar datos: ' + error.message);
      setClientes([]);
      setPagos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleNuevoPago = async (pagoData) => {
    try {
      console.log('Datos del pago recibidos:', pagoData);
      
      const cliente = clientes.find(c => c.id === parseInt(pagoData.cliente_id));
      if (!cliente) {
        alert('❌ Error: Cliente no encontrado');
        return;
      }

      // CORREGIDO: Incluir tipo_pago y es_abono_inicial
      const pagoPrimerCliente = {
        cliente_id: parseInt(pagoData.cliente_id),
        valor: parseFloat(pagoData.monto),
        fecha_pago: pagoData.fecha_pago,
        tipo_pago: pagoData.tipo_pago,
        es_abono_inicial: pagoData.tipo_pago === 'fraccionado'
      };

      console.log('Creando pago primer cliente:', pagoPrimerCliente);
      await api.createPago(pagoPrimerCliente);

      // Si hay segundo cliente (promoción dúo)
      if (pagoData.segundo_cliente_id) {
        const segundoCliente = clientes.find(c => c.id === parseInt(pagoData.segundo_cliente_id));
        if (segundoCliente) {
          const pagoSegundoCliente = {
            cliente_id: parseInt(pagoData.segundo_cliente_id),
            valor: parseFloat(pagoData.monto),
            fecha_pago: pagoData.fecha_pago,
            tipo_pago: pagoData.tipo_pago,
            es_abono_inicial: pagoData.tipo_pago === 'fraccionado'
          };
          console.log('Creando pago segundo cliente:', pagoSegundoCliente);
          await api.createPago(pagoSegundoCliente);
        }
      }

      await cargarDatos();
      setShowModal(false);
      
      if (pagoData.tipo_pago === 'fraccionado') {
        alert('✅ Abono inicial registrado exitosamente!\n\n💰 Saldo pendiente: $27,500 (debe pagarse antes del día 15)');
      } else {
        alert('✅ Pago registrado exitosamente!');
      }
    } catch (error) {
      console.error('Error registrando pago:', error);
      
      let errorMessage = 'Error desconocido';
      if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      alert('❌ Error al registrar pago: ' + errorMessage);
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

  const totalRecaudado = pagos.reduce((sum, pago) => sum + (pago.valor || 0), 0);
  const totalPagos = pagos.length;

  const getEstadisticasPorTipo = () => {
    const diaPagos = pagos.filter(pago => pago.valor === 4000);
    const individualPagos = pagos.filter(pago => pago.valor === 55000 || (pago.valor === 27500 && pago.tipo_pago === 'fraccionado'));
    const duoPagos = pagos.filter(pago => pago.valor === 100000);
    const otrosPagos = pagos.filter(pago => ![4000, 55000, 27500, 100000].includes(pago.valor));

    return [
      {
        nombre: 'Día de Gimnasio',
        cantidad: diaPagos.length,
        total: diaPagos.reduce((sum, pago) => sum + pago.valor, 0),
        precio: 4000
      },
      {
        nombre: 'Membresía Individual',
        cantidad: individualPagos.length,
        total: individualPagos.reduce((sum, pago) => sum + pago.valor, 0),
        precio: 55000
      },
      {
        nombre: 'Promoción Dúo',
        cantidad: duoPagos.length,
        total: duoPagos.reduce((sum, pago) => sum + pago.valor, 0),
        precio: 100000
      },
      {
        nombre: 'Otros Pagos',
        cantidad: otrosPagos.length,
        total: otrosPagos.reduce((sum, pago) => sum + pago.valor, 0),
        precio: 0
      }
    ].filter(item => item.cantidad > 0);
  };

  const estadisticasPorTipo = getEstadisticasPorTipo();

  if (loading) {
    return (
      <div className="container-fluid p-4">
        <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <span className="ms-2">Cargando datos de pagos...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="text-dark mb-0">Control de Pagos</h2>
          <small className="text-muted">Gestión de pagos - Gimnasio Elite</small>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => setShowModal(true)}
          disabled={clientes.length === 0}
        >
          💳 + Registrar Pago
        </button>
      </div>
      
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
              <h6 className="card-title">Clientes</h6>
              <h3 className="text-info">{clientes.length}</h3>
              <small className="text-muted">Registrados</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card gym-card">
            <div className="card-body text-center">
              <h6 className="card-title">Membresías</h6>
              <h3 className="text-warning">{membresiasFijas.length}</h3>
              <small className="text-muted">Disponibles</small>
            </div>
          </div>
        </div>
      </div>

      {estadisticasPorTipo.length > 0 && (
        <div className="row mb-4">
          <div className="col-12">
            <div className="card gym-card">
              <div className="card-header bg-white">
                <h6 className="card-title mb-0">📊 Distribución de Pagos</h6>
              </div>
              <div className="card-body">
                <div className="row">
                  {estadisticasPorTipo.map((estadistica, index) => (
                    <div key={index} className="col-md-3 mb-3">
                      <div className="text-center p-3 border rounded">
                        <h6 className="text-muted">{estadistica.nombre}</h6>
                        <h5 className="text-primary">{estadistica.cantidad} pagos</h5>
                        <small className="text-success">
                          ${estadistica.total.toLocaleString()}
                        </small>
                        {estadistica.precio > 0 && (
                          <div className="mt-2">
                            <small className="text-muted">
                              ${estadistica.precio?.toLocaleString()} c/u
                            </small>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="card gym-card">
        <div className="card-header bg-white d-flex justify-content-between align-items-center">
          <h5 className="card-title mb-0">📋 Historial de Pagos</h5>
          <div>
            <button 
              className="btn btn-outline-secondary btn-sm me-2"
              onClick={cargarDatos}
            >
              🔄 Actualizar
            </button>
            <span className="badge bg-primary">
              {pagos.length} pagos
            </span>
          </div>
        </div>
        <div className="card-body">
          {pagos.length === 0 ? (
            <div className="text-center py-5">
              <div className="text-muted">
                <h5>No hay pagos registrados</h5>
                <p>Comienza registrando el primer pago</p>
                {clientes.length === 0 && (
                  <div className="alert alert-warning mt-3">
                    <small>⚠️ Necesitas tener clientes registrados para crear pagos</small>
                  </div>
                )}
                <button 
                  className="btn btn-primary mt-2"
                  onClick={() => setShowModal(true)}
                  disabled={clientes.length === 0}
                >
                  💳 Registrar Primer Pago
                </button>
              </div>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Cliente</th>
                    <th>Cédula</th>
                    <th>Valor</th>
                    <th>Tipo</th>
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
                        <strong className="text-success">
                          ${(pago.valor || 0).toLocaleString()}
                        </strong>
                        {pago.tipo_pago === 'fraccionado' && pago.es_abono_inicial && (
                          <div>
                            <small className="text-warning">(Abono inicial)</small>
                          </div>
                        )}
                      </td>
                      <td>
                        <span className={`badge ${
                          pago.tipo_pago === 'fraccionado' 
                            ? 'bg-warning' 
                            : pago.valor === 4000 
                            ? 'bg-info' 
                            : pago.valor === 100000 
                            ? 'bg-success' 
                            : 'bg-primary'
                        }`}>
                          {pago.tipo_pago === 'fraccionado' 
                            ? 'Fraccionado' 
                            : pago.valor === 4000 
                            ? 'Día' 
                            : pago.valor === 100000 
                            ? 'Dúo' 
                            : 'Individual'
                          }
                        </span>
                      </td>
                      <td>{pago.fecha_pago}</td>
                      <td>
                        <button 
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleEliminarPago(pago.id)}
                          title="Eliminar pago"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      
      {showModal && (
        <PaymentModal 
          onClose={() => setShowModal(false)}
          onSave={handleNuevoPago}
          clientes={clientes}
        />
      )}
    </div>
  );
};

export default Payments;