import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Products = () => {
  const [productos, setProductos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    precio: '',
    stock: '',
    categoria: 'suplemento'
  });

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      // Datos de ejemplo
      setProductos([
        { id: 1, nombre: 'Proteína Whey', precio: 120000, stock: 15, categoria: 'suplemento', vendidos: 8 },
        { id: 2, nombre: 'Creatina', precio: 80000, stock: 10, categoria: 'suplemento', vendidos: 12 },
        { id: 3, nombre: 'Agua', precio: 3000, stock: 50, categoria: 'bebida', vendidos: 45 },
        { id: 4, nombre: 'Bebida Hidratante', precio: 5000, stock: 30, categoria: 'bebida', vendidos: 25 },
        { id: 5, nombre: 'Barra Energética', precio: 7000, stock: 20, categoria: 'bocadillo', vendidos: 18 },
      ]);
    } catch (error) {
      console.error('Error cargando productos:', error);
    }
  };

  const handleNuevoProducto = async (productoData) => {
    try {
      const nuevoProducto = {
        id: Date.now(),
        ...productoData,
        precio: parseInt(productoData.precio),
        stock: parseInt(productoData.stock),
        vendidos: 0
      };
      setProductos(prev => [...prev, nuevoProducto]);
      setShowModal(false);
      setFormData({ nombre: '', precio: '', stock: '', categoria: 'suplemento' });
      alert('✅ Producto agregado exitosamente!');
    } catch (error) {
      console.error('Error agregando producto:', error);
      alert('❌ Error al agregar producto');
    }
  };

  const categorias = [
    { value: 'suplemento', label: '🥤 Suplemento' },
    { value: 'bebida', label: '💧 Bebida' },
    { value: 'bocadillo', label: '🍫 Bocadillo' },
    { value: 'merchandising', label: '👕 Merchandising' }
  ];

  const getCategoriaIcon = (categoria) => {
    const cat = categorias.find(c => c.value === categoria);
    return cat ? cat.label.split(' ')[0] : '📦';
  };

  // Calcular estadísticas
  const totalProductos = productos.length;
  const productosBajoStock = productos.filter(p => p.stock < 10).length;
  const ingresosProductos = productos.reduce((total, p) => total + (p.precio * p.vendidos), 0);

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="text-dark mb-0">Gestión de Productos</h2>
          <small className="text-muted">Inventario y ventas - Gimnasio Elite</small>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => setShowModal(true)}
        >
          📦 + Nuevo Producto
        </button>
      </div>

      {/* Estadísticas de Productos */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card gym-card">
            <div className="card-body text-center">
              <h6 className="card-title">Total Productos</h6>
              <h3 className="text-primary">{totalProductos}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card gym-card">
            <div className="card-body text-center">
              <h6 className="card-title">Bajo Stock</h6>
              <h3 className="text-warning">{productosBajoStock}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card gym-card">
            <div className="card-body text-center">
              <h6 className="card-title">Ingresos Productos</h6>
              <h3 className="text-success">${(ingresosProductos/1000).toFixed(0)}K</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card gym-card">
            <div className="card-body text-center">
              <h6 className="card-title">Productos Vendidos</h6>
              <h3 className="text-info">{productos.reduce((total, p) => total + p.vendidos, 0)}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de Productos */}
      <div className="card gym-card">
        <div className="card-header bg-white">
          <h5 className="card-title mb-0">📋 Inventario de Productos</h5>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th>Producto</th>
                  <th>Categoría</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Vendidos</th>
                  <th>Ingresos</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {productos.map(producto => (
                  <tr key={producto.id}>
                    <td>
                      <strong>{producto.nombre}</strong>
                    </td>
                    <td>
                      <span className="badge bg-secondary">
                        {getCategoriaIcon(producto.categoria)} {producto.categoria}
                      </span>
                    </td>
                    <td>
                      <strong className="text-success">
                        ${producto.precio.toLocaleString()}
                      </strong>
                    </td>
                    <td>
                      <span className={producto.stock < 10 ? 'text-warning fw-bold' : ''}>
                        {producto.stock} unidades
                      </span>
                    </td>
                    <td>{producto.vendidos}</td>
                    <td>
                      <strong className="text-success">
                        ${(producto.precio * producto.vendidos).toLocaleString()}
                      </strong>
                    </td>
                    <td>
                      <span className={`badge ${
                        producto.stock === 0 ? 'bg-danger' :
                        producto.stock < 5 ? 'bg-warning' : 'bg-success'
                      }`}>
                        {producto.stock === 0 ? 'Agotado' :
                         producto.stock < 5 ? 'Bajo Stock' : 'Disponible'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal de Nuevo Producto */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Agregar Nuevo Producto</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={(e) => {
                e.preventDefault();
                handleNuevoProducto(formData);
              }}>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label">Nombre del Producto *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.nombre}
                        onChange={(e) => setFormData(prev => ({...prev, nombre: e.target.value}))}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Precio ($) *</label>
                      <input
                        type="number"
                        className="form-control"
                        value={formData.precio}
                        onChange={(e) => setFormData(prev => ({...prev, precio: e.target.value}))}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Stock Inicial *</label>
                      <input
                        type="number"
                        className="form-control"
                        value={formData.stock}
                        onChange={(e) => setFormData(prev => ({...prev, stock: e.target.value}))}
                        required
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Categoría</label>
                      <select
                        className="form-select"
                        value={formData.categoria}
                        onChange={(e) => setFormData(prev => ({...prev, categoria: e.target.value}))}
                      >
                        {categorias.map(cat => (
                          <option key={cat.value} value={cat.value}>
                            {cat.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Agregar Producto
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;