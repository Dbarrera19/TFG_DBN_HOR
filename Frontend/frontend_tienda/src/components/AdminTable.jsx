import React, { useState, useEffect } from 'react';
import '../styles/admin-table.css';
import { formatUtils } from '../utils/index';

export default function AdminTable({ 
  title,
  data = [],
  columns = [],
  onEdit,
  onDelete,
  onAdd,
  isLoading = false,
  error = null,
}) {
  const handleDelete = async (id, name) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar "${name}"?`)) {
      try {
        await onDelete(id);
      } catch (err) {
        alert('Error al eliminar: ' + (err.message || 'Error desconocido'));
      }
    }
  };

  if (isLoading) {
    return <div className="admin-table"><p>Cargando...</p></div>;
  }

  if (error) {
    return (
      <div className="admin-table">
        <div className="error">
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="admin-table">
        <div className="table-header">
          <h2>{title}</h2>
          <button onClick={onAdd} className="add-btn">+ Nuevo</button>
        </div>
        <div className="empty">
          <p>No hay datos para mostrar</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-table">
      <div className="table-header">
        <h2>{title}</h2>
        <button onClick={onAdd} className="add-btn">+ Nuevo</button>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              {columns.map(col => (
                <th key={col.key}>{col.label}</th>
              ))}
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {data.map(item => (
              <tr key={item.id}>
                {columns.map(col => (
                  <td key={col.key}>
                    {col.render 
                      ? col.render(item[col.key], item)
                      : (col.type === 'price' 
                        ? formatUtils.formatPrice(item[col.key])
                        : item[col.key])
                    }
                  </td>
                ))}
                <td className="actions">
                  <button 
                    onClick={() => onEdit(item)}
                    className="edit-btn"
                    title="Editar"
                  >
                    ✏️
                  </button>
                  <button 
                    onClick={() => handleDelete(item.id, item.nombre || item.id)}
                    className="delete-btn"
                    title="Eliminar"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
