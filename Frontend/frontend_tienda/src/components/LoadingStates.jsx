import React from 'react';
import '../styles/loading.css';

export function LoadingSpinner({ message = 'Cargando...' }) {
  return (
    <div className="loading-spinner">
      <div className="spinner"></div>
      <p>{message}</p>
    </div>
  );
}

export function ErrorMessage({ message, onRetry }) {
  return (
    <div className="error-message">
      <span className="error-icon">⚠️</span>
      <div>
        <h3>Oops! Algo salió mal</h3>
        <p>{message}</p>
        {onRetry && (
          <button onClick={onRetry} className="retry-btn">
            Reintentar
          </button>
        )}
      </div>
    </div>
  );
}

export function EmptyState({ message = 'No hay resultados' }) {
  return (
    <div className="empty-state">
      <span className="empty-icon">📭</span>
      <p>{message}</p>
    </div>
  );
}

export function SuccessMessage({ message, onClose }) {
  React.useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="success-message">
      <span className="success-icon">✅</span>
      <p>{message}</p>
    </div>
  );
}
