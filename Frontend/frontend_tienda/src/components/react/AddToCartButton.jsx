import React, { useState } from 'react';
import { addToCart } from '../utils/cart.js';
import '../styles/add-to-cart.css';

export default function AddToCartButton({ product }) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    if (product.stock < quantity) {
      alert('No hay suficiente stock disponible');
      return;
    }

    addToCart(product, quantity);
    setAdded(true);
    window.dispatchEvent(new Event('cartUpdated'));

    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="add-to-cart">
      <div className="quantity-selector">
        <label>Cantidad:</label>
        <div className="quantity-input">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
          >
            −
          </button>
          <input
            type="number"
            value={quantity}
            onChange={(e) => {
              const val = parseInt(e.target.value) || 1;
              setQuantity(Math.min(Math.max(1, val), product.stock));
            }}
            min="1"
            max={product.stock}
          />
          <button
            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
            disabled={quantity >= product.stock}
          >
            +
          </button>
        </div>
      </div>

      <button
        onClick={handleAdd}
        disabled={product.stock === 0 || added}
        className={`btn btn-primary btn-add ${added ? 'success' : ''}`}
      >
        {product.stock === 0 ? (
          'Sin stock'
        ) : added ? (
          '✓ Añadido al carrito'
        ) : (
          '🛒 Agregar al carrito'
        )}
      </button>

      {product.stock < 5 && product.stock > 0 && (
        <p className="stock-warning">⚠️ Solo quedan {product.stock} unidades</p>
      )}
    </div>
  );
}
