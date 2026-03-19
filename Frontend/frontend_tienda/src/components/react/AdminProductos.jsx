import React, { useState, useEffect } from 'react';
import { getProductos, createProducto, updateProducto, deleteProducto, getCategorias } from '../services/index.js';
import '../styles/admin.css';

export default function AdminProductos() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    marca: '',
    talla: '',
    categoriaId: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [prodData, catData] = await Promise.all([
        getProductos(),
        getCategorias()
      ]);
      setProductos(Array.isArray(prodData) ? prodData : []);
      setCategorias(Array.isArray(catData) ? catData : []);
    } catch (err) {
      console.error('Error:', err);
      setError('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'categoriaId' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setError(null);
      
      const submitData = {
        ...formData,
        precio: parseFloat(formData.precio),
        stock: parseInt(formData.stock),
      };

      if (editingId) {
        await updateProducto(editingId, submitData);
      } else {
        await createProducto(submitData);
      }

      await loadData();
      resetForm();
    } catch (err) {
      setError(err.message || 'Error al guardar');
    }
  };

  const handleEdit = (producto) => {
    setFormData(producto);
    setEditingId(producto.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (confirm('¿Estás seguro?')) {
      try {
        await deleteProducto(id);
        await loadData();
      } catch (err) {
        setError('Error al eliminar');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      descripcion: '',
      precio: '',
      stock: '',
      marca: '',
      talla: '',
      categoriaId: '',
    });
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) return <div className="admin-loading">Cargando...</div>;

  return (
    <div className="admin-section">
      <div className="admin-header">
        <h2>Gestionar Productos</h2>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          {showForm ? '✕ Cancelar' : '+ Nuevo Producto'}
        </button>
      </div>

      {error && <div className="form-error-box">{error}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} className="admin-form">
          <h3>{editingId ? 'Editar Producto' : 'Crear Producto'}</h3>
          
          <div className="form-grid">
            <div className="form-group">
              <label>Nombre *</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Categoría *</label>
              <select
                name="categoriaId"
                value={formData.categoriaId}
                onChange={handleChange}
                required
              >
                <option value="">-- Selecciona --</option>
                {categorias.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Precio *</label>
              <input
                type="number"
                step="0.01"
                name="precio"
                value={formData.precio}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Stock *</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Marca</label>
              <input
                type="text"
                name="marca"
                value={formData.marca}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Talla</label>
              <input
                type="text"
                name="talla"
                value={formData.talla}
                onChange={handleChange}
              />
            </div>

            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label>Descripción</label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                rows="3"
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {editingId ? 'Actualizar' : 'Crear'}
            </button>
            <button type="button" onClick={resetForm} className="btn btn-outline">
              Cancelar
            </button>
          </div>
        </form>
      )}

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Marca</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map(producto => (
              <tr key={producto.id}>
                <td>#{producto.id}</td>
                <td><strong>{producto.nombre}</strong></td>
                <td>{producto.categoriaNombre}</td>
                <td>${producto.precio.toFixed(2)}</td>
                <td>
                  <span className={`stock-badge ${producto.stock > 10 ? 'high' : producto.stock > 0 ? 'medium' : 'low'}`}>
                    {producto.stock}
                  </span>
                </td>
                <td>{producto.marca}</td>
                <td className="actions">
                  <button onClick={() => handleEdit(producto)} className="btn-icon" title="Editar">✎</button>
                  <button onClick={() => handleDelete(producto.id)} className="btn-icon danger" title="Eliminar">🗑</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
