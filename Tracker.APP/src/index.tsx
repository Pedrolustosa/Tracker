import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';  // Importando Bootstrap
import './index.css';  // Seu arquivo CSS personalizado, se houver
import App from './App';
import reportWebVitals from './reportWebVitals';
import toastr from 'toastr';  // Importando Toastr
import 'toastr/build/toastr.min.css';  // Importando CSS do Toastr

// Configurando opções do Toastr
toastr.options = {
  closeButton: true,
  progressBar: true,
  positionClass: 'toast-top-right',
};

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Optional: Para medir o desempenho da sua aplicação
reportWebVitals();