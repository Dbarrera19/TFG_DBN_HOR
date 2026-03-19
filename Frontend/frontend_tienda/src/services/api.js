const API_BASE_URL = 'https://localhost:7001/api';

/**
 * Parsea la respuesta de la API
 * Valida la estructura success/data/errors
 * Lanza error si success es false
 */
export async function apiCall(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaults = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const config = {
    ...defaults,
    ...options,
    headers: {
      ...defaults.headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    // Validar estructura de respuesta
    if (!data.success) {
      const error = new Error(data.message || 'Error en la API');
      error.apiErrors = data.errors || [];
      error.statusCode = data.statusCode || response.status;
      throw error;
    }

    return data.data; // La información útil está dentro de data.data
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

/**
 * GET request
 */
export function apiGet(endpoint) {
  return apiCall(endpoint, { method: 'GET' });
}

/**
 * POST request
 */
export function apiPost(endpoint, body) {
  return apiCall(endpoint, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

/**
 * PUT request
 */
export function apiPut(endpoint, body) {
  return apiCall(endpoint, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
}

/**
 * DELETE request
 */
export function apiDelete(endpoint) {
  return apiCall(endpoint, { method: 'DELETE' });
}

// ============= SERVICIOS ESPECÍFICOS =============

// Servicio de Categorías
export const categoriasService = {
  getAll: () => apiGet('/categorias'),
  getById: (id) => apiGet(`/categorias/${id}`),
  create: (data) => apiPost('/categorias', data),
  update: (id, data) => apiPut(`/categorias/${id}`, data),
  delete: (id) => apiDelete(`/categorias/${id}`),
};

// Servicio de Productos
export const productosService = {
  getAll: () => apiGet('/productos'),
  getById: (id) => apiGet(`/productos/${id}`),
  create: (data) => apiPost('/productos', data),
  update: (id, data) => apiPut(`/productos/${id}`, data),
  delete: (id) => apiDelete(`/productos/${id}`),
};

// Servicio de Clientes
export const clientesService = {
  getAll: () => apiGet('/clientes'),
  getById: (id) => apiGet(`/clientes/${id}`),
  create: (data) => apiPost('/clientes', data),
  update: (id, data) => apiPut(`/clientes/${id}`, data),
  delete: (id) => apiDelete(`/clientes/${id}`),
};

// Servicio de Pedidos
export const pedidosService = {
  getAll: () => apiGet('/pedidos'),
  getById: (id) => apiGet(`/pedidos/${id}`),
  create: (data) => apiPost('/pedidos', data),
  update: (id, data) => apiPut(`/pedidos/${id}`, data),
  delete: (id) => apiDelete(`/pedidos/${id}`),
};

// Servicio de Detalles de Pedidos
export const detallepedidosService = {
  getAll: () => apiGet('/detallepedidos'),
  getById: (id) => apiGet(`/detallepedidos/${id}`),
  getByPedidoId: (pedidoId) => apiGet(`/detallepedidos/porpedido/${pedidoId}`),
  update: (id, data) => apiPut(`/detallepedidos/${id}`, data),
  delete: (id) => apiDelete(`/detallepedidos/${id}`),
};
