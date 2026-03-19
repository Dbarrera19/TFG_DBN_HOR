import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ClientForm from '../components/ClientForm';
import { cartUtils, formatUtils } from '../utils/index';
import { pedidosService, clientesService } from '../services/api';
import { LoadingSpinner, SuccessMessage, ErrorMessage } from '../components/LoadingStates';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState('');
  const [isCreatingNewClient, setIsCreatingNewClient] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setIsLoading(true);
      const cart = cartUtils.getCart();
      setCart(cart);

      const clientesData = await clientesService.getAll();
      setClientes(Array.isArray(clientesData) ? clientesData : []);
    } catch (err) {
      setError(err.message || 'Error al cargar los datos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClientSubmit = async (clientData) => {
    try {
      setIsSubmitting(true);
      const nuevoCliente = await clientesService.create(clientData);
      setSelectedClientId(nuevoCliente.id);
      setClientes([...clientes, nuevoCliente]);
      setIsCreatingNewClient(false);
      alert('✅ Cliente creado correctamente');
    } catch (err) {
      alert('❌ Error al crear el cliente: ' + (err.message || 'Error desconocido'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitOrder = async () => {
    if (!selectedClientId) {
      alert('⚠️ Debes seleccionar o crear un cliente');
      return;
    }

    if (cart.length === 0) {
      alert('⚠️ Tu carrito está vacío');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');

      // Preparar detalles del pedido
      const detalles = cart.map(item => ({
        productoId: item.id,
        cantidad: item.cantidad,
      }));

      const pedidoData = {
        clienteId: parseInt(selectedClientId),
        detalles: detalles,
      };

      // Crear el pedido
      const pedido = await pedidosService.create(pedidoData);

      // Limpiar carrito
      cartUtils.clearCart();
      window.dispatchEvent(new Event('cartUpdated'));

      // Mostrar mensaje de éxito
      setSuccessMessage('✅ ¡Pedido creado exitosamente!');

      // Redirigir a confirmación después de 2 segundos
      setTimeout(() => {
        navigate(`/confirmacion-pedido/${pedido.id}`);
      }, 2000);
    } catch (err) {
      const errorMsg = err.apiErrors?.join(', ') || err.message || 'Error desconocido';
      setError('❌ Error al crear el pedido: ' + errorMsg);
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Cargando información..." />;
  }

  if (cart.length === 0 && !successMessage) {
    return (
      <div className="page-section">
        <ErrorMessage
          message="Tu carrito está vacío. Por favor agrega productos antes de continuar."
          onRetry={() => navigate('/productos')}
        />
      </div>
    );
  }

  const totales = cartUtils.calculateTotals(cart);

  return (
    <div className="page-section">
      <div className="section-title">
        <h1>Checkout</h1>
        <p>Finalizá tu compra</p>
      </div>

      {successMessage && (
        <SuccessMessage
          message={successMessage}
          onClose={() => setSuccessMessage('')}
        />
      )}

      {error && (
        <ErrorMessage message={error} />
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem', marginTop: '2rem' }}>
        {/* FORMULARIO DE CLIENTE */}
        <div>
          <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>Selecciona un Cliente</h2>

            {!isCreatingNewClient ? (
              <>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label htmlFor="client-select" style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem' }}>
                    Cliente Existente:
                  </label>
                  <select
                    id="client-select"
                    value={selectedClientId}
                    onChange={(e) => setSelectedClientId(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border-color)', borderRadius: '8px' }}
                    disabled={isSubmitting}
                  >
                    <option value="">-- Selecciona un cliente --</option>
                    {clientes.map(cliente => (
                      <option key={cliente.id} value={cliente.id}>
                        {cliente.nombre} {cliente.apellido} ({cliente.email})
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={() => setIsCreatingNewClient(true)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    backgroundColor: 'var(--accent-color)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                  }}
                >
                  Crear Nuevo Cliente
                </button>
              </>
            ) : (
              <>
                <ClientForm
                  onSubmit={handleClientSubmit}
                  isLoading={isSubmitting}
                />
                <button
                  onClick={() => setIsCreatingNewClient(false)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    marginTop: '1rem',
                    backgroundColor: '#ccc',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                  }}
                  disabled={isSubmitting}
                >
                  Cancelar
                </button>
              </>
            )}
          </div>

          {/* RESUMEN DEL CARRITO */}
          <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>Resumen de tu Compra</h2>
            {cart.map(item => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)', marginBottom: '0.75rem' }}>
                <div>
                  <strong>{item.nombre}</strong>
                  <span style={{ display: 'block', color: 'var(--text-light)', fontSize: '0.9rem' }}>
                    {item.cantidad} x {formatUtils.formatPrice(item.precio)}
                  </span>
                </div>
                <div>
                  <strong>{formatUtils.formatPrice(item.precio * item.cantidad)}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* TOTALES Y BOTÓN */}
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', height: 'fit-content', position: 'sticky', top: '100px' }}>
          <h3 style={{ marginBottom: '1rem' }}>Totales</h3>

          <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)', marginBottom: '0.75rem' }}>
            <span>Subtotal:</span>
            <strong>{formatUtils.formatPrice(totales.subtotal)}</strong>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: '2px solid var(--border-color)', marginBottom: '1rem' }}>
            <span>IVA (21%):</span>
            <strong>{formatUtils.formatPrice(totales.impuestos)}</strong>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1.5rem', color: 'var(--primary-color)' }}>
            <span>Total:</span>
            <span>{formatUtils.formatPrice(totales.total)}</span>
          </div>

          <button
            onClick={handleSubmitOrder}
            disabled={isSubmitting || !selectedClientId}
            style={{
              width: '100%',
              padding: '1rem',
              backgroundColor: selectedClientId && !isSubmitting ? 'var(--primary-color)' : '#ccc',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: selectedClientId && !isSubmitting ? 'pointer' : 'not-allowed',
              fontSize: '1rem',
              transition: 'all 0.3s ease',
            }}
          >
            {isSubmitting ? 'Procesando...' : '✓ Finalizar Compra'}
          </button>

          <button
            onClick={() => navigate('/productos')}
            style={{
              width: '100%',
              padding: '0.75rem',
              marginTop: '0.75rem',
              backgroundColor: 'var(--accent-color)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
            disabled={isSubmitting}
          >
            Seguir Comprando
          </button>
        </div>
      </div>
    </div>
  );
}
