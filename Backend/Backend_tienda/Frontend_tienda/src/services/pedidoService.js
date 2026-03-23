import apiClient from './api.js';

export const pedidoService = {
  obtenerTodos: async () => {
    try {
      const response = await apiClient.get('/pedidos');
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Error al obtener pedidos',
        data: [],
        errors: [],
        statusCode: 500
      };
    }
  },

  obtenerPorId: async (id) => {
    try {
      const response = await apiClient.get(`/pedidos/${id}`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Error al obtener pedido',
        data: null,
        errors: [],
        statusCode: 500
      };
    }
  },

  crear: async (pedido) => {
    try {
      const response = await apiClient.post('/pedidos', pedido);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Error al crear pedido',
        data: null,
        errors: [],
        statusCode: 500
      };
    }
  },

  actualizar: async (id, pedido) => {
    try {
      const response = await apiClient.put(`/pedidos/${id}`, pedido);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Error al actualizar pedido',
        data: null,
        errors: [],
        statusCode: 500
      };
    }
  },

  eliminar: async (id) => {
    try {
      const response = await apiClient.delete(`/pedidos/${id}`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Error al eliminar pedido',
        data: null,
        errors: [],
        statusCode: 500
      };
    }
  }
};
