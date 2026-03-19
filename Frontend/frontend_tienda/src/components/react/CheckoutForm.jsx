import React, { useState, useEffect } from 'react';
import { getCart, clearCart } from '../utils/cart.js';
import { formatPrice } from '../utils/format.js';
import { createCliente, getClientes, createPedido } from '../services/index.js';
import '../styles/checkout.css';

export default function CheckoutForm() {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [clientes, setClientes] = useState([]);
  const [selectMode, setSelectMode] = useState('new'); // 'new' o 'existing'
  const [selectedClienteId, setSelectedClienteId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [pedidoId, setPedidoId] = useState(null);

  const [newCliente, setNewCliente] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    direccion: '',
  });

  useEffect(() => {
    const savedCart = getCart();
    setCart(savedCart);
    const sum = savedCart.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
    setTotal(sum);

    loadClientes();
  }, []);

  const loadClientes = async () => {
    try {
      const data = await getClientes();
      setClientes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error cargando clientes:', err);
    }
  };

  const handleClienteChange = (e) => {
    setNewCliente({
      ...newCliente,
      [e.target.name]: e.target.value
    });
    setError(null);
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    
    if (cart.length === 0) {
      setError('El carrito está vacío');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      let clienteId = selectedClienteId;

      // Crear cliente si es necesario
      if (selectMode === 'new') {
        if (!newCliente.nombre || !newCliente.email || !newCliente.telefono) {
          setError('Por favor rellena todos los campos del cliente');
          setLoading(false);
          return;
        }

        const clienteResponse = await createCliente(newCliente);
        clienteId = clienteResponse.id;
      }

      // Crear pedido
      const detalles = cart.map(item => ({
        productoId: item.id,
        cantidad: item.cantidad
      }));

      const pedidoData = {
        clienteId,
        detalles
      };

      const response = await createPedido(pedidoData);
      
      setSuccess(true);
      setPedidoId(response.id);
      
      // Limpiar carrito y redirigir
      clearCart();
      window.dispatchEvent(new Event('cartUpdated'));

      // Redirigir a confirmación después de 2 segundos
      setTimeout(() => {
        window.location.href = `/pedido-confirmacion?id=${response.id}`;
      }, 2000);

    } catch (err) {
      console.error('Error:', err);
      setError(err.message || 'Error al procesar el pedido');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0 && !success) {
    return (
      <div className="checkout-empty">
        <p>Tu carrito está vacío. Agregar productos antes de hacer checkout.</p>
        <a href="/productos" className="btn btn-primary">Continuar comprando</a>
      </div>
    );
  }

  if (success) {
    return (
      <div className="checkout-success">
        <h2>✓ Pedido realizado exitosamente</h2>
        <p>ID del pedido: <strong>#{pedidoId}</strong></p>
        <p>Serás redirigido a la página de confirmación...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handlePlaceOrder} className="checkout-form">
      <h2>Finalizar Compra</h2>

      {error && <div className="form-error-box">{error}</div>}

      <div className="checkout-grid">
        {/* Resumen del carrito */}
        <div className="checkout-items">
          <h3>Resumen del pedido</h3>
          {cart.map(item => (
            <div key={item.id} className="checkout-item">
              <div>
                <p className="item-name">{item.nombre}</p>
                <p className="item-qty">Cantidad: {item.cantidad}</p>
              </div>
              <p className="item-price">{formatPrice(item.precio * item.cantidad)}</p>
            </div>
          ))}
          <div className="checkout-total">
            <span>Total:</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>

        {/* Datos del cliente */}
        <div className="checkout-client">
          <h3>Información del cliente</h3>

          <div className="mode-selector">
            <label>
              <input
                type="radio"
                value="existing"
                checked={selectMode === 'existing'}
                onChange={(e) => setSelectMode(e.target.value)}
              />
              Cliente existente
            </label>
            <label>
              <input
                type="radio"
                value="new"
                checked={selectMode === 'new'}
                onChange={(e) => setSelectMode(e.target.value)}
              />
              Cliente nuevo
            </label>
          </div>

          {selectMode === 'existing' ? (
            <div className="form-group">
              <label htmlFor="cliente">Selecciona un cliente</label>
              <select
                id="cliente"
                value={selectedClienteId}
                onChange={(e) => setSelectedClienteId(e.target.value)}
                required
              >
                <option value="">-- Selecciona --</option>
                {clientes.map(cliente => (
                  <option key={cliente.id} value={cliente.id}>
                    {cliente.nombre} {cliente.apellido} - {cliente.email}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <>
              <div className="form-group">
                <label htmlFor="nombre">Nombre *</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={newCliente.nombre}
                  onChange={handleClienteChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="apellido">Apellido</label>
                <input
                  type="text"
                  id="apellido"
                  name="apellido"
                  value={newCliente.apellido}
                  onChange={handleClienteChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={newCliente.email}
                  onChange={handleClienteChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="telefono">Teléfono *</label>
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  value={newCliente.telefono}
                  onChange={handleClienteChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="direccion">Dirección</label>
                <textarea
                  id="direccion"
                  name="direccion"
                  value={newCliente.direccion}
                  onChange={handleClienteChange}
                  rows="3"
                />
              </div>
            </>
          )}

          <button type="submit" disabled={loading} className="btn btn-primary btn-large">
            {loading ? 'Procesando pedido...' : 'Realizar Pedido'}
          </button>

          <a href="/carrito" className="btn btn-outline btn-large">
            Volver al carrito
          </a>
        </div>
      </div>
    </form>
  );
}
