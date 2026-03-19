import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { LoadingSpinner, ErrorMessage } from '../components/LoadingStates';
import { productosService } from '../services/api';
import { cartUtils } from '../utils/index';

export default function HomePage() {
  const [productos, setProductos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarProductosDestacados();
  }, []);

  const cargarProductosDestacados = async () => {
    try {
      setIsLoading(true);
      const data = await productosService.getAll();
      // Mostrar solo los primeros 6 productos destacados
      setProductos(Array.isArray(data) ? data.slice(0, 6) : []);
    } catch (err) {
      setError(err.message || 'Error al cargar los productos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = (producto) => {
    cartUtils.addToCart(producto);
    // Emitir evento para actualizar Badge del carrito
    window.dispatchEvent(new Event('cartUpdated'));
    alert('✅ Producto agregado al carrito');
  };

  return (
    <div className="page-section">
      {/* HERO */}
      <section className="hero">
        <h1>⚽ Bienvenido a El Reino del Fútbol</h1>
        <p>Tu tienda online de confianza para toda la equipación deportiva</p>
        <Link to="/productos" className="hero-btn">
          Explorar Productos
        </Link>
      </section>

      {/* CARACTERÍSTICAS */}
      <section className="features" style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
          <div style={{ textAlign: 'center', padding: '2rem', background: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '1rem' }}>🚚</span>
            <h3>Envío Rápido</h3>
            <p>Entrega en 24-48 horas a toda España</p>
          </div>
          <div style={{ textAlign: 'center', padding: '2rem', background: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '1rem' }}>💳</span>
            <h3>Pago Seguro</h3>
            <p>Compra con confianza y seguridad</p>
          </div>
          <div style={{ textAlign: 'center', padding: '2rem', background: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '1rem' }}>🔄</span>
            <h3>Devolución Fácil</h3>
            <p>30 días para devolver si no estás satisfecho</p>
          </div>
        </div>
      </section>

      {/* PRODUCTOS DESTACADOS */}
      <section>
        <div className="section-title">
          <h2>Productos Destacados</h2>
          <p>Descubre nuestras ofertas especiales</p>
        </div>

        {isLoading ? (
          <LoadingSpinner message="Cargando productos..." />
        ) : error ? (
          <ErrorMessage message={error} onRetry={cargarProductosDestacados} />
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
              {productos.map(producto => (
                <ProductCard
                  key={producto.id}
                  producto={producto}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <Link to="/productos" className="hero-btn">
                Ver Todos los Productos
              </Link>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
