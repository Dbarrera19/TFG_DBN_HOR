import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/cart.css';
import { formatUtils, cartUtils } from '../utils/index';
import { EmptyState } from './LoadingStates';

export default function CartSummary({ cart, onUpdateQuantity, onRemove }) {
  if (!cart || cart.length === 0) {
    return <EmptyState message="Tu carrito está vacío" />;
  }

  const totals = cartUtils.calculateTotals(cart);

  return (
    <div className="cart-summary">
      <div className="cart-items">
        <h2>Productos en tu carrito ({cart.length})</h2>
        {cart.map(item => (
          <div key={item.id} className="cart-item">
            <img 
              src={item.imagen} 
              alt={item.nombre}
              className="item-image"
            />
            <div className="item-info">
              <h3>{item.nombre}</h3>
              {item.talla && <p>Talla: {item.talla}</p>}
              <p className="price">{formatUtils.formatPrice(item.precio)}</p>
            </div>
            <div className="item-actions">
              <button 
                onClick={() => onUpdateQuantity(item.id, item.cantidad - 1)}
                className="qty-btn"
              >
                −
              </button>
              <input
                type="number"
                min="1"
                value={item.cantidad}
                onChange={(e) => onUpdateQuantity(item.id, parseInt(e.target.value) || 1)}
                className="qty-input"
              />
              <button 
                onClick={() => onUpdateQuantity(item.id, item.cantidad + 1)}
                className="qty-btn"
              >
                +
              </button>
            </div>
            <div className="item-total">
              {formatUtils.formatPrice(item.precio * item.cantidad)}
            </div>
            <button 
              onClick={() => onRemove(item.id)}
              className="remove-btn"
              title="Eliminar"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="cart-totals">
        <div className="total-row">
          <span>Subtotal:</span>
          <span>{formatUtils.formatPrice(totals.subtotal)}</span>
        </div>
        <div className="total-row">
          <span>IVA (21%):</span>
          <span>{formatUtils.formatPrice(totals.impuestos)}</span>
        </div>
        <div className="total-row total">
          <span>Total:</span>
          <span>{formatUtils.formatPrice(totals.total)}</span>
        </div>

        <Link to="/checkout" className="checkout-btn">
          Proceder al checkout
        </Link>
        <Link to="/productos" className="continue-shopping-btn">
          Seguir comprando
        </Link>
      </div>
    </div>
  );
}
