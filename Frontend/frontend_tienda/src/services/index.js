import { apiGet, apiPost, apiPut, apiDelete } from './api.js';

// ============ CATEGORÍAS ============
export function getCategorias() {
  return apiGet('/categorias');
}

export function getCategoria(id) {
  return apiGet(`/categorias/${id}`);
}

export function createCategoria(data) {
  return apiPost('/categorias', data);
}

export function updateCategoria(id, data) {
  return apiPut(`/categorias/${id}`, data);
}

export function deleteCategoria(id) {
  return apiDelete(`/categorias/${id}`);
}

// ============ PRODUCTOS ============
export function getProductos() {
  return apiGet('/productos');
}

export function getProducto(id) {
  return apiGet(`/productos/${id}`);
}

export function createProducto(data) {
  return apiPost('/productos', data);
}

export function updateProducto(id, data) {
  return apiPut(`/productos/${id}`, data);
}

export function deleteProducto(id) {
  return apiDelete(`/productos/${id}`);
}

// ============ CLIENTES ============
export function getClientes() {
  return apiGet('/clientes');
}

export function getCliente(id) {
  return apiGet(`/clientes/${id}`);
}

export function createCliente(data) {
  return apiPost('/clientes', data);
}

export function updateCliente(id, data) {
  return apiPut(`/clientes/${id}`, data);
}

export function deleteCliente(id) {
  return apiDelete(`/clientes/${id}`);
}

// ============ PEDIDOS ============
export function getPedidos() {
  return apiGet('/pedidos');
}

export function getPedido(id) {
  return apiGet(`/pedidos/${id}`);
}

export function createPedido(data) {
  return apiPost('/pedidos', data);
}

export function updatePedido(id, data) {
  return apiPut(`/pedidos/${id}`, data);
}

export function deletePedido(id) {
  return apiDelete(`/pedidos/${id}`);
}

// ============ DETALLES DE PEDIDOS ============
export function getDetallesPedido() {
  return apiGet('/detallepedidos');
}

export function getDetallePedido(id) {
  return apiGet(`/detallepedidos/${id}`);
}

export function getDetallesPorPedido(pedidoId) {
  return apiGet(`/detallepedidos/porpedido/${pedidoId}`);
}

export function updateDetallePedido(id, data) {
  return apiPut(`/detallepedidos/${id}`, data);
}

export function deleteDetallePedido(id) {
  return apiDelete(`/detallepedidos/${id}`);
}

// ============ ENDPOINTS ESPECIALES ============
export function getStatus() {
  return apiGet('/status');
}
