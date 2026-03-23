import apiClient from './api.js';

export const productoService = {
  obtenerTodos: async () => {
    try {
      const response = await apiClient.get('/productos');
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Error al obtener productos',
        data: [],
        errors: [],
        statusCode: 500
      };
    }
  },

  obtenerPorId: async (id) => {
    try {
      const response = await apiClient.get(`/productos/${id}`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Error al obtener producto',
        data: null,
        errors: [],
        statusCode: 500
      };
    }
  },

  crear: async (producto) => {
    try {
      const response = await apiClient.post('/productos', producto);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Error al crear producto',
        data: null,
        errors: [],
        statusCode: 500
      };
    }
  },

  actualizar: async (id, producto) => {
    try {
      const response = await apiClient.put(`/productos/${id}`, producto);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Error al actualizar producto',
        data: null,
        errors: [],
        statusCode: 500
      };
    }
  },

  eliminar: async (id) => {
    try {
      const response = await apiClient.delete(`/productos/${id}`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Error al eliminar producto',
        data: null,
        errors: [],
        statusCode: 500
      };
    }
  }
};
