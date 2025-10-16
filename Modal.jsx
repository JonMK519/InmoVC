import React, { useState } from 'react';
import './Modal.css'; // Assuming you might want to add some styles

const Modal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');

  const benefits = [
    'Benefit 1',
    'Benefit 2',
    'Benefit 3',
  ];

  return (
    isOpen ? (
      <div className="modal-overlay">
        <div className="modal-content">
          <button className="close-button" onClick={onClose}>Close</button>
          <h2>Unlock Benefits</h2>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="Enter your email" 
          />
          <ul>
            {benefits.map((benefit, index) => (
              <li key={index}>
                <input type="checkbox" checked readOnly />
                {benefit}
              </li>
            ))}
          </ul>
          <button className="unlock-button">Unlock</button>
        </div>
      </div>
    ) : null
  );
};

export default Modal;