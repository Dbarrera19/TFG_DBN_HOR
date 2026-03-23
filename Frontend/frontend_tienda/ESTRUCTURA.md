# 📁 Estructura del Proyecto - El Reino del Fútbol

## 🔧 Archivos Raíz
| Archivo | Propósito |
|---------|-----------|
| `package.json` | Dependencias y scripts (React, Vite, React Router) |
| `index.html` | Punto de entrada; carga la app React |
| `README.md` | Documentación general del proyecto |

---

## 📂 `/src/components/` - Componentes Reutilizables
| Componente | Función |
|-----------|---------|
| `Header.jsx` | Navegación superior |
| `Footer.jsx` | Pie de página |
| `ProductCard.jsx` | Card de producto |
| `ProductFilters.jsx` | Filtros de búsqueda |
| `CartSummary.jsx` | Resumen del carrito |
| `AdminTable.jsx` | Tabla para admin |
| `ClientForm.jsx` | Formulario de cliente |
| `LoadingStates.jsx` | Estados de carga |
| `/react/` | Componentes avanzados (Admin de categorías, productos, pedidos, checkout) |

---

## 🌐 `/src/pages/` - Páginas Principales
| Página | Contenido |
|--------|-----------|
| `HomePage.jsx` | Inicio con hero, características y productos destacados |
| `ProductosPage.jsx` | Catálogo completo de productos |
| `ProductDetailPage.jsx` | Detalle de un producto específico |
| `CarritoPage.jsx` | Visualización y edición del carrito |
| `CheckoutPage.jsx` | Formulario de compra |
| `OrderConfirmationPage.jsx` | Confirmación del pedido |
| `CategoriasPage.jsx` | Listado de categorías |
| `AdminPage.jsx` | Panel administrativo |

---

## 🔌 `/src/services/` - Comunicación con Backend
| Archivo | Función |
|---------|---------|
| `api.js` | Wrapper de fetch para consumir API REST (https://localhost:7246/api) |
| `index.js` | Exporta todos los servicios centralizados |

---

## 🛠️ `/src/utils/` - Herramientas
| Archivo | Función |
|---------|---------|
| `cart.js` | Gestión del carrito en localStorage |
| `format.js` | Formateadores de precios (EUR) y fechas (ES) |
| `index.js` | Exporta funciones de carrito |

---

## 🎨 `/src/styles/` - Estilos CSS
- `global.css` — Estilos base
- `header.css`, `footer.css` — Navegación
- `product-card.css`, `productos.css` — Catálogo
- `cart.css`, `checkout.css` — Compra
- `admin.css`, `admin-table.css` — Panel admin
- Otros: `forms.css`, `filters.css`, `loading.css`

---

## 📋 Otros
| Archivo | Propósito |
|---------|-----------|
| `App.jsx` | Componente raíz con Router |
| `main.jsx` | Punto de entrada de React |
| `index.css` | Estilos base CSS |

---

## 🏗️ Stack Tecnológico
- **Framework**: React 18.2
- **Bundler**: Vite 5.0
- **Router**: React Router v7
- **Backend**: .NET (localhost:7246)
- **Almacenamiento**: localStorage (carrito)
- **Estilos**: CSS puro

---

**Última actualización**: 23/03/2026
