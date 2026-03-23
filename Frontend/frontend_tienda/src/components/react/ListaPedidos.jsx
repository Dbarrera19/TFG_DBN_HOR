import React, { useState, useEffect } from 'react';
import { pedidosService, detallepedidosService } from '../../services/api';
import { LoadingSpinner, ErrorMessage } from '../LoadingStates';
import '../../styles/pedidos.css';

export default function ListaPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
  const [detalles, setDetalles] = useState([]);

  useEffect(() => {
    cargarPedidos();
  }, []);

  const cargarPedidos = async () => {
    setLoading(true);
    setError(null);
    try {
      const pedidosData = await pedidosService.getAll();
      setPedidos(Array.isArray(pedidosData) ? pedidosData : []);
    } catch (err) {
      setError(err.message || 'Error al cargar los pedidos');
    } finally {
      setLoading(false);
    }
  };

  const handleVerDetalles = async (pedido) => {
    setPedidoSeleccionado(pedido);
    setLoading(true);
    setError(null);
    try {
      const detallesData = await detallepedidosService.getByPedidoId(pedido.id);
      setDetalles(Array.isArray(detallesData) ? detallesData : []);
    } catch (err) {
      setError('Error al cargar detalles del pedido');
      setDetalles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (id) => {
    if (window.confirm('¿Seguro que deseas eliminar este pedido?')) {
      try {
        setLoading(true);
        await pedidosService.delete(id);
        await cargarPedidos();
      } catch (err) {
        setError(err.message || 'Error al eliminar pedido');
      } finally {
        setLoading(false);
      }
    }
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatearHora = (fecha) => {
    return new Date(fecha).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (pedidoSeleccionado) {
    return (
      <div className="lista-container">
        <button className="btn-volver" onClick={() => setPedidoSeleccionado(null)}>
          ← Volver a Pedidos
        </button>

        <div className="detalles-pedido">
          <h2>Pedido #{pedidoSeleccionado.id}</h2>

          <div className="info-pedido">
            <div className="info-row">
              <div className="info-item">
                <strong>Fecha:</strong>
                <p>{formatearFecha(pedidoSeleccionado.fechaPedido)}</p>
              </div>
              <div className="info-item">
                <strong>Hora:</strong>
                <p>{formatearHora(pedidoSeleccionado.fechaPedido)}</p>
              </div>
              <div className="info-item">
                <strong>Cliente:</strong>
                <p>{pedidoSeleccionado.clienteNombre || 'N/A'}</p>
              </div>
              <div className="info-item">
                <strong>Total:</strong>
                <p className="total">${pedidoSeleccionado.total.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {error && <ErrorMessage message={error} />}

          <h3>Detalles del Pedido</h3>

          {loading ? (
            <LoadingSpinner message="Cargando detalles..." />
          ) : detalles.length === 0 ? (
            <p className="sin-datos">Este pedido no tiene detalles registrados</p>
          ) : (
            <div className="tabla-responsive">
              <table className="tabla-detalles">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Precio Unitario</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {detalles.map((detalle, idx) => (
                    <tr key={idx}>
                      <td>{detalle.productoNombre || 'Producto'}</td>
                      <td className="cantidad-cell">{detalle.cantidad}</td>
                      <td className="precio-cell">${detalle.precioUnitario?.toFixed(2) || '0.00'}</td>
                      <td className="subtotal-cell">${(detalle.cantidad * (detalle.precioUnitario || 0)).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="lista-container">
      <h2>🛒 Gestión de Pedidos</h2>

      {error && <ErrorMessage message={error} onRetry={cargarPedidos} />}

      {loading ? (
        <LoadingSpinner message="Cargando pedidos..." />
      ) : pedidos.length === 0 ? (
        <p className="sin-datos">No hay pedidos registrados</p>
      ) : (
        <div className="tabla-responsive">
          <table className="tabla">
            <thead>
              <tr>
                <th>ID</th>
                <th>Fecha</th>
                <th>Cliente</th>
                <th>Total</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map((pedido) => (
                <tr key={pedido.id}>
                  <td>#{pedido.id}</td>
                  <td className="fecha-cell">{formatearFecha(pedido.fechaPedido)}</td>
                  <td>{pedido.clienteNombre || 'Sin cliente'}</td>
                  <td className="total-cell">${pedido.total.toFixed(2)}</td>
                  <td className="acciones-cell">
                    <button 
                      className="btn-info" 
                      onClick={() => handleVerDetalles(pedido)}
                    >
                      Ver Detalles
                    </button>
                    <button 
                      className="btn-eliminar" 
                      onClick={() => handleEliminar(pedido.id)}
                    >
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
