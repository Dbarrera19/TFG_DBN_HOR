/**
 * Gestiona el carrito en localStorage
 */

const CART_KEY = 'el-reino-carrito';

export function getCart() {
  if (typeof window === 'undefined') return [];
  
  const cart = localStorage.getItem(CART_KEY);
  return cart ? JSON.parse(cart) : [];
}

export function saveCart(cart) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export function addToCart(product, quantity = 1) {
  const cart = getCart();
  const existingItem = cart.find(item => item.id === product.id);

  if (existingItem) {
    existingItem.cantidad += quantity;
  } else {
    cart.push({
      id: product.id,
      nombre: product.nombre,
      precio: product.precio,
      cantidad: quantity,
    });
  }

  saveCart(cart);
  return cart;
}

export function removeFromCart(productId) {
  const cart = getCart();
  const filtered = cart.filter(item => item.id !== productId);
  saveCart(filtered);
  return filtered;
}

export function updateCartQuantity(productId, quantity) {
  const cart = getCart();
  const item = cart.find(item => item.id === productId);
  
  if (item) {
    if (quantity <= 0) {
      return removeFromCart(productId);
    }
    item.cantidad = quantity;
  }
  
  saveCart(cart);
  return cart;
}

export function clearCart() {
  if (typeof window === 'undefined') return [];
  localStorage.removeItem(CART_KEY);
  return [];
}

export function getCartTotal() {
  const cart = getCart();
  return cart.reduce((total, item) => total + (item.precio * item.cantidad), 0);
}

export function getCartQuantity() {
  const cart = getCart();
  return cart.reduce((total, item) => total + item.cantidad, 0);
}
