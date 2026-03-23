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
      setProductos(Array.isArray(data) ? data.slice(0, 6) : []);
    } catch (err) {
      setError(err.message || 'Error al cargar los productos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = (producto) => {
    cartUtils.addToCart(producto);
    window.dispatchEvent(new Event('cartUpdated'));
    alert('✅ Producto agregado al carrito');
  };

  return (
    <div className="home-page">
      {/* HERO SECTION CON LOGO */}
      <section className="hero-premium">
        <div className="hero-background">
          <div className="hero-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
          </div>
        </div>
        
        <div className="hero-content">
          <img src="/logo.png" alt="El Reino del Fútbol" className="hero-logo" />
          
          <div className="hero-text">
            <h1 className="hero-title">Bienvenido al Reino del Fútbol</h1>
            <p className="hero-subtitle">
              La tienda líder en equipación deportiva profesional. 
              <br />
              Como los campeones, mereces lo mejor.
            </p>
          </div>

          <div className="hero-buttons">
            <Link to="/productos" className="btn-hero btn-primary-hero">
              <span className="btn-icon">⚽</span>
              Explorar Productos
            </Link>
            <Link to="/categorias" className="btn-hero btn-secondary-hero">
              <span className="btn-icon">🏆</span>
              Ver Categorías
            </Link>
          </div>
        </div>
      </section>

      {/* CARACTERÍSTICAS PREMIUM */}
      <section className="features-section">
        <div className="section-header">
          <h2>¿Por qué elegirnos?</h2>
          <p>Todo lo que necesitas para ser un campeón</p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon premium-icon">🚚</div>
            <h3>Envío Rápido</h3>
            <p>Entrega en 24-48 horas a toda España con rastreo completo</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon premium-icon">🛡️</div>
            <h3>Pago Seguro</h3>
            <p>Certificado SSL con encriptación de datos. Tu compra es 100% segura</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon premium-icon">💯</div>
            <h3>Calidad Garantizada</h3>
            <p>Solo productos de marcas líderes con garantía oficial</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon premium-icon">🔄</div>
            <h3>Devolución Fácil</h3>
            <p>30 días para devolver si no estás satisfecho. Sin preguntas</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon premium-icon">📞</div>
            <h3>Soporte Experto</h3>
            <p>Nuestro equipo está disponible para resolver tus dudas</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon premium-icon">⭐</div>
            <h3>Confianza Probada</h3>
            <p>+ 10,000 clientes satisfechos en toda España</p>
          </div>
        </div>
      </section>

      {/* PRODUCTOS DESTACADOS */}
      <section className="products-section">
        <div className="section-header">
          <h2>Productos Destacados</h2>
          <p>Descubre nuestras mejores ofertas y productos más vendidos</p>
        </div>

        {isLoading ? (
          <LoadingSpinner message="Cargando productos extraordinarios..." />
        ) : error ? (
          <ErrorMessage message={error} onRetry={cargarProductosDestacados} />
        ) : (
          <>
            <div className="products-grid">
              {productos.map(producto => (
                <ProductCard
                  key={producto.id}
                  producto={producto}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>

            <div className="view-all-container">
              <Link to="/productos" className="btn-view-all">
                Ver Todos los Productos
                <span className="arrow">→</span>
              </Link>
            </div>
          </>
        )}
      </section>

      {/* LLama a la ACCIOON FINAL */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>¿Listo para mejorar tu juego?</h2>
          <p>Encuentra todo lo que necesitas para ser un campeón</p>
          <Link to="/productos" className="btn-cta">
            Empezar a Comprar Ahora
          </Link>
        </div>
      </section>

      {/* ESTILOS INLINE */}
      <style>{`
        .home-page {
          width: 100%;
          overflow: hidden;
        }

        .hero-premium {
          position: relative;
          min-height: 85vh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-light) 50%, var(--secondary-color) 100%);
        }

        .hero-background {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          overflow: hidden;
        }

        .hero-shapes {
          position: absolute;
          width: 100%;
          height: 100%;
        }

        .shape {
          position: absolute;
          opacity: 0.1;
        }

        .shape-1 {
          width: 800px;
          height: 800px;
          background: radial-gradient(circle, var(--accent-color) 0%, transparent 70%);
          border-radius: 50%;
          top: -200px;
          right: -200px;
          animation: float 6s ease-in-out infinite;
        }

        .shape-2 {
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, var(--accent-color) 0%, transparent 70%);
          border-radius: 50%;
          bottom: -150px;
          left: -150px;
          animation: float 8s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(30px) translateX(20px); }
        }

        .hero-content {
          position: relative;
          z-index: 2;
          text-align: center;
          color: white;
          padding: 2rem;
          max-width: 900px;
          animation: fadeInUp 0.8s ease-out;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .hero-logo {
          max-width: 300px;
          width: 100%;
          height: auto;
          margin: 0 auto 2rem;
          filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.3));
          animation: scaleIn 0.8s ease-out;
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .hero-title {
          font-size: clamp(2.5rem, 8vw, 4rem);
          font-weight: 900;
          margin: 1rem 0;
          letter-spacing: -1px;
          text-shadow: 2px 4px 8px rgba(0, 0, 0, 0.2);
          color: var(--accent-color);
        }

        .hero-subtitle {
          font-size: clamp(1rem, 3vw, 1.3rem);
          line-height: 1.8;
          margin-bottom: 2rem;
          opacity: 0.95;
          font-weight: 300;
        }

        .hero-buttons {
          display: flex;
          gap: 1.5rem;
          justify-content: center;
          flex-wrap: wrap;
          margin-top: 2rem;
        }

        .btn-hero {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 2rem;
          font-size: 1.1rem;
          font-weight: 700;
          border-radius: var(--radius);
          text-decoration: none;
          transition: var(--transition);
          border: none;
          cursor: pointer;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
        }

        .btn-primary-hero {
          background: linear-gradient(135deg, var(--accent-color), var(--accent-dark));
          color: var(--primary-color);
        }

        .btn-primary-hero:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 28px rgba(255, 215, 0, 0.3);
        }

        .btn-secondary-hero {
          background: rgba(255, 255, 255, 0.15);
          color: white;
          border: 2px solid white;
        }

        .btn-secondary-hero:hover {
          background: rgba(255, 255, 255, 0.25);
          transform: translateY(-3px);
          box-shadow: 0 12px 28px rgba(255, 255, 255, 0.2);
        }

        .btn-icon {
          font-size: 1.3rem;
        }

        .features-section {
          padding: 6rem 2rem;
          background: var(--bg-light);
          position: relative;
        }

        .section-header {
          text-align: center;
          margin-bottom: 4rem;
        }

        .section-header h2 {
          font-size: clamp(2rem, 5vw, 3rem);
          margin-bottom: 1rem;
          color: var(--primary-color);
        }

        .section-header p {
          font-size: 1.2rem;
          color: var(--text-light);
          max-width: 600px;
          margin: 0 auto;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        .feature-card {
          background: white;
          padding: 2.5rem 2rem;
          border-radius: var(--radius);
          text-align: center;
          transition: var(--transition);
          box-shadow: var(--shadow);
          border-left: 4px solid var(--accent-color);
        }

        .feature-card:hover {
          transform: translateY(-8px);
          box-shadow: var(--shadow-xl);
          border-left-color: var(--primary-color);
        }

        .premium-icon {
          font-size: 3.5rem;
          margin-bottom: 1rem;
          display: block;
        }

        .feature-card h3 {
          font-size: 1.3rem;
          margin-bottom: 0.75rem;
          color: var(--primary-color);
        }

        .feature-card p {
          color: var(--text-light);
          font-size: 0.95rem;
          line-height: 1.6;
          margin-bottom: 0;
        }

        .products-section {
          padding: 6rem 2rem;
          background: white;
        }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
          max-width: 1400px;
          margin: 0 auto 3rem;
        }

        .view-all-container {
          text-align: center;
        }

        .btn-view-all {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 2.5rem;
          font-size: 1.1rem;
          font-weight: 700;
          background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
          color: white;
          border-radius: var(--radius);
          text-decoration: none;
          transition: var(--transition);
          box-shadow: var(--shadow-lg);
        }

        .btn-view-all:hover {
          transform: translateY(-3px);
          box-shadow: var(--shadow-xl);
        }

        .arrow {
          font-size: 1.3rem;
          display: inline-block;
          transition: var(--transition);
        }

        .btn-view-all:hover .arrow {
          transform: translateX(5px);
        }

        .cta-section {
          background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-light) 100%);
          padding: 6rem 2rem;
          text-align: center;
          color: white;
          position: relative;
          overflow: hidden;
        }

        .cta-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at 20% 80%, rgba(255, 215, 0, 0.1) 0%, transparent 50%);
          pointer-events: none;
        }

        .cta-content {
          position: relative;
          z-index: 1;
          max-width: 700px;
          margin: 0 auto;
        }

        .cta-section h2 {
          font-size: clamp(1.8rem, 5vw, 2.8rem);
          margin-bottom: 1rem;
          color: white;
        }

        .cta-section p {
          font-size: 1.2rem;
          margin-bottom: 2rem;
          opacity: 0.95;
        }

        .btn-cta {
          display: inline-block;
          padding: 1.2rem 3rem;
          background: linear-gradient(135deg, var(--accent-color), var(--accent-dark));
          color: var(--primary-color);
          font-weight: 800;
          font-size: 1.1rem;
          border-radius: var(--radius);
          text-decoration: none;
          transition: var(--transition);
          box-shadow: 0 10px 30px rgba(255, 215, 0, 0.3);
          border: none;
          cursor: pointer;
        }

        .btn-cta:hover {
          transform: translateY(-3px) scale(1.05);
          box-shadow: 0 15px 40px rgba(255, 215, 0, 0.4);
        }

        /* RESPONSIVO */
        @media (max-width: 768px) {
          .hero-premium {
            min-height: 70vh;
            padding: 2rem;
          }

          .hero-logo {
            max-width: 200px;
            margin: 1rem auto 1.5rem;
          }

          .hero-buttons {
            flex-direction: column;
            gap: 1rem;
          }

          .btn-hero {
            width: 100%;
            justify-content: center;
          }

          .features-grid,
          .products-grid {
            gap: 1.5rem;
          }

          .features-section,
          .products-section {
            padding: 4rem 1rem;
          }

          .section-header {
            margin-bottom: 2rem;
          }

          .feature-card {
            padding: 2rem 1.5rem;
          }

          .cta-section {
            padding: 4rem 1rem;
          }
        }

        @media (max-width: 480px) {
          .hero-premium {
            min-height: 60vh;
          }

          .hero-logo {
            max-width: 150px;
          }

          .hero-title {
            font-size: 1.8rem;
          }

          .hero-subtitle {
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
}
