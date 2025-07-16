import React from 'react';
import './LoadingIndicator.css';

const LoadingIndicator: React.FC<{ message?: string }> = ({ message = 'Carregando...' }) => (
  <div className="loading-container">
    <div className="spinner-border text-warning loading-spinner" role="status">
      <span className="visually-hidden">{message}</span>
    </div>
    <span className="loading-message">{message}</span>
  </div>
);

export default LoadingIndicator;
