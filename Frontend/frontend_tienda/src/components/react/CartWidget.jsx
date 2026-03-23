import React, { useState, useEffect } from 'react';
import { getCart, removeFromCart, updateCartQuantity, clearCart } from '../utils/cart.js';
import { formatPrice } from '../utils/format.js';
import '../styles/cart.css';

export default function CartWidget() {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    // Cargar el carrito inicial
    const savedCart = getCart();
    setCart(savedCart);
    calculateTotal(savedCart);

    const handleStorageChange = () => {
      const updated = getCart();
      setCart(updated);
      calculateTotal(updated);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('cartUpdated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cartUpdated', handleStorageChange);
    };
  }, []);

  const calculateTotal = (items) => {
    const sum = items.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
    setTotal(sum);
  };

  const handleRemove = (productId) => {
    removeFromCart(productId);
    const updated = getCart();
    setCart(updated);
    calculateTotal(updated);
    

    window.dispatchEvent(new Event('cartUpdated'));
  };

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) {
      handleRemove(productId);
    } else {
      updateCartQuantity(productId, newQuantity);
      const updated = getCart();
      setCart(updated);
      calculateTotal(updated);
      window.dispatchEvent(new Event('cartUpdated'));
    }
  };

  const handleClearCart = () => {
    if (confirm('¿Estás seguro de que deseas vaciar el carrito?')) {
      clearCart();
      setCart([]);
      setTotal(0);
      window.dispatchEvent(new Event('cartUpdated'));
    }
  };

  if (cart.length === 0) {
    return (
      <div className="cart-empty">
        <p>Tu carrito está vacío</p>
        <a href="/productos" className="btn btn-primary">
          Continuar comprando
        </a>
      </div>
    );
  }

  return (
    <div className="cart-widget">
      <div className="cart-items">
        {cart.map((item) => (
          <div key={item.id} className="cart-item">
            <div className="item-info">
              <h3>{item.nombre}</h3>
              <p className="item-price">{formatPrice(item.precio)}</p>
            </div>

            <div className="item-quantity">
              <button
                onClick={() => handleQuantityChange(item.id, item.cantidad - 1)}
                className="qty-btn"
              >
                −
              </button>
              <span className="qty-value">{item.cantidad}</span>
              <button
                onClick={() => handleQuantityChange(item.id, item.cantidad + 1)}
                className="qty-btn"
              >
                +
              </button>
            </div>

            <div className="item-total">
              <p>{formatPrice(item.precio * item.cantidad)}</p>
              <button
                onClick={() => handleRemove(item.id)}
                className="btn-remove"
                title="Eliminar del carrito"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <div className="summary-row">
          <span>Subtotal:</span>
          <span>{formatPrice(total)}</span>
        </div>
        <div className="summary-row">
          <span>Envío:</span>
          <span>Gratis</span>
        </div>
        <div className="summary-row total">
          <span>Total:</span>
          <span>{formatPrice(total)}</span>
        </div>

        <div className="cart-actions">
          <a href="/productos" className="btn btn-outline">
            Seguir comprando
          </a>
          <a href="/checkout" className="btn btn-primary">
            Proceder al pago
          </a>
        </div>

        <button onClick={handleClearCart} className="btn-clear">
          Vaciar carrito
        </button>
      </div>
    </div>
  );
}
