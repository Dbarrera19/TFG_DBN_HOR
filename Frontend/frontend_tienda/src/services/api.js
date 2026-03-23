const API_BASE_URL = 'https://localhost:7246/api';

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

    console.log('API Response:', url, data); // Depuración

    // Validar estructura de respuesta
    // Si data.success existe, validarlo
    if (data.success !== undefined && !data.success) {
      const error = new Error(data.message || 'Error en la API');
      error.apiErrors = data.errors || [];
      error.statusCode = data.statusCode || response.status;
      throw error;
    }

    // Si tiene estructura {success, data, ...}, retornar data.data
    if (data.success !== undefined && data.data !== undefined) {
      return data.data;
    }

    // Si es un array directo, retornarlo
    if (Array.isArray(data)) {
      return data;
    }

    // Si es un objeto con success, retornarlo
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

/**
 * Solicitud GET
 */
export function apiGet(endpoint) {
  return apiCall(endpoint, { method: 'GET' });
}

export function apiPost(endpoint, body) {
  return apiCall(endpoint, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export function apiPut(endpoint, body) {
  return apiCall(endpoint, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
}

export function apiDelete(endpoint) {
  return apiCall(endpoint, { method: 'DELETE' });
}

// ============= SERVICIOS =============

export const categoriasService = {
  getAll: () => apiGet('/categorias'),
  getById: (id) => apiGet(`/categorias/${id}`),
  create: (data) => apiPost('/categorias', data),
  update: (id, data) => apiPut(`/categorias/${id}`, data),
  delete: (id) => apiDelete(`/categorias/${id}`),
};

export const productosService = {
  getAll: () => apiGet('/productos'),
  getById: (id) => apiGet(`/productos/${id}`),
  create: (data) => apiPost('/productos', data),
  update: (id, data) => apiPut(`/productos/${id}`, data),
  delete: (id) => apiDelete(`/productos/${id}`),
};

export const clientesService = {
  getAll: () => apiGet('/clientes'),
  getById: (id) => apiGet(`/clientes/${id}`),
  create: (data) => apiPost('/clientes', data),
  update: (id, data) => apiPut(`/clientes/${id}`, data),
  delete: (id) => apiDelete(`/clientes/${id}`),
};

export const pedidosService = {
  getAll: () => apiGet('/pedidos'),
  getById: (id) => apiGet(`/pedidos/${id}`),
  create: (data) => apiPost('/pedidos', data),
  update: (id, data) => apiPut(`/pedidos/${id}`, data),
  delete: (id) => apiDelete(`/pedidos/${id}`),
};


export const detallepedidosService = {
  getAll: () => apiGet('/detallepedidos'),
  getById: (id) => apiGet(`/detallepedidos/${id}`),
  getByPedidoId: (pedidoId) => apiGet(`/detallepedidos/porpedido/${pedidoId}`),
  update: (id, data) => apiPut(`/detallepedidos/${id}`, data),
  delete: (id) => apiDelete(`/detallepedidos/${id}`),
};
