import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/header.css';
import { cartUtils } from '../utils/index';

export default function Header() {
  const [cartCount, setCartCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    // Actualizar cantidad del carrito
    const handleCartUpdate = () => {
      const cart = cartUtils.getCart();
      const count = cartUtils.getCartCount(cart);
      setCartCount(count);
    };

    handleCartUpdate();
    
    // Escuchar cambios en localStorage
    window.addEventListener('storage', handleCartUpdate);
    window.addEventListener('cartUpdated', handleCartUpdate);

    return () => {
      window.removeEventListener('storage', handleCartUpdate);
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  const handleLinkClick = () => {
    setMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo" onClick={handleLinkClick}>
          <span className="logo-icon">⚽</span>
          <span className="logo-text">El Reino del Fútbol</span>
        </Link>

        <nav className={`nav ${menuOpen ? 'active' : ''}`}>
          <Link to="/" onClick={handleLinkClick}>Inicio</Link>
          <Link to="/productos" onClick={handleLinkClick}>Productos</Link>
          <Link to="/categorias" onClick={handleLinkClick}>Categorías</Link>
          <Link to="/admin" onClick={handleLinkClick}>Admin</Link>
        </nav>

        <div className="header-actions">
          <Link to="/carrito" className="cart-link" onClick={handleLinkClick}>
            <span className="cart-icon">🛒</span>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>
          <button 
            className="menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </header>
  );
}
