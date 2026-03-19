import React, { useState, useEffect } from 'react';
import CartSummary from '../components/CartSummary';
import { cartUtils } from '../utils/index';

export default function CarritoPage() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    actualizarCarrito();
    // Escuchar cambios en el carrito
    window.addEventListener('cartUpdated', actualizarCarrito);
    return () => window.removeEventListener('cartUpdated', actualizarCarrito);
  }, []);

  const actualizarCarrito = () => {
    setCart(cartUtils.getCart());
  };

  const handleUpdateQuantity = (productId, cantidad) => {
    const nuevoCarrito = cartUtils.updateQuantity(productId, cantidad);
    setCart(nuevoCarrito);
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const handleRemove = (productId) => {
    const nuevoCarrito = cartUtils.removeFromCart(productId);
    setCart(nuevoCarrito);
    window.dispatchEvent(new Event('cartUpdated'));
  };

  return (
    <div className="page-section">
      <div className="section-title">
        <h1>Carrito de Compras</h1>
        <p>Revisa y finaliza tu compra</p>
      </div>

      <CartSummary
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemove={handleRemove}
      />
    </div>
  );
}
