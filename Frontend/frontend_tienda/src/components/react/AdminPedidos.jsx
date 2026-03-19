import React, { useState, useEffect } from 'react';
import { getPedidos, getDetallesPorPedido } from '../services/index.js';
import { formatPrice, formatDate } from '../utils/format.js';

export default function AdminPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [detalles, setDetalles] = useState({});

  useEffect(() => {
    loadPedidos();
  }, []);

  const loadPedidos = async () => {
    try {
      setLoading(true);
      const data = await getPedidos();
      setPedidos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error:', err);
      setError('Error al cargar los pedidos');
    } finally {
      setLoading(false);
    }
  };

  const toggleDetails = async (pedidoId) => {
    if (expandedId === pedidoId) {
      setExpandedId(null);
    } else {
      if (!detalles[pedidoId]) {
        try {
          const detData = await getDetallesPorPedido(pedidoId);
          setDetalles(prev => ({
            ...prev,
            [pedidoId]: Array.isArray(detData) ? detData : []
          }));
        } catch (err) {
          console.error('Error:', err);
        }
      }
      setExpandedId(pedidoId);
    }
  };

  if (loading) return <div className="admin-loading">Cargando...</div>;

  return (
    <div className="admin-section">
      <div className="admin-header">
        <h2>Gestionar Pedidos</h2>
      </div>

      {error && <div className="form-error-box">{error}</div>}

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Fecha</th>
              <th>Total</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map(pedido => (
              <React.Fragment key={pedido.id}>
                <tr>
                  <td>#{pedido.id}</td>
                  <td><strong>{pedido.nombreCliente}</strong></td>
                  <td>{formatDate(pedido.fecha)}</td>
                  <td className="price">{formatPrice(pedido.total)}</td>
                  <td className="actions">
                    <button 
                      onClick={() => toggleDetails(pedido.id)} 
                      className="btn-icon"
                    >
                      {expandedId === pedido.id ? '▼' : '▶'}
                    </button>
                  </td>
                </tr>
                {expandedId === pedido.id && detalles[pedido.id] && (
                  <tr className="details-row">
                    <td colSpan="5">
                      <div className="order-details">
                        <h4>Detalles del Pedido</h4>
                        <table className="details-table">
                          <thead>
                            <tr>
                              <th>Producto</th>
                              <th>Cantidad</th>
                              <th>Precio</th>
                              <th>Subtotal</th>
                            </tr>
                          </thead>
                          <tbody>
                            {detalles[pedido.id].map((det, idx) => (
                              <tr key={idx}>
                                <td>{det.nombreProducto}</td>
                                <td>{det.cantidad}</td>
                                <td>{formatPrice(det.precioUnitario)}</td>
                                <td className="price">{formatPrice(det.subtotal)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
