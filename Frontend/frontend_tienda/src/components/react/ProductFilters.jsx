import React, { useState, useEffect } from 'react';
import { getCategorias } from '../services/index.js';
import '../styles/filters.css';

export default function ProductFilters({ onFilterChange = () => {} }) {
  const [categorias, setCategorias] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCategorias();
  }, []);

  const loadCategorias = async () => {
    try {
      setLoading(true);
      const data = await getCategorias();
      setCategorias(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error cargando categorías:', err);
      setError('Error al cargar las categorías');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    onFilterChange({ 
      category: categoryId, 
      search: searchTerm 
    });
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onFilterChange({ 
      category: selectedCategory, 
      search: value 
    });
  };

  const handleReset = () => {
    setSelectedCategory('');
    setSearchTerm('');
    onFilterChange({ 
      category: '', 
      search: '' 
    });
  };

  return (
    <aside className="filters">
      <h3>Filtros</h3>

      <div className="filter-group">
        <label>Buscar</label>
        <input
          type="text"
          placeholder="Buscar productos..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
        />
      </div>

      <div className="filter-group">
        <label>Categoría</label>
        {loading ? (
          <p className="loading">Cargando...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <>
            <button
              onClick={() => handleCategoryChange('')}
              className={`category-btn ${selectedCategory === '' ? 'active' : ''}`}
            >
              Todas
            </button>
            {categorias.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`category-btn ${selectedCategory === cat.id ? 'active' : ''}`}
              >
                {cat.nombre}
              </button>
            ))}
          </>
        )}
      </div>

      {(selectedCategory || searchTerm) && (
        <button onClick={handleReset} className="btn-reset">
          Limpiar filtros
        </button>
      )}
    </aside>
  );
}
