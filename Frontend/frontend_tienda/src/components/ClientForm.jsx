import React, { useState } from 'react';
import '../styles/forms.css';

export default function ClientForm({ initialData = {}, onSubmit, isLoading = false }) {
  const [formData, setFormData] = useState({
    nombre: initialData.nombre || '',
    apellido: initialData.apellido || '',
    email: initialData.email || '',
    telefono: initialData.telefono || '',
    direccion: initialData.direccion || '',
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }
    if (!formData.apellido.trim()) {
      newErrors.apellido = 'El apellido es requerido';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    if (!formData.telefono.trim()) {
      newErrors.telefono = 'El teléfono es requerido';
    }
    if (!formData.direccion.trim()) {
      newErrors.direccion = 'La dirección es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form className="client-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="nombre">Nombre *</label>
        <input
          id="nombre"
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          placeholder="Juan"
          className={errors.nombre ? 'input-error' : ''}
        />
        {errors.nombre && <span className="error-text">{errors.nombre}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="apellido">Apellido *</label>
        <input
          id="apellido"
          type="text"
          name="apellido"
          value={formData.apellido}
          onChange={handleChange}
          placeholder="Pérez"
          className={errors.apellido ? 'input-error' : ''}
        />
        {errors.apellido && <span className="error-text">{errors.apellido}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="email">Email *</label>
        <input
          id="email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="juan@example.com"
          className={errors.email ? 'input-error' : ''}
        />
        {errors.email && <span className="error-text">{errors.email}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="telefono">Teléfono *</label>
        <input
          id="telefono"
          type="tel"
          name="telefono"
          value={formData.telefono}
          onChange={handleChange}
          placeholder="+34 912345678"
          className={errors.telefono ? 'input-error' : ''}
        />
        {errors.telefono && <span className="error-text">{errors.telefono}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="direccion">Dirección *</label>
        <textarea
          id="direccion"
          name="direccion"
          value={formData.direccion}
          onChange={handleChange}
          placeholder="Calle Principal 123, 28001 Madrid"
          rows="3"
          className={errors.direccion ? 'input-error' : ''}
        />
        {errors.direccion && <span className="error-text">{errors.direccion}</span>}
      </div>

      <button 
        type="submit" 
        className="submit-btn"
        disabled={isLoading}
      >
        {isLoading ? 'Guardando...' : 'Guardar'}
      </button>
    </form>
  );
}
