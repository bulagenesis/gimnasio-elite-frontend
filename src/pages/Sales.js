import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Sales = () => {
  const [productos, setProductos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    metodo_pago: 'efectivo',
    cliente_id: ''
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [productosData, clientesData] = await Promise.all([
        api.getProductos(),
        api.getClientes()
      ]);
      
      setProductos(productosData);
      setClientes(clientesData);
    } catch (error) {
      console.error('Error cargando datos:', error);
      alert('Error al cargar datos: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const agregarAlCarrito = (producto) => {
    if (producto.stock <= 0) {
      alert('❌ Producto sin stock disponible');
      return;
    }

    const productoEnCarrito = carrito.find(item => item.producto_id === producto.id);
    
    if (productoEnCarrito) {
      // Si ya está en el carrito, aumentar cantidad
      if (productoEnCarrito.cantidad >= producto.stock) {
        alert('❌ No hay suficiente stock disponible');
        return;
      }
      setCarrito(carrito.map(item =>
        item.producto_id === producto.id
          ? { 
              ...item, 
              cantidad: item.cantidad + 1, 
              subtotal: (item.cantidad + 1) * item.precio_unitario 
            }
          : item
      ));
    } else {
      // Agregar nuevo producto al carrito
      setCarrito([
        ...carrito,
        {
          producto_id: producto.id,
          nombre: producto.nombre,
          precio_unitario: producto.precio, // ✅ CORREGIDO: usando 'precio'
          cantidad: 1,
          subtotal: producto.precio, // ✅ CORREGIDO: usando 'precio'
          stock_disponible: producto.stock, // ✅ CORREGIDO: usando 'stock'
          categoria: producto.categoria // ✅ AGREGADO: categoría del producto
        }
      ]);
    }
  };

  const eliminarDelCarrito = (productoId) => {
    setCarrito(carrito.filter(item => item.producto_id !== productoId));
  };

  const actualizarCantidad = (productoId, nuevaCantidad) => {
    if (nuevaCantidad <= 0) {
      eliminarDelCarrito(productoId);
      return;
    }

    const producto = productos.find(p => p.id === productoId);
    if (nuevaCantidad > producto.stock) {
      alert('❌ No hay suficiente stock disponible');
      return;
    }

    setCarrito(carrito.map(item =>
      item.producto_id === productoId
        ? { 
            ...item, 
            cantidad: nuevaCantidad, 
            subtotal: nuevaCantidad * item.precio_unitario 
          }
        : item
    ));
  };

  const calcularTotal = () => {
    return carrito.reduce((total, item) => total + item.subtotal, 0);
  };

  const handleFinalizarVenta = async () => {
    if (carrito.length === 0) {
      alert('❌ El carrito está vacío');
      return;
    }

    if (!formData.metodo_pago) {
      alert('❌ Selecciona un método de pago');
      return;
    }

    try {
      const ventaData = {
        productos: carrito.map(item => ({
          producto_id: item.producto_id,
          cantidad: item.cantidad,
          precio_unitario: item.precio_unitario
        })),
        metodo_pago: formData.metodo_pago,
        cliente_id: formData.cliente_id || null
      };

      console.log('Enviando venta:', ventaData);
      await api.createVenta(ventaData);
      
      alert('✅ Venta registrada exitosamente!');
      setCarrito([]);
      setFormData({ metodo_pago: 'efectivo', cliente_id: '' });
      setShowModal(false);
      await cargarDatos(); // Recargar productos para actualizar stock
    } catch (error) {
      console.error('Error registrando venta:', error);
      let errorMessage = 'Error desconocido';
      if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.message) {
        errorMessage = error.message;
      }
      alert('❌ Error al registrar venta: ' + errorMessage);
    }
  };

  const getCategoriaIcon = (categoria) => {
    const categorias = {
      'Suplementos': '🥤',
      'Bebidas': '💧', 
      'Bocadillos': '🍫',
      'Merchandising': '👕',
      'Accesorios': '🏋️'
    };
    return categorias[categoria] || '📦';
  };

  if (loading) {
    return (
      <div className="container-fluid p-4">
        <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <span className="ms-2">Cargando productos...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="text-dark mb-0">Punto de Venta</h2>
          <small className="text-muted">Registro de ventas de productos - Gimnasio Elite</small>
        </div>
        <div className="d-flex align-items-center">
          <span className="badge bg-primary me-3">
            {carrito.length} productos en carrito
          </span>
          <button 
            className="btn btn-success"
            onClick={() => setShowModal(true)}
            disabled={carrito.length === 0}
          >
            🛒 Finalizar Venta
          </button>
        </div>
      </div>

      <div className="row">
        {/* Lista de Productos */}
        <div className="col-md-8">
          <div className="card gym-card">
            <div className="card-header bg-white">
              <h5 className="card-title mb-0">🛍️ Productos Disponibles</h5>
            </div>
            <div className="card-body">
              {productos.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-muted">No hay productos registrados</p>
                  <small>Agrega productos primero en la sección de Productos</small>
                </div>
              ) : (
                <div className="row">
                  {productos.map(producto => (
                    <div key={producto.id} className="col-md-6 col-lg-4 mb-3">
                      <div className={`card h-100 ${producto.stock <= 0 ? 'border-danger' : 'border-success'}`}>
                        <div className="card-body">
                          <h6 className="card-title">{producto.nombre}</h6>
                          <p className="card-text">
                            <span className="badge bg-secondary mb-2">
                              {getCategoriaIcon(producto.categoria)} {producto.categoria}
                            </span>
                          </p>
                          <p className="card-text">
                            <strong className="text-success">${producto.precio?.toLocaleString()}</strong>
                          </p>
                          <p className="card-text">
                            <small className={`badge ${
                              producto.stock > 10 ? 'bg-success' : 
                              producto.stock > 0 ? 'bg-warning' : 'bg-danger'
                            }`}>
                              Stock: {producto.stock} unidades
                            </small>
                          </p>
                          {producto.descripcion && (
                            <p className="card-text">
                              <small className="text-muted">{producto.descripcion}</small>
                            </p>
                          )}
                          <button
                            className="btn btn-primary btn-sm w-100"
                            onClick={() => agregarAlCarrito(producto)}
                            disabled={producto.stock <= 0}
                          >
                            {producto.stock > 0 ? '➕ Agregar al Carrito' : '❌ Sin Stock'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Carrito de Compras */}
        <div className="col-md-4">
          <div className="card gym-card sticky-top">
            <div className="card-header bg-white">
              <h5 className="card-title mb-0">🛒 Carrito de Compras</h5>
            </div>
            <div className="card-body">
              {carrito.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-muted">El carrito está vacío</p>
                  <small>Agrega productos desde la lista</small>
                </div>
              ) : (
                <>
                  <div className="table-responsive">
                    <table className="table table-sm">
                      <thead>
                        <tr>
                          <th>Producto</th>
                          <th>Cant</th>
                          <th>Subtotal</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {carrito.map(item => (
                          <tr key={item.producto_id}>
                            <td>
                              <small className="fw-semibold">{item.nombre}</small>
                              <br />
                              <small className="text-muted">
                                ${item.precio_unitario?.toLocaleString()} c/u
                              </small>
                            </td>
                            <td>
                              <div className="input-group input-group-sm">
                                <button
                                  className="btn btn-outline-secondary"
                                  onClick={() => actualizarCantidad(item.producto_id, item.cantidad - 1)}
                                >
                                  -
                                </button>
                                <input
                                  type="number"
                                  className="form-control text-center"
                                  value={item.cantidad}
                                  onChange={(e) => actualizarCantidad(item.producto_id, parseInt(e.target.value) || 0)}
                                  min="1"
                                  max={item.stock_disponible}
                                  style={{ width: '50px' }}
                                />
                                <button
                                  className="btn btn-outline-secondary"
                                  onClick={() => actualizarCantidad(item.producto_id, item.cantidad + 1)}
                                  disabled={item.cantidad >= item.stock_disponible}
                                >
                                  +
                                </button>
                              </div>
                            </td>
                            <td className="text-success fw-bold">
                              ${item.subtotal?.toLocaleString()}
                            </td>
                            <td>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => eliminarDelCarrito(item.producto_id)}
                                title="Eliminar del carrito"
                              >
                                🗑️
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="border-top pt-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h6 className="mb-0">Subtotal:</h6>
                      <h6 className="mb-0">${calcularTotal().toLocaleString()}</h6>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <h5 className="mb-0">Total:</h5>
                      <h4 className="text-success mb-0">${calcularTotal().toLocaleString()}</h4>
                    </div>
                    <button 
                      className="btn btn-success w-100 mt-3"
                      onClick={() => setShowModal(true)}
                    >
                      💳 Proceder al Pago
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Finalizar Venta */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Finalizar Venta</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Método de Pago *</label>
                  <select
                    className="form-select"
                    value={formData.metodo_pago}
                    onChange={(e) => setFormData(prev => ({ ...prev, metodo_pago: e.target.value }))}
                  >
                    <option value="efectivo">💵 Efectivo</option>
                    <option value="tarjeta">💳 Tarjeta</option>
                    <option value="transferencia">📲 Transferencia</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Cliente (Opcional)</label>
                  <select
                    className="form-select"
                    value={formData.cliente_id}
                    onChange={(e) => setFormData(prev => ({ ...prev, cliente_id: e.target.value }))}
                  >
                    <option value="">Seleccionar cliente</option>
                    {clientes.map(cliente => (
                      <option key={cliente.id} value={cliente.id}>
                        {cliente.nombre} {cliente.apellido} - {cliente.cedula}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="alert alert-info">
                  <strong>📋 Resumen de la Venta</strong>
                  <div className="mt-2">
                    {carrito.map(item => (
                      <div key={item.producto_id} className="d-flex justify-content-between border-bottom py-1">
                        <span>
                          {item.nombre} × {item.cantidad}
                        </span>
                        <span className="fw-bold">
                          ${item.subtotal?.toLocaleString()}
                        </span>
                      </div>
                    ))}
                    <div className="d-flex justify-content-between border-top pt-2 mt-2">
                      <strong>Total:</strong>
                      <strong className="text-success">${calcularTotal().toLocaleString()}</strong>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button type="button" className="btn btn-success" onClick={handleFinalizarVenta}>
                  💰 Confirmar Venta
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sales;