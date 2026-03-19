import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { LoadingSpinner, ErrorMessage } from '../components/LoadingStates';
import { productosService } from '../services/api';
import { cartUtils, formatUtils } from '../utils/index';

export default function ProductDetailPage() {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cantidad, setCantidad] = useState(1);

  useEffect(() => {
    cargarProducto();
  }, [id]);

  const cargarProducto = async () => {
    try {
      setIsLoading(true);
      const data = await productosService.getById(id);
      setProducto(data);
    } catch (err) {
      setError(err.message || 'Error al cargar el producto');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!producto) return;
    for (let i = 0; i < cantidad; i++) {
      cartUtils.addToCart(producto);
    }
    window.dispatchEvent(new Event('cartUpdated'));
    alert(`✅ ${cantidad} producto(s) agregado(s) al carrito`);
    setCantidad(1);
  };

  if (isLoading) {
    return <LoadingSpinner message="Cargando producto..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={cargarProducto} />;
  }

  if (!producto) {
    return <ErrorMessage message="Producto no encontrado" />;
  }

  return (
    <div className="page-section">
      <Link to="/productos" style={{ marginBottom: '2rem', display: 'inline-block', color: 'var(--primary-color)', fontWeight: 'bold' }}>
        ← Volver a productos
      </Link>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', marginTop: '2rem' }}>
        {/* IMAGEN */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img
            src={producto.imagen || 'https://via.placeholder.com/400x400?text=No+imagen'}
            alt={producto.nombre}
            style={{
              maxWidth: '100%',
              height: 'auto',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              onError: (e) => { e.target.src = 'https://via.placeholder.com/400x400?text=No+imagen'; }
            }}
            onError={(e) => { e.target.src = 'https://via.placeholder.com/400x400?text=No+imagen'; }}
          />
        </div>

        {/* DETALLES */}
        <div>
          <div style={{ marginBottom: '1rem' }}>
            <span style={{ color: 'var(--accent-color)', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.9rem' }}>
              {producto.categoriaNombre || 'Categoría'}
            </span>
          </div>

          <h1 style={{ marginBottom: '1rem', fontSize: '2.5rem' }}>{producto.nombre}</h1>

          <p style={{ color: 'var(--text-light)', fontSize: '1.1rem', marginBottom: '1.5rem', lineHeight: '1.6' }}>
            {producto.descripcion}
          </p>

          {/* PROPIEDADES */}
          <div style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
            {producto.marca && (
              <div>
                <strong>Marca:</strong> {producto.marca}
              </div>
            )}
            {producto.talla && (
              <div>
                <strong>Talla:</strong> {producto.talla}
              </div>
            )}
            <div>
              <strong>Stock:</strong> <span style={{ color: producto.stock > 0 ? 'var(--success-color)' : 'var(--danger-color)' }}>
                {producto.stock > 0 ? `${producto.stock} unidades disponibles` : 'Agotado'}
              </span>
            </div>
          </div>

          {/* PRECIO Y COMPRA */}
          <div style={{ borderTop: '2px solid var(--border-color)', paddingTop: '2rem' }}>
            <div style={{ fontSize: '2rem', color: 'var(--accent-color)', fontWeight: 'bold', marginBottom: '1.5rem' }}>
              {formatUtils.formatPrice(producto.precio)}
            </div>

            {producto.stock > 0 ? (
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-color)', borderRadius: '8px', overflow: 'hidden' }}>
                  <button
                    onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                    style={{ padding: '0.75rem 1rem', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={cantidad}
                    onChange={(e) => setCantidad(Math.max(1, parseInt(e.target.value) || 1))}
                    style={{ width: '60px', textAlign: 'center', border: 'none', fontSize: '1rem', fontWeight: 'bold' }}
                  />
                  <button
                    onClick={() => setCantidad(cantidad + 1)}
                    style={{ padding: '0.75rem 1rem', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  style={{
                    flex: 1,
                    backgroundColor: 'var(--primary-color)',
                    color: 'white',
                    padding: '0.75rem 2rem',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => { e.target.style.backgroundColor = 'var(--secondary-color)'; }}
                  onMouseLeave={(e) => { e.target.style.backgroundColor = 'var(--primary-color)'; }}
                >
                  🛒 Agregar al Carrito
                </button>
              </div>
            ) : (
              <button
                disabled
                style={{
                  width: '100%',
                  padding: '0.75rem 2rem',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  backgroundColor: '#ccc',
                  color: '#666',
                  cursor: 'not-allowed',
                }}
              >
                No disponible
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
