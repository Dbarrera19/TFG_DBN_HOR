import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/product-card.css';
import { formatUtils, cartUtils } from '../utils/index';

export default function ProductCard({ producto, onAddToCart }) {
  const handleAddClick = (e) => {
    e.preventDefault();
    onAddToCart(producto);
  };

  return (
    <div className="product-card">
      <Link to={`/producto/${producto.id}`} className="product-card-link">
        <div className="product-image">
          <img 
            src={producto.imagen || 'https://via.placeholder.com/250x250?text=No+imagen'} 
            alt={producto.nombre}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/250x250?text=No+imagen';
            }}
          />
          {producto.stock === 0 && <div className="out-of-stock">Agotado</div>}
        </div>

        <div className="product-info">
          <div className="product-category">{producto.categoriaNombre || 'Categoría'}</div>
          <h3 className="product-name">{producto.nombre}</h3>
          <p className="product-description">
            {formatUtils.truncateText(producto.descripcion, 80)}
          </p>
          
          <div className="product-details">
            {producto.marca && <span className="badge">🏆 {producto.marca}</span>}
            {producto.talla && <span className="badge">📏 {producto.talla}</span>}
          </div>

          <div className="product-price">
            <span className="price">{formatUtils.formatPrice(producto.precio)}</span>
            <span className="stock">Stock: {producto.stock}</span>
          </div>
        </div>
      </Link>

      <button 
        className="add-to-cart-btn"
        onClick={handleAddClick}
        disabled={producto.stock === 0}
      >
        {producto.stock === 0 ? 'No disponible' : '🛒 Agregar'}
      </button>
    </div>
  );
}
