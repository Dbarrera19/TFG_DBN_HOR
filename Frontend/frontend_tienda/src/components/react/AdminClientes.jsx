import React, { useState, useEffect } from 'react';
import { getClientes, updateCliente, deleteCliente } from '../services/index.js';
import { formatDate } from '../utils/format.js';

export default function AdminClientes() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadClientes();
  }, []);

  const loadClientes = async () => {
    try {
      setLoading(true);
      const data = await getClientes();
      setClientes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error:', err);
      setError('Error al cargar los clientes');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('¿Estás seguro?')) {
      try {
        await deleteCliente(id);
        await loadClientes();
      } catch (err) {
        setError('Error al eliminar');
      }
    }
  };

  if (loading) return <div className="admin-loading">Cargando...</div>;

  return (
    <div className="admin-section">
      <div className="admin-header">
        <h2>Gestionar Clientes</h2>
      </div>

      {error && <div className="form-error-box">{error}</div>}

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Dirección</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map(cliente => (
              <tr key={cliente.id}>
                <td>#{cliente.id}</td>
                <td><strong>{cliente.nombre} {cliente.apellido}</strong></td>
                <td>{cliente.email}</td>
                <td>{cliente.telefono}</td>
                <td>{cliente.direccion || '-'}</td>
                <td className="actions">
                  <button onClick={() => handleDelete(cliente.id)} className="btn-icon danger">🗑</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
