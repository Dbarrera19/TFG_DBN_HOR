import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { categoriasService } from '../services/api';
import { LoadingSpinner, ErrorMessage, EmptyState } from '../components/LoadingStates';

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarCategorias();
  }, []);

  const cargarCategorias = async () => {
    try {
      setIsLoading(true);
      const data = await categoriasService.getAll();
      setCategorias(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Error al cargar las categorías');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Cargando categorías..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={cargarCategorias} />;
  }

  if (categorias.length === 0) {
    return <EmptyState message="No hay categorías disponibles" />;
  }

  return (
    <div className="page-section">
      <div className="section-title">
        <h1>Categorías</h1>
        <p>Explora nuestras categorías de productos</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        {categorias.map(categoria => (
          <div
            key={categoria.id}
            style={{
              background: 'white',
              padding: '2rem',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              textAlign: 'center',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
              {categoria.icono || '📦'}
            </div>
            <h3 style={{ marginBottom: '0.5rem' }}>{categoria.nombre}</h3>
            <p style={{ color: 'var(--text-light)', marginBottom: '1.5rem' }}>
              {categoria.descripcion || 'Explora esta categoría'}
            </p>
            <Link
              to={`/productos?categoria=${categoria.id}`}
              style={{
                display: 'inline-block',
                padding: '0.75rem 1.5rem',
                backgroundColor: 'var(--primary-color)',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '8px',
                fontWeight: 'bold',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'var(--secondary-color)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'var(--primary-color)';
              }}
            >
              Ver Productos →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
