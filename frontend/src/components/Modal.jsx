import React, { useState } from 'react';
import './Modal.css';

const Modal = ({ isOpen, onClose, onUnlockSuccess }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const benefits = [
    'Acceso completo a todos los análisis sin límites',
    'Generación ilimitada de anuncios profesionales',
    'Análisis de mercado detallado en tiempo real',
    'Recomendaciones visuales avanzadas',
    'Exportación de informes en PDF',
    'Soporte prioritario 24/7',
    'API de integración para tu sistema',
    'Sin marca de agua en los documentos'
  ];

  const handleUnlock = async (e) => {
    e.preventDefault();
    
    if (!email) {
      alert('Por favor, ingresa tu correo electrónico');
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      alert(`¡Gracias! Hemos enviado información a ${email}`);
      onUnlockSuccess();
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>

        <div className="modal-header">
          <h2>🔓 Desbloquear InmoVC Pro</h2>
          <p>Obtén acceso completo a todas las funciones profesionales</p>
        </div>

        <div className="modal-body">
          <div className="benefits-list">
            <h3>Beneficios incluidos:</h3>
            <ul>
              {benefits.map((benefit, index) => (
                <li key={index}>
                  <span className="check-icon">✓</span>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>

          <form onSubmit={handleUnlock} className="unlock-form">
            <div className="form-group">
              <label htmlFor="email">Correo Electrónico</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
              />
            </div>

            <div className="pricing-info">
              <div className="price">
                <span className="currency">$</span>
                <span className="amount">99</span>
                <span className="period">/mes</span>
              </div>
              <p className="price-note">Cancela en cualquier momento</p>
            </div>

            <button 
              type="submit" 
              className="unlock-submit-button"
              disabled={loading}
            >
              {loading ? 'Procesando...' : 'Solicitar Acceso Pro'}
            </button>
          </form>

          <div className="modal-footer">
            <p>* Esta es una versión demo. En producción se procesaría el pago real.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
