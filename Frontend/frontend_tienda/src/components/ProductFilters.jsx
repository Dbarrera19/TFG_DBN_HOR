import React from 'react';
import '../styles/product-filters.css';

export default function ProductFilters({ 
  categorias, 
  selectedCategory, 
  onCategoryChange,
  searchTerm,
  onSearchChange 
}) {
  return (
    <div className="filters">
      <div className="filter-group">
        <label htmlFor="search">Buscar productos:</label>
        <input
          id="search"
          type="text"
          placeholder="Buscar por nombre..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="filter-group">
        <label htmlFor="category">Categoría:</label>
        <select
          id="category"
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="category-select"
        >
          <option value="">Todas las categorías</option>
          {categorias.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.nombre}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
