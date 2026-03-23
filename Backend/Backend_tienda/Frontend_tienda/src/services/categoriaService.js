import apiClient from './api.js';

export const categoriaService = {
  obtenerTodas: async () => {
    try {
      const response = await apiClient.get('/categorias');
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Error al obtener categorías',
        data: [],
        errors: [],
        statusCode: 500
      };
    }
  },

  obtenerPorId: async (id) => {
    try {
      const response = await apiClient.get(`/categorias/${id}`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Error al obtener categoría',
        data: null,
        errors: [],
        statusCode: 500
      };
    }
  },

  crear: async (categoria) => {
    try {
      const response = await apiClient.post('/categorias', categoria);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Error al crear categoría',
        data: null,
        errors: [],
        statusCode: 500
      };
    }
  },

  actualizar: async (id, categoria) => {
    try {
      const response = await apiClient.put(`/categorias/${id}`, categoria);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Error al actualizar categoría',
        data: null,
        errors: [],
        statusCode: 500
      };
    }
  },

  eliminar: async (id) => {
    try {
      const response = await apiClient.delete(`/categorias/${id}`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Error al eliminar categoría',
        data: null,
        errors: [],
        statusCode: 500
      };
    }
  }
};
