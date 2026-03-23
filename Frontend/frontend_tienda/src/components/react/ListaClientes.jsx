import React, { useState, useEffect } from 'react';
import { clientesService } from '../../services/api';
import { LoadingSpinner, ErrorMessage } from '../LoadingStates';
import '../../styles/clientes.css';

export default function ListaClientes() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editando, setEditando] = useState(false);

  const [formulario, setFormulario] = useState({
    id: 0,
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    direccion: '',
  });

  useEffect(() => {
    cargarClientes();
  }, []);

  const cargarClientes = async () => {
    setLoading(true);
    setError(null);
    try {
      const clientesData = await clientesService.getAll();
      setClientes(Array.isArray(clientesData) ? clientesData : []);
    } catch (err) {
      setError(err.message || 'Error al cargar los clientes');
    } finally {
      setLoading(false);
    }
  };

  const validarEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleGuardar = async () => {
    if (
      !formulario.nombre.trim() ||
      !formulario.apellido.trim() ||
      !formulario.email.trim() ||
      !validarEmail(formulario.email) ||
      !formulario.telefono.trim() ||
      !formulario.direccion.trim()
    ) {
      alert('Por favor completa todos los campos. Email debe ser válido.');
      return;
    }

    try {
      setLoading(true);
      let response;

      if (editando) {
        response = await clientesService.update(formulario.id, formulario);
      } else {
        response = await clientesService.create(formulario);
      }

      if (response) {
        await cargarClientes();
        resetFormulario();
        setShowForm(false);
      }
    } catch (err) {
      setError(err.message || 'Error al guardar cliente');
    } finally {
      setLoading(false);
    }
  };

  const handleEditar = (cliente) => {
    setFormulario({
      id: cliente.id,
      nombre: cliente.nombre,
      apellido: cliente.apellido,
      email: cliente.email,
      telefono: cliente.telefono,
      direccion: cliente.direccion || '',
    });
    setEditando(true);
    setShowForm(true);
  };

  const handleEliminar = async (id) => {
    if (window.confirm('¿Seguro que deseas eliminar este cliente?')) {
      try {
        setLoading(true);
        await clientesService.delete(id);
        await cargarClientes();
      } catch (err) {
        setError(err.message || 'Error al eliminar cliente');
      } finally {
        setLoading(false);
      }
    }
  };

  const resetFormulario = () => {
    setFormulario({
      id: 0,
      nombre: '',
      apellido: '',
      email: '',
      telefono: '',
      direccion: '',
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
      <h2>👥 Gestión de Clientes</h2>

      {error && <ErrorMessage message={error} onRetry={cargarClientes} />}

      {!showForm && (
        <button className="btn-agregar" onClick={() => setShowForm(true)}>
          + Nuevo Cliente
        </button>
      )}

      {showForm && (
        <div className="formulario">
          <h3>{editando ? 'Editar Cliente' : 'Nuevo Cliente'}</h3>

          <div className="form-row">
            <div className="form-group">
              <label>Nombre:</label>
              <input
                type="text"
                value={formulario.nombre}
                onChange={(e) => setFormulario({ ...formulario, nombre: e.target.value })}
                placeholder="Juan"
              />
            </div>

            <div className="form-group">
              <label>Apellido:</label>
              <input
                type="text"
                value={formulario.apellido}
                onChange={(e) => setFormulario({ ...formulario, apellido: e.target.value })}
                placeholder="García"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={formulario.email}
              onChange={(e) => setFormulario({ ...formulario, email: e.target.value })}
              placeholder="juan@example.com"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Teléfono:</label>
              <input
                type="tel"
                value={formulario.telefono}
                onChange={(e) => setFormulario({ ...formulario, telefono: e.target.value })}
                placeholder="+34 912 345 678"
              />
            </div>

            <div className="form-group">
              <label>Dirección:</label>
              <input
                type="text"
                value={formulario.direccion}
                onChange={(e) => setFormulario({ ...formulario, direccion: e.target.value })}
                placeholder="Calle Principal 123"
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
        <LoadingSpinner message="Cargando clientes..." />
      ) : clientes.length === 0 ? (
        <p className="sin-datos">No hay clientes registrados</p>
      ) : (
        <div className="tabla-responsive">
          <table className="tabla">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Dirección</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((cliente) => (
                <tr key={cliente.id}>
                  <td>#{cliente.id}</td>
                  <td>{cliente.nombre}</td>
                  <td>{cliente.apellido}</td>
                  <td className="email-cell">{cliente.email}</td>
                  <td>{cliente.telefono}</td>
                  <td className="direccion-cell">{cliente.direccion || 'N/A'}</td>
                  <td className="acciones-cell">
                    <button className="btn-editar" onClick={() => handleEditar(cliente)}>
                      Editar
                    </button>
                    <button className="btn-eliminar" onClick={() => handleEliminar(cliente.id)}>
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
