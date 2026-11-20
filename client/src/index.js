import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Estilos globales si los tienes
import App from './App'; // Componente principal de la aplicación

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
