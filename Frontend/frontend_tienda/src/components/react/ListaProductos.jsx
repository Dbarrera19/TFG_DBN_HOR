import React, { useState, useEffect } from 'react';
import { productosService, categoriasService } from '../../services/api';
import { LoadingSpinner, ErrorMessage } from '../LoadingStates';
import '../../styles/productos.css';

export default function ListaProductos() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editando, setEditando] = useState(false);

  const [formulario, setFormulario] = useState({
    id: 0,
    nombre: '',
    descripcion: '',
    precio: 0,
    stock: 0,
    marca: '',
    talla: '',
    categoriaId: null,
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    setError(null);
    try {
      const [productosData, categoriasData] = await Promise.all([
        productosService.getAll(),
        categoriasService.getAll(),
      ]);
      
      setProductos(Array.isArray(productosData) ? productosData : []);
      setCategorias(Array.isArray(categoriasData) ? categoriasData : []);
    } catch (err) {
      setError(err.message || 'Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const handleGuardar = async () => {
    if (!formulario.nombre.trim() || formulario.precio < 0 || formulario.stock < 0) {
      alert('Por favor completa los campos requeridos correctamente');
      return;
    }

    try {
      setLoading(true);
      let response;
      
      if (editando) {
        response = await productosService.update(formulario.id, formulario);
      } else {
        response = await productosService.create(formulario);
      }

      if (response) {
        await cargarDatos();
        resetFormulario();
        setShowForm(false);
      }
    } catch (err) {
      setError(err.message || 'Error al guardar producto');
    } finally {
      setLoading(false);
    }
  };

  const handleEditar = (producto) => {
    setFormulario({
      id: producto.id,
      nombre: producto.nombre,
      descripcion: producto.descripcion || '',
      precio: producto.precio,
      stock: producto.stock,
      marca: producto.marca || '',
      talla: producto.talla || '',
      categoriaId: producto.categoriaId,
    });
    setEditando(true);
    setShowForm(true);
  };

  const handleEliminar = async (id) => {
    if (window.confirm('¿Seguro que deseas eliminar este producto?')) {
      try {
        setLoading(true);
        await productosService.delete(id);
        await cargarDatos();
      } catch (err) {
        setError(err.message || 'Error al eliminar producto');
      } finally {
        setLoading(false);
      }
    }
  };

  const resetFormulario = () => {
    setFormulario({
      id: 0,
      nombre: '',
      descripcion: '',
      precio: 0,
      stock: 0,
      marca: '',
      talla: '',
      categoriaId: null,
    });
    setEditando(false);
  };

  const handleCancelar = () => {
    resetFormulario();
    setShowForm(false);
    setError(null);
  };

  return (
    <div className="lista-container">
      <h2>📦 Gestión de Productos</h2>

      {error && <ErrorMessage message={error} onRetry={cargarDatos} />}

      {!showForm && (
        <button className="btn-agregar" onClick={() => setShowForm(true)}>
          + Nuevo Producto
        </button>
      )}

      {showForm && (
        <div className="formulario">
          <h3>{editando ? 'Editar Producto' : 'Nuevo Producto'}</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label>Nombre:</label>
              <input
                type="text"
                value={formulario.nombre}
                onChange={(e) => setFormulario({ ...formulario, nombre: e.target.value })}
                placeholder="Ej: Camiseta oficial"
              />
            </div>

            <div className="form-group">
              <label>Categoría:</label>
              <select
                value={formulario.categoriaId || ''}
                onChange={(e) =>
                  setFormulario({
                    ...formulario,
                    categoriaId: e.target.value ? parseInt(e.target.value) : null,
                  })
                }
              >
                <option value="">Selecciona categoría</option>
                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Descripción:</label>
            <textarea
              value={formulario.descripcion}
              onChange={(e) => setFormulario({ ...formulario, descripcion: e.target.value })}
              placeholder="Detalles del producto"
              rows="3"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Precio (€):</label>
              <input
                type="number"
                step="0.01"
                value={formulario.precio}
                onChange={(e) => setFormulario({ ...formulario, precio: parseFloat(e.target.value) || 0 })}
              />
            </div>

            <div className="form-group">
              <label>Stock:</label>
              <input
                type="number"
                value={formulario.stock}
                onChange={(e) => setFormulario({ ...formulario, stock: parseInt(e.target.value) || 0 })}
              />
            </div>

            <div className="form-group">
              <label>Marca:</label>
              <input
                type="text"
                value={formulario.marca}
                onChange={(e) => setFormulario({ ...formulario, marca: e.target.value })}
                placeholder="Ej: Nike"
              />
            </div>

            <div className="form-group">
              <label>Talla:</label>
              <input
                type="text"
                value={formulario.talla}
                onChange={(e) => setFormulario({ ...formulario, talla: e.target.value })}
                placeholder="Ej: M, L"
              />
            </div>
          </div>

          <div className="form-actions">
            <button className="btn-guardar" onClick={handleGuardar} disabled={loading}>
              {editando ? 'Actualizar' : 'Guardar'}
            </button>
            <button className="btn-cancelar" onClick={handleCancelar} disabled={loading}>
              Cancelar
            </button>
          </div>
        </div>
      )}

      {loading && !showForm ? (
        <LoadingSpinner message="Cargando productos..." />
      ) : productos.length === 0 ? (
        <p className="sin-datos">No hay productos registrados</p>
      ) : (
        <div className="tabla-responsive">
          <table className="tabla">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Marca</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Categoría</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((producto) => (
                <tr key={producto.id}>
                  <td>#{producto.id}</td>
                  <td className="nombre-cell">{producto.nombre}</td>
                  <td>{producto.marca || 'N/A'}</td>
                  <td className="precio-cell">${producto.precio.toFixed(2)}</td>
                  <td className={`stock-cell ${producto.stock === 0 ? 'sin-stock' : ''}`}>
                    {producto.stock}
                  </td>
                  <td>{producto.categoriaNombre || 'Sin categoría'}</td>
                  <td className="acciones-cell">
                    <button className="btn-editar" onClick={() => handleEditar(producto)}>
                      Editar
                    </button>
                    <button className="btn-eliminar" onClick={() => handleEliminar(producto.id)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
