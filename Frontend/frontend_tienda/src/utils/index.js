// Utilidades para gestión del carrito en localStorage

const CART_STORAGE_KEY = 'reino_futbol_cart';

export const cartUtils = {
  // Obtener carrito actual
  getCart: () => {
    try {
      const cart = localStorage.getItem(CART_STORAGE_KEY);
      return cart ? JSON.parse(cart) : [];
    } catch {
      return [];
    }
  },

  // Guardar carrito
  saveCart: (cart) => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  },

  // Agregar producto al carrito
  addToCart: (producto) => {
    const cart = cartUtils.getCart();
    const existItem = cart.find(item => item.id === producto.id);

    if (existItem) {
      existItem.cantidad += 1;
    } else {
      cart.push({
        id: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        imagen: producto.imagen || 'https://via.placeholder.com/200',
        cantidad: 1,
        talla: producto.talla || '',
      });
    }

    cartUtils.saveCart(cart);
    return cart;
  },

  // Eliminar producto del carrito
  removeFromCart: (productId) => {
    let cart = cartUtils.getCart();
    cart = cart.filter(item => item.id !== productId);
    cartUtils.saveCart(cart);
    return cart;
  },

  // Actualizar cantidad
  updateQuantity: (productId, cantidad) => {
    let cart = cartUtils.getCart();
    const item = cart.find(item => item.id === productId);
    
    if (item) {
      if (cantidad <= 0) {
        return cartUtils.removeFromCart(productId);
      }
      item.cantidad = cantidad;
      cartUtils.saveCart(cart);
    }
    return cart;
  },

  // Calcular totales
  calculateTotals: (cart) => {
    const subtotal = cart.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    const impuestos = subtotal * 0.21; // 21% IVA
    const total = subtotal + impuestos;

    return {
      subtotal: parseFloat(subtotal.toFixed(2)),
      impuestos: parseFloat(impuestos.toFixed(2)),
      total: parseFloat(total.toFixed(2)),
    };
  },

  // Obtener cantidad total de items
  getCartCount: (cart) => {
    return cart.reduce((count, item) => count + item.cantidad, 0);
  },

  // Vaciar carrito
  clearCart: () => {
    localStorage.removeItem(CART_STORAGE_KEY);
    return [];
  },
};

// Formateo de datos
export const formatUtils = {
  formatPrice: (price) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(price);
  },

  formatDate: (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  },

  truncateText: (text, maxLength = 100) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  },
};
