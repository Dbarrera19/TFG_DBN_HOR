import apiClient from './api.js';

export const clienteService = {
  obtenerTodos: async () => {
    try {
      const response = await apiClient.get('/clientes');
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Error al obtener clientes',
        data: [],
        errors: [],
        statusCode: 500
      };
    }
  },

  obtenerPorId: async (id) => {
    try {
      const response = await apiClient.get(`/clientes/${id}`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Error al obtener cliente',
        data: null,
        errors: [],
        statusCode: 500
      };
    }
  },

  crear: async (cliente) => {
    try {
      const response = await apiClient.post('/clientes', cliente);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Error al crear cliente',
        data: null,
        errors: [],
        statusCode: 500
      };
    }
  },

  actualizar: async (id, cliente) => {
    try {
      const response = await apiClient.put(`/clientes/${id}`, cliente);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Error al actualizar cliente',
        data: null,
        errors: [],
        statusCode: 500
      };
    }
  },

  eliminar: async (id) => {
    try {
      const response = await apiClient.delete(`/clientes/${id}`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Error al eliminar cliente',
        data: null,
        errors: [],
        statusCode: 500
      };
    }
  }
};
