# 🏆 El Reino del Fútbol - Frontend React

Frontend completo de una tienda online de equipación deportiva desarrollado con **React**, **Vite** y **JavaScript puro**.

## ✨ Características

- ⚽ **Tienda Completa**: Catálogo de productos con filtrado y búsqueda
- 🛒 **Carrito Funcional**: Agregar, quitar y actualizar cantidades
- 💳 **Checkout Integrado**: Formulario de cliente y creación de pedidos
- 📋 **Panel Admin**: CRUD completo de categorías, productos, clientes y pedidos
- 📱 **Responsive Design**: Compatible con móvil, tablet y escritorio
- 🎨 **Diseño Moderno**: Paleta de colores profesional para tienda deportiva
- 🔄 **Integración API**: Consume endpoints REST del backend
- 💾 **localStorage**: Persistencia del carrito en el navegador
- ⚡ **Rendimiento**: Vite para bundling ultra rápido

## 🚀 Instalación y Configuración

### Requisitos
- Node.js 16+
- npm o yarn
- Backend ejecutándose en `https://localhost:7001`

### Pasos

1. **Instalar dependencias**
```bash
npm install
```

2. **Ejecutar servidor de desarrollo**
```bash
npm run dev
```

El proyecto se abrirá automáticamente en `http://localhost:5173`

3. **Compilar para producción**
```bash
npm run build
```

4. **Preview de la compilación**
```bash
npm run preview
```

## 📁 Estructura del Proyecto

```
frontend_tienda/
├── src/
│   ├── components/           # Componentes React reutilizables
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── ProductCard.jsx
│   │   ├── ProductFilters.jsx
│   │   ├── CartSummary.jsx
│   │   ├── LoadingStates.jsx
│   │   ├── ClientForm.jsx
│   │   ├── AdminTable.jsx
│   │   └── ...
│   ├── pages/               # Páginas de React Router
│   │   ├── HomePage.jsx
│   │   ├── ProductosPage.jsx
│   │   ├── ProductDetailPage.jsx
│   │   ├── CarritoPage.jsx
│   │   ├── CheckoutPage.jsx
│   │   ├── AdminPage.jsx
│   │   ├── CategoriasPage.jsx
│   │   └── OrderConfirmationPage.jsx
│   ├── services/            # Servicios API
│   │   └── api.js          # Llamadas a endpoints, CRUD
│   ├── styles/             # Archivos CSS
│   │   ├── header.css
│   │   ├── footer.css
│   │   ├── product-card.css
│   │   ├── cart.css
│   │   ├── forms.css
│   │   ├── admin-table.css
│   │   └── ...
│   ├── utils/              # Utilidades
│   │   └── index.js        # Carrito, formato de datos
│   ├── App.jsx            # Componente raíz con ruteo
│   ├── App.css            # Estilos globales
│   ├── main.jsx           # Punto de entrada
│   └── index.css          # Estilos base
├── public/                 # Activos estáticos
├── package.json
├── vite.config.js
└── index.html
```

## 🔌 Integración con API

### Configuración

La API está configurada en `src/services/api.js`:
```javascript
const API_BASE_URL = 'https://localhost:7001/api';
```

### Servicios Disponibles

```javascript
import {
  categoriasService,
  productosService,
  clientesService,
  pedidosService,
  detallepedidosService
} from './services/api';

// Ejemplos de uso
const categorias = await categoriasService.getAll();
const producto = await productosService.getById(1);
const newPedido = await pedidosService.create(pedidoData);
```

## 📱 Páginas Principales

### Home (/)
- Hero section con presentación
- Productos destacados (primeros 6)
- Características de la tienda
- Botón directo a catálogo

### Productos (/productos)
- Grilla responsive de productos
- Filtrado por categoría
- Búsqueda por nombre/marca
- Tarjetas con precio, stock y detalles

### Detalle de Producto (/producto/:id)
- Imagen en alta resolución
- Especificaciones completas
- Selector de cantidad
- Agregar al carrito

### Carrito (/carrito)
- Lista de productos añadidos
- Actualizar cantidades
- Eliminar productos
- Cálculo de totales (subtotal + IVA)
- Botón de checkout

### Checkout (/checkout)
- Selector de cliente existente
- Formulario para crear nuevo cliente
- Resumen de compra
- Creación de pedido en API
- Cálculo de totales

### Confirmación de Pedido (/confirmacion-pedido/:id)
- Número de pedido
- Información del cliente
- Detalle de productos
- Instrucciones post-compra
- Total pagado

### Categorías (/categorias)
- Listado visual de categorías
- Tarjetas con descripción
- Links a filtrado por categoría

### Admin (/admin)
- **Categorías**: CRUD completo
- **Productos**: Visualización y gestión
- **Clientes**: CRUD de clientes
- **Pedidos**: Listado de pedidos y detalles

## 🛠️ Funcionalidades del Carrito

### Gestión
```javascript
import { cartUtils } from './utils';

// Agregar producto
cartUtils.addToCart({ id, nombre, precio, ... });

// Actualizar cantidad
cartUtils.updateQuantity(productId, cantidad);

// Eliminar
cartUtils.removeFromCart(productId);

// Obtener carrito
const cart = cartUtils.getCart();

// Limpiar
cartUtils.clearCart();

// Cálculos
const totals = cartUtils.calculateTotals(cart);
// Retorna: { subtotal, impuestos, total }
```

### localStorage
- Clave: `reino_futbol_cart`
- Guarda automáticamente con cada cambio
- Persiste entre sesiones

## 🎨 Paleta de Colores

```css
--primary-color: #1f472a;        /* Verde oscuro */
--secondary-color: #2d5e3f;      /* Verde claro */
--accent-color: #f39c12;         /* Naranja */
--accent-light: #ffc107;         /* Amarillo */
--success-color: #27ae60;        /* Verde éxito */
--danger-color: #e74c3c;         /* Rojo error */
```

## 📧 Formularios

### ClientForm
```jsx
<ClientForm
  initialData={cliente}
  onSubmit={handleSubmit}
  isLoading={false}
/>
```

Campos validados:
- Nombre (requerido)
- Apellido (requerido)
- Email (validación incluida)
- Teléfono (requerido)
- Dirección (requerido)

## 🔄 Manejo de Respuestas API

El frontend maneja correctamente la estructura de respuesta:
```javascript
{
  "success": true,
  "message": "Mensaje descriptivo",
  "data": { /* datos reales */ },
  "errors": null,
  "statusCode": 200
}
```

## 💾 Persistencia

- **Carrito**: localStorage (`reino_futbol_cart`)
- **Clientes**: Backend (API)
- **Pedidos**: Backend (API)
- **Sesión**: Sin autenticación requerida

## 🌐 Responsive Design

- **Desktop**: Grid de 4+ columnas
- **Tablet**: Grid de 2-3 columnas
- **Mobile**: 1 columna, menú hamburguesa

## ⚡ Performance

- Lazy loading de imágenes
- Bundling optimizado con Vite
- CSS modular y reutilizable
- Componentes funcionales con hooks
- Zero TypeScript overhead

## 🚀 Despliegue a Producción

1. **Compilar**
```bash
npm run build
```

2. **Servir contenido de `dist/`**
```bash
npm run preview
```

3. **Configurar variable de entorno para API** (opcional)
```bash
export VITE_API_BASE_URL=https://api.tudominio.com
```

## 📝 Notas Importantes

1. **CORS**: El backend debe tener CORS habilitado para el dominio del frontend
2. **HTTPS**: Por seguridad, ambos (backend y frontend) deben usar HTTPS en producción
3. **API Response**: El frontend valida `response.success` antes de procesar datos
4. **localStorage**: Se limpia automáticamente al vaciar el carrito
5. **Imágenes**: Las imágenes no disponibles muestran un placeholder

## 🤝 Extensiones Futuras

Posibles mejoras:
- Autenticación de usuarios
- Mi cuenta / Historial de pedidos
- Wishlist
- Sistema de reseñas
- Estadísticas para admin
- Filtros avanzados
- Paginación en listas

## 📞 Solución de Problemas

| Problema | Solución |
|----------|----------|
| 🔴 "No se carga nada" | Verifica que el backend esté en `https://localhost:7001` |
| 🔴 "Errores CORS" | Asegúrate que CORS está habilitado en el backend |
| 🔴 "El carrito no persiste" | Verifica que localStorage está habilitado |
| 🔴 "Las imágenes no cargan" | Las imágenes requieren URL válidas en la API |
| 🔴 "Errores en formularios" | Abre DevTools (F12) → Console para ver detalles |

## 📚 Tecnologías Utilizadas

- **React 18**: UI library
- **React Router 6**: Navegación entre páginas
- **Vite**: Build tool ultra rápido
- **Fetch API**: Consumo de API REST
- **localStorage**: Persistencia del carrito
- **CSS Vanilla**: Sin frameworks css, solo CSS moderno

---

**Desarrollado con ❤️ para El Reino del Fútbol**
