import React, { useState, useEffect } from 'react';
import AdminTable from '../components/AdminTable';
import ListaProductos from '../components/react/ListaProductos';
import ListaClientes from '../components/react/ListaClientes';
import ListaPedidos from '../components/react/ListaPedidos';
import { categoriasService } from '../services/api';
import { LoadingSpinner, ErrorMessage, SuccessMessage } from '../components/LoadingStates';
import '../styles/admin.css';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('categorias');
  const [categorias, setCategorias] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [formularioCategoria, setFormularioCategoria] = useState({
    id: 0,
    nombre: '',
    descripcion: '',
  });

  useEffect(() => {
    cargarCategorias();
  }, []);

  const cargarCategorias = async () => {
    try {
      setIsLoading(true);
      setError('');
      const data = await categoriasService.getAll();
      setCategorias(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Error al cargar categorías');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCategoria = () => {
    setFormularioCategoria({ id: 0, nombre: '', descripcion: '' });
    setEditingItem(null);
    setShowForm(true);
  };

  const handleEditCategoria = (categoria) => {
    setFormularioCategoria(categoria);
    setEditingItem(categoria.id);
    setShowForm(true);
  };

  const handleSaveCategoria = async () => {
    if (!formularioCategoria.nombre.trim()) {
      setError('El nombre es requerido');
      return;
    }

    try {
      setIsLoading(true);
      if (editingItem) {
        await categoriasService.update(formularioCategoria.id, formularioCategoria);
        setSuccess('Categoría actualizada correctamente');
      } else {
        await categoriasService.create(formularioCategoria);
        setSuccess('Categoría creada correctamente');
      }
      await cargarCategorias();
      setShowForm(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Error al guardar categoría');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCategoria = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
      try {
        setIsLoading(true);
        await categoriasService.delete(id);
        setSuccess('Categoría eliminada correctamente');
        await cargarCategorias();
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError(err.message || 'Error al eliminar categoría');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingItem(null);
    setFormularioCategoria({ id: 0, nombre: '', descripcion: '' });
    setError('');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'categorias':
        return (
          <div className="tab-content">
            {error && <ErrorMessage message={error} />}
            {success && <SuccessMessage message={success} />}

            {!showForm && (
              <button className="btn-agregar" onClick={handleAddCategoria}>
                + Nueva Categoría
              </button>
            )}

            {showForm && (
              <div className="formulario">
                <h3>{editingItem ? 'Editar Categoría' : 'Nueva Categoría'}</h3>
                <div className="form-group">
                  <label>Nombre:</label>
                  <input
                    type="text"
                    value={formularioCategoria.nombre}
                    onChange={(e) =>
                      setFormularioCategoria({
                        ...formularioCategoria,
                        nombre: e.target.value,
                      })
                    }
                    placeholder="Ej: Camisetas"
                  />
                </div>
                <div className="form-group">
                  <label>Descripción:</label>
                  <textarea
                    value={formularioCategoria.descripcion}
                    onChange={(e) =>
                      setFormularioCategoria({
                        ...formularioCategoria,
                        descripcion: e.target.value,
                      })
                    }
                    placeholder="Descripción de la categoría"
                    rows="3"
                  />
                </div>
                <div className="form-actions">
                  <button 
                    className="btn-guardar" 
                    onClick={handleSaveCategoria}
                    disabled={isLoading}
                  >
                    {editingItem ? 'Actualizar' : 'Guardar'}
                  </button>
                  <button 
                    className="btn-cancelar" 
                    onClick={handleCancelForm}
                    disabled={isLoading}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}

            {isLoading && !showForm ? (
              <LoadingSpinner message="Cargando categorías..." />
            ) : (
              <AdminTable
                items={categorias}
                columns={[
                  { key: 'id', label: 'ID', width: '10%' },
                  { key: 'nombre', label: 'Nombre', width: '35%' },
                  { key: 'descripcion', label: 'Descripción', width: '45%' },
                ]}
                onEdit={handleEditCategoria}
                onDelete={handleDeleteCategoria}
              />
            )}
          </div>
        );

      case 'productos':
        return <ListaProductos />;

      case 'clientes':
        return <ListaClientes />;

      case 'pedidos':
        return <ListaPedidos />;

      default:
        return null;
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>🏆 Panel de Administración</h1>
        <p>Gestiona categorías, productos, clientes y pedidos</p>
      </div>

      <div className="admin-tabs">
        <button
          className={`admin-tab ${activeTab === 'categorias' ? 'active' : ''}`}
          onClick={() => setActiveTab('categorias')}
        >
          📁 Categorías
        </button>
        <button
          className={`admin-tab ${activeTab === 'productos' ? 'active' : ''}`}
          onClick={() => setActiveTab('productos')}
        >
          📦 Productos
        </button>
        <button
          className={`admin-tab ${activeTab === 'clientes' ? 'active' : ''}`}
          onClick={() => setActiveTab('clientes')}
        >
          👥 Clientes
        </button>
        <button
          className={`admin-tab ${activeTab === 'pedidos' ? 'active' : ''}`}
          onClick={() => setActiveTab('pedidos')}
        >
          🛒 Pedidos
        </button>
      </div>

      <div className="admin-content">
        {renderContent()}
      </div>
    </div>
  );
}
