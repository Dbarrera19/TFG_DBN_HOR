import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { pedidosService, detallepedidosService } from '../services/api';
import { LoadingSpinner, ErrorMessage } from '../components/LoadingStates';
import { formatUtils } from '../utils/index';

export default function OrderConfirmationPage() {
  const { pedidoId } = useParams();
  const [pedido, setPedido] = useState(null);
  const [detalles, setDetalles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarPedido();
  }, [pedidoId]);

  const cargarPedido = async () => {
    try {
      setIsLoading(true);
      const [pedidoData, detallesData] = await Promise.all([
        pedidosService.getById(pedidoId),
        detallepedidosService.getByPedidoId(pedidoId),
      ]);
      setPedido(pedidoData);
      setDetalles(Array.isArray(detallesData) ? detallesData : []);
    } catch (err) {
      setError(err.message || 'Error al cargar el pedido');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Cargando información del pedido..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={cargarPedido} />;
  }

  if (!pedido) {
    return <ErrorMessage message="Pedido no encontrado" />;
  }

  return (
    <div className="page-section">
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
        <h1 style={{ color: 'var(--success-color)' }}>¡Pedido Confirmado!</h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-light)' }}>
          Tu pedido ha sido creado exitosamente
        </p>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* INFORMACIÓN DEL PEDIDO */}
        <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', marginBottom: '2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h2 style={{ marginBottom: '1.5rem' }}>Información del Pedido</h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem', marginBottom: '2rem' }}>
            <div>
              <p style={{ color: 'var(--text-light)', marginBottom: '0.25rem' }}>Número de Pedido</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>#{pedido.id}</p>
            </div>
            <div>
              <p style={{ color: 'var(--text-light)', marginBottom: '0.25rem' }}>Fecha</p>
              <p style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{formatUtils.formatDate(pedido.fecha)}</p>
            </div>
            <div>
              <p style={{ color: 'var(--text-light)', marginBottom: '0.25rem' }}>Cliente</p>
              <p style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{pedido.nombreCliente}</p>
            </div>
            <div>
              <p style={{ color: 'var(--text-light)', marginBottom: '0.25rem' }}>Total</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent-color)' }}>
                {formatUtils.formatPrice(pedido.total)}
              </p>
            </div>
          </div>
        </div>

        {/* DETALLES DE PRODUCTOS */}
        <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', marginBottom: '2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h2 style={{ marginBottom: '1.5rem' }}>Detalle de Productos</h2>

          {detalles.length > 0 ? (
            <div>
              {detalles.map(detalle => (
                <div key={detalle.id} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)', marginBottom: '1rem' }}>
                  <div>
                    <p style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>{detalle.nombreProducto}</p>
                    <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>
                      {detalle.cantidad} x {formatUtils.formatPrice(detalle.precioUnitario)}
                    </p>
                  </div>
                  <p style={{ fontWeight: 'bold' }}>
                    {formatUtils.formatPrice(detalle.subtotal)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--text-light)' }}>No hay detalles disponibles</p>
          )}
        </div>

        {/* INSTRUCCIONES */}
        <div style={{ background: 'var(--bg-light)', padding: '2rem', borderRadius: '8px', marginBottom: '2rem', borderLeft: '4px solid var(--primary-color)' }}>
          <h3 style={{ marginBottom: '1rem' }}>¿Qué sucede ahora?</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '0.75rem' }}>📧 Recibirás un email de confirmación en tu bandeja de entrada</li>
            <li style={{ marginBottom: '0.75rem' }}>📦 Tu pedido será procesado dentro de 24 horas</li>
            <li style={{ marginBottom: '0.75rem' }}>🚚 Recibirás tracking cuando el paquete salga en camino</li>
            <li>✅ Entrega estimada en 2-3 días hábiles</li>
          </ul>
        </div>

        {/* BOTONES DE ACCIÓN */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link
            to="/"
            style={{
              padding: '1rem 2rem',
              backgroundColor: 'var(--primary-color)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => { e.target.style.backgroundColor = 'var(--secondary-color)'; }}
            onMouseLeave={(e) => { e.target.style.backgroundColor = 'var(--primary-color)'; }}
          >
            Volver al Inicio
          </Link>
          <Link
            to="/productos"
            style={{
              padding: '1rem 2rem',
              backgroundColor: 'var(--accent-color)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => { e.target.style.backgroundColor = 'var(--accent-light)'; }}
            onMouseLeave={(e) => { e.target.style.backgroundColor = 'var(--accent-color)'; }}
          >
            Seguir Comprando
          </Link>
        </div>
      </div>
    </div>
  );
}
