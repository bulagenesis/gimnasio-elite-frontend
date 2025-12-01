import React, { useState, useEffect } from 'react';
import api from '../services/api';

// Constantes
const CATEGORIAS = [
  { value: 'Suplementos', label: '🥤 Suplementos' },
  { value: 'Bebidas', label: '💧 Bebidas' },
  { value: 'Bocadillos', label: '🍫 Bocadillos' },
  { value: 'Merchandising', label: '👕 Merchandising' },
  { value: 'Accesorios', label: '🏋️ Accesorios' }
];

const ESTADO_STOCK = {
  AGOTADO: 'Agotado',
  BAJO_STOCK: 'Bajo Stock',
  DISPONIBLE: 'Disponible'
};

const Products = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    precio: '',
    stock: '',
    categoria: 'Suplementos',
    descripcion: ''
  });

  // ✅ Cargar productos
  const cargarProductos = async () => {
    setLoading(true);
    try {
      const data = await api.getProductos();
      setProductos(data);
    } catch (error) {
      console.error('Error cargando productos:', error);
      alert('Error al cargar productos: ' + (error.message || 'Desconocido'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  // Utilidades
  const getCategoriaIcon = (categoria) => {
    const cat = CATEGORIAS.find(c => c.value === categoria);
    return cat ? cat.label.split(' ')[0] : '📦';
  };

  const getEstadoStock = (stock) => {
    if (stock === 0) return ESTADO_STOCK.AGOTADO;
    if (stock < 5) return ESTADO_STOCK.BAJO_STOCK;
    return ESTADO_STOCK.DISPONIBLE;
  };

  const getClaseEstado = (stock) => {
    if (stock === 0) return 'bg-danger';
    if (stock < 5) return 'bg-warning';
    return 'bg-success';
  };

  // Modales
  const openCreateModal = () => {
    setIsEditing(false);
    setEditingProduct(null);
    setFormData({
      nombre: '',
      precio: '',
      stock: '',
      categoria: 'Suplementos',
      descripcion: ''
    });
    setShowModal(true);
  };

  const openEditModal = (producto) => {
    setIsEditing(true);
    setEditingProduct(producto);
    setFormData({
      nombre: producto.nombre,
      precio: producto.precio.toString(),
      stock: producto.stock.toString(),
      categoria: producto.categoria,
      descripcion: producto.descripcion || ''
    });
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  // CRUD Productos
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        const updated = await api.updateProducto(editingProduct.id, {
          ...formData,
          precio: parseFloat(formData.precio),
          stock: parseInt(formData.stock)
        });
        setProductos(prev => prev.map(p => p.id === updated.id ? updated : p));
        alert('✅ Producto actualizado');
      } else {
        const nuevo = await api.createProducto({
          ...formData,
          precio: parseFloat(formData.precio),
          stock: parseInt(formData.stock)
        });
        setProductos(prev => [...prev, nuevo]);
        alert('✅ Producto creado');
      }
      closeModal();
    } catch (error) {
      console.error('Error en operación CRUD:', error);
      alert('❌ ' + (error.message || 'Error desconocido'));
    }
  };

  // Estadísticas
  const estadisticas = {
    total: productos.length,
    bajoStock: productos.filter(p => p.stock < 10).length,
    agotados: productos.filter(p => p.stock === 0).length,
    totalStock: productos.reduce((acc, p) => acc + p.stock, 0)
  };

  // Render
  if (loading) return <div className="text-center p-5">Cargando productos...</div>;

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between mb-4">
        <h2>📦 Gestión de Productos</h2>
        <button className="btn btn-primary" onClick={openCreateModal}>+ Nuevo Producto</button>
      </div>

      {/* Estadísticas */}
      <div className="row mb-4">
        <div className="col-md-3"><div className="card text-center"><div className="card-body"><h6>Total Productos</h6><h3>{estadisticas.total}</h3></div></div></div>
        <div className="col-md-3"><div className="card text-center"><div className="card-body"><h6>Bajo Stock</h6><h3>{estadisticas.bajoStock}</h3></div></div></div>
        <div className="col-md-3"><div className="card text-center"><div className="card-body"><h6>Agotados</h6><h3>{estadisticas.agotados}</h3></div></div></div>
        <div className="col-md-3"><div className="card text-center"><div className="card-body"><h6>Stock Total</h6><h3>{estadisticas.totalStock}</h3></div></div></div>
      </div>

      {/* Tabla */}
      <div className="card">
        <div className="card-header d-flex justify-content-between">
          <span>Inventario</span>
          <button className="btn btn-outline-secondary btn-sm" onClick={cargarProductos}>🔄 Actualizar</button>
        </div>
        <div className="table-responsive">
          <table className="table table-hover">
            <thead className="table-light">
              <tr>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Descripción</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map(p => (
                <tr key={p.id}>
                  <td>{p.nombre}</td>
                  <td>{getCategoriaIcon(p.categoria)} {p.categoria}</td>
                  <td>${p.precio.toLocaleString()}</td>
                  <td>{p.stock}</td>
                  <td>{p.descripcion || '-'}</td>
                  <td><span className={`badge ${getClaseEstado(p.stock)}`}>{getEstadoStock(p.stock)}</span></td>
                  <td>
                    <button className="btn btn-sm btn-info" onClick={() => openEditModal(p)}>✏️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Crear/Editar */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5>{isEditing ? `Editar: ${editingProduct?.nombre}` : 'Nuevo Producto'}</h5>
                <button className="btn-close" onClick={closeModal}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label>Nombre *</label>
                    <input type="text" className="form-control" value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} required/>
                  </div>
                  <div className="mb-3">
                    <label>Precio *</label>
                    <input type="number" className="form-control" value={formData.precio} onChange={e => setFormData({...formData, precio: e.target.value})} required step="0.01" min="0"/>
                  </div>
                  <div className="mb-3">
                    <label>Stock *</label>
                    <input type="number" className="form-control" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} required min="0"/>
                  </div>
                  <div className="mb-3">
                    <label>Categoría *</label>
                    <select className="form-select" value={formData.categoria} onChange={e => setFormData({...formData, categoria: e.target.value})}>
                      {CATEGORIAS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label>Descripción</label>
                    <textarea className="form-control" value={formData.descripcion} onChange={e => setFormData({...formData, descripcion: e.target.value})}></textarea>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancelar</button>
                  <button type="submit" className="btn btn-primary">{isEditing ? 'Guardar' : 'Agregar'}</button>
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
