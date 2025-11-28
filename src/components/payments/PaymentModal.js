import React, { useState, useEffect } from 'react';

const PaymentModal = ({ onClose, onSave, clientes, membresias = [] }) => {
  const [formData, setFormData] = useState({
    cliente_id: '',
    membresia_id: '',
    monto: '',
    tipo_pago: 'completo',
    fecha_pago: new Date().toISOString().split('T')[0],
    segundo_cliente_id: '' // Para la promoción dúo
  });

  const [mostrarSegundoCliente, setMostrarSegundoCliente] = useState(false);

  // Membresías predefinidas según las reglas
  const membresiasPredefinidas = [
    { id: 1, nombre: 'Día de Gimnasio', precio: 4000, duracion_meses: 0.033 },
    { id: 2, nombre: 'Membresía Individual', precio: 55000, duracion_meses: 1 },
    { id: 3, nombre: 'Promoción Dúo', precio: 100000, duracion_meses: 1 }
  ];

  useEffect(() => {
    // Cuando cambia la membresía, actualizar monto automáticamente
    if (formData.membresia_id) {
      const membresia = membresiasPredefinidas.find(m => m.id == formData.membresia_id);
      if (membresia) {
        setFormData(prev => ({
          ...prev,
          monto: membresia.precio.toString()
        }));
      }
      
      // Mostrar campo para segundo cliente solo si es promoción dúo
      setMostrarSegundoCliente(formData.membresia_id == 3);
    }
  }, [formData.membresia_id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validaciones
    if (!formData.cliente_id) {
      alert('Por favor selecciona un cliente');
      return;
    }
    
    if (!formData.membresia_id) {
      alert('Por favor selecciona una membresía');
      return;
    }

    // Validar promoción dúo
    if (formData.membresia_id == 3 && !formData.segundo_cliente_id) {
      alert('Para la promoción dúo debes seleccionar el segundo cliente');
      return;
    }

    // Validar que no sea el mismo cliente
    if (formData.membresia_id == 3 && formData.cliente_id == formData.segundo_cliente_id) {
      alert('Debes seleccionar dos clientes diferentes para la promoción dúo');
      return;
    }
    
    if (onSave) onSave(formData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Encontrar el cliente seleccionado
  const clienteSeleccionado = clientes.find(cliente => cliente.id == formData.cliente_id);
  const segundoClienteSeleccionado = clientes.find(cliente => cliente.id == formData.segundo_cliente_id);
  const membresiaSeleccionada = membresiasPredefinidas.find(m => m.id == formData.membresia_id);

  // Filtrar clientes disponibles para segundo cliente (excluir el primero)
  const clientesDisponibles = clientes.filter(cliente => cliente.id != formData.cliente_id);

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Registrar Pago - Gimnasio Elite</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="row g-3">
                
                {/* Selección de Membresía */}
                <div className="col-md-6">
                  <label className="form-label">Tipo de Membresía *</label>
                  <select
                    className="form-select"
                    value={formData.membresia_id}
                    onChange={(e) => handleChange('membresia_id', e.target.value)}
                    required
                  >
                    <option value="">Seleccionar membresía</option>
                    {membresiasPredefinidas.map(membresia => (
                      <option key={membresia.id} value={membresia.id}>
                        {membresia.nombre} - ${membresia.precio.toLocaleString()}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tipo de Pago */}
                <div className="col-md-6">
                  <label className="form-label">Modalidad de Pago</label>
                  <select
                    className="form-select"
                    value={formData.tipo_pago}
                    onChange={(e) => handleChange('tipo_pago', e.target.value)}
                    disabled={formData.membresia_id == 3} // Dúo no permite fraccionado
                  >
                    <option value="completo">Pago Completo</option>
                    <option value="fraccionado">Pago Fraccionado</option>
                  </select>
                </div>

                {/* Primer Cliente */}
                <div className="col-md-6">
                  <label className="form-label">Primer Cliente *</label>
                  <select
                    className="form-select"
                    value={formData.cliente_id}
                    onChange={(e) => handleChange('cliente_id', e.target.value)}
                    required
                  >
                    <option value="">Seleccionar cliente</option>
                    {clientes.map(cliente => (
                      <option key={cliente.id} value={cliente.id}>
                        {cliente.nombre} {cliente.apellido} - {cliente.cedula}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Segundo Cliente (solo para promoción dúo) */}
                {mostrarSegundoCliente && (
                  <div className="col-md-6">
                    <label className="form-label">Segundo Cliente *</label>
                    <select
                      className="form-select"
                      value={formData.segundo_cliente_id}
                      onChange={(e) => handleChange('segundo_cliente_id', e.target.value)}
                      required
                    >
                      <option value="">Seleccionar segundo cliente</option>
                      {clientesDisponibles.map(cliente => (
                        <option key={cliente.id} value={cliente.id}>
                          {cliente.nombre} {cliente.apellido} - {cliente.cedula}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Monto (automático) */}
                <div className="col-md-6">
                  <label className="form-label">Monto ($)</label>
                  <input
                    type="text"
                    className="form-control bg-light"
                    value={formData.monto ? `$${parseInt(formData.monto).toLocaleString()}` : ''}
                    readOnly
                  />
                  <small className="text-muted">Monto automático según membresía</small>
                </div>
                
                {/* Fecha de Pago */}
                <div className="col-md-6">
                  <label className="form-label">Fecha de Pago</label>
                  <input
                    type="date"
                    className="form-control"
                    value={formData.fecha_pago}
                    onChange={(e) => handleChange('fecha_pago', e.target.value)}
                  />
                </div>
                
                {/* Información y Reglas */}
                <div className="col-12">
                  <div className="card bg-light">
                    <div className="card-body">
                      <h6 className="card-title">📋 Información de la Membresía</h6>
                      
                      {membresiaSeleccionada && (
                        <div className="row small mb-2">
                          <div className="col-md-4">
                            <strong>Membresía:</strong> {membresiaSeleccionada.nombre}
                          </div>
                          <div className="col-md-4">
                            <strong>Precio:</strong> ${membresiaSeleccionada.precio.toLocaleString()}
                          </div>
                          <div className="col-md-4">
                            <strong>Duración:</strong> {membresiaSeleccionada.duracion_meses} mes(es)
                          </div>
                        </div>
                      )}

                      {/* Reglas de Fraccionado */}
                      {formData.tipo_pago === 'fraccionado' && formData.membresia_id == 2 && (
                        <div className="alert alert-warning mt-2 mb-0 py-2">
                          <strong>📋 Pago Fraccionado - Individual:</strong>
                          <ul className="mb-0 mt-1 small">
                            <li>Abono inicial al inicio del mes</li>
                            <li>Saldo restante <strong>antes del día 15</strong></li>
                            <li>Las faltas <strong>NO afectan</strong> la duración</li>
                          </ul>
                        </div>
                      )}

                      {/* Regla Dúo */}
                      {formData.membresia_id == 3 && (
                        <div className="alert alert-info mt-2 mb-0 py-2">
                          <strong>🏋️‍♂️ Promoción DÚO:</strong>
                          <ul className="mb-0 mt-1 small">
                            <li>Dos personas por <strong>$100,000</strong> (antes $110,000)</li>
                            <li>Pago <strong>COMPLETO</strong> al inicio</li>
                            <li>No permite pagos fraccionados</li>
                            <li>Ambos clientes acceso completo por 1 mes</li>
                          </ul>
                        </div>
                      )}

                      {/* Advertencia Dúo con Fraccionado */}
                      {formData.membresia_id == 3 && formData.tipo_pago === 'fraccionado' && (
                        <div className="alert alert-danger mt-2 mb-0 py-2">
                          <strong>⚠️ Atención:</strong> La promoción <strong>DÚO</strong> requiere pago <strong>COMPLETO</strong> según las reglas del gimnasio.
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Información de Clientes Seleccionados */}
                {(clienteSeleccionado || segundoClienteSeleccionado) && (
                  <div className="col-12">
                    <div className="card border-primary">
                      <div className="card-header bg-primary text-white py-1">
                        <small>👥 Clientes Seleccionados</small>
                      </div>
                      <div className="card-body py-2">
                        <div className="row small">
                          {clienteSeleccionado && (
                            <div className="col-md-6">
                              <strong>Primer Cliente:</strong><br />
                              {clienteSeleccionado.nombre} {clienteSeleccionado.apellido}<br />
                              <small>Cédula: {clienteSeleccionado.cedula}</small>
                            </div>
                          )}
                          {segundoClienteSeleccionado && (
                            <div className="col-md-6">
                              <strong>Segundo Cliente:</strong><br />
                              {segundoClienteSeleccionado.nombre} {segundoClienteSeleccionado.apellido}<br />
                              <small>Cédula: {segundoClienteSeleccionado.cedula}</small>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancelar
              </button>
              <button 
                type="submit" 
                className="btn btn-success"
                disabled={formData.membresia_id == 3 && formData.tipo_pago === 'fraccionado'}
              >
                💳 Registrar Pago
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

 export default PaymentModal;