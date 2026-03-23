import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import ProductFilters from '../components/ProductFilters';
import { LoadingSpinner, ErrorMessage, EmptyState } from '../components/LoadingStates';
import { productosService, categoriasService } from '../services/api';
import { cartUtils } from '../utils/index';

export default function ProductosPage() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [filteredProductos, setFilteredProductos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    cargarDatos();
  }, []);

  useEffect(() => {
    filtrarProductos();
  }, [productos, categorias, selectedCategory, searchTerm]);

  const cargarDatos = async () => {
    try {
      setIsLoading(true);
      const [productosData, categoriasData] = await Promise.all([
        productosService.getAll(),
        categoriasService.getAll(),
      ]);
      setProductos(Array.isArray(productosData) ? productosData : []);
      setCategorias(Array.isArray(categoriasData) ? categoriasData : []);
    } catch (err) {
      setError(err.message || 'Error al cargar los datos');
    } finally {
      setIsLoading(false);
    }
  };

  const filtrarProductos = () => {
    let filtered = [...productos];

    if (selectedCategory) {
      filtered = filtered.filter(p => p.categoriaId === parseInt(selectedCategory));
    }

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(p =>
        p.nombre.toLowerCase().includes(search) ||
        p.descripcion.toLowerCase().includes(search) ||
        p.marca.toLowerCase().includes(search)
      );
    }

    setFilteredProductos(filtered);
  };

  const handleAddToCart = (producto) => {
    cartUtils.addToCart(producto);
    window.dispatchEvent(new Event('cartUpdated'));
    alert('✅ Producto agregado al carrito');
  };

  return (
    <div className="page-section">
      <div className="section-title">
        <h1>Nuestros Productos</h1>
        <p>Encuentra todo lo que necesitas para tu pasión por el fútbol</p>
      </div>

      {isLoading ? (
        <LoadingSpinner message="Cargando productos..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={cargarDatos} />
      ) : (
        <>
          <ProductFilters
            categorias={categorias}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />

          {filteredProductos.length === 0 ? (
            <EmptyState message="No se encontraron productos que coincidan con tu búsqueda" />
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '2rem' }}>
              {filteredProductos.map(producto => (
                <ProductCard
                  key={producto.id}
                  producto={producto}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
