import React, { useState, useEffect } from 'react';
import { getCategorias, createCategoria, updateCategoria, deleteCategoria } from '../services/index.js';

export default function AdminCategorias() {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await getCategorias();
      setCategorias(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error:', err);
      setError('Error al cargar las categorías');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setError(null);
      
      if (editingId) {
        await updateCategoria(editingId, formData);
      } else {
        await createCategoria(formData);
      }

      await loadCategories();
      resetForm();
    } catch (err) {
      setError(err.message || 'Error al guardar');
    }
  };

  const handleEdit = (categoria) => {
    setFormData(categoria);
    setEditingId(categoria.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (confirm('¿Estás seguro?')) {
      try {
        await deleteCategoria(id);
        await loadCategories();
      } catch (err) {
        setError('Error al eliminar');
      }
    }
  };

  const resetForm = () => {
    setFormData({ nombre: '', descripcion: '' });
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) return <div className="admin-loading">Cargando...</div>;

  return (
    <div className="admin-section">
      <div className="admin-header">
        <h2>Gestionar Categorías</h2>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          {showForm ? '✕ Cancelar' : '+ Nueva Categoría'}
        </button>
      </div>

      {error && <div className="form-error-box">{error}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} className="admin-form">
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
              <th>Descripción</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categorias.map(categoria => (
              <tr key={categoria.id}>
                <td>#{categoria.id}</td>
                <td><strong>{categoria.nombre}</strong></td>
                <td>{categoria.descripcion || '-'}</td>
                <td className="actions">
                  <button onClick={() => handleEdit(categoria)} className="btn-icon">✎</button>
                  <button onClick={() => handleDelete(categoria.id)} className="btn-icon danger">🗑</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
