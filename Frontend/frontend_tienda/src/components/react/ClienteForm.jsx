import React, { useState } from 'react';
import { createCliente } from '../services/index.js';
import '../styles/forms.css';

export default function ClienteForm({ onClienteCreated = () => {} }) {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    direccion: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.nombre || !formData.email || !formData.telefono) {
      setError('Por favor rellena todos los campos requeridos');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await createCliente(formData);
      
      setSuccess(true);
      setFormData({
        nombre: '',
        apellido: '',
        email: '',
        telefono: '',
        direccion: '',
      });

      setTimeout(() => setSuccess(false), 3000);
      
      onClienteCreated(response);
    } catch (err) {
      console.error('Error:', err);
      setError(err.message || 'Error al crear el cliente');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <h3>Crear nuevo cliente</h3>

      {error && <div className="form-error-box">{error}</div>}
      {success && <div className="form-success-box">✓ Cliente creado exitosamente</div>}

      <div className="form-group">
        <label htmlFor="nombre">Nombre *</label>
        <input
          type="text"
          id="nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          placeholder="Tu nombre"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="apellido">Apellido</label>
        <input
          type="text"
          id="apellido"
          name="apellido"
          value={formData.apellido}
          onChange={handleChange}
          placeholder="Tu apellido"
        />
      </div>

      <div className="form-group">
        <label htmlFor="email">Email *</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="tu@email.com"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="telefono">Teléfono *</label>
        <input
          type="tel"
          id="telefono"
          name="telefono"
          value={formData.telefono}
          onChange={handleChange}
          placeholder="+34 912 345 678"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="direccion">Dirección</label>
        <textarea
          id="direccion"
          name="direccion"
          value={formData.direccion}
          onChange={handleChange}
          placeholder="Dirección de envío"
          rows="3"
        />
      </div>

      <button type="submit" disabled={loading} className="btn btn-primary">
        {loading ? 'Creando...' : 'Crear Cliente'}
      </button>
    </form>
  );
}
