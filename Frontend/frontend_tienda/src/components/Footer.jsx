import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/footer.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>Sobre nosotros</h3>
          <p>El Reino del Fútbol es tu tienda online de confianza para equipación, botas, accesorios y más de fútbol.</p>
        </div>

        <div className="footer-section">
          <h3>Enlaces rápidos</h3>
          <ul>
            <li><Link to="/productos">Productos</Link></li>
            <li><Link to="/categorias">Categorías</Link></li>
            <li><Link to="/admin">Panel Admin</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Contacto</h3>
          <ul>
            <li>Email: info@reinodelfutbol.com</li>
            <li>Teléfono: +34 912 345 678</li>
            <li>Dirección: Madrid, España</li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Redes sociales</h3>
          <div className="social-links">
            <a href="#" aria-label="Facebook">f</a>
            <a href="#" aria-label="Twitter">𝕏</a>
            <a href="#" aria-label="Instagram">📷</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {currentYear} El Reino del Fútbol. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}
