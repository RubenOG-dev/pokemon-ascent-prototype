// client/src/pages/Juego.js
import React from 'react';
import './Juego.css';
import { Link } from 'react-router-dom'; // Usamos Link para redirigir al usuario

const Juego = () => {
  return (
    <div className="juego-container">
      <h1>Elige tu tipo de combate</h1>
      <div className="juego-options">
        <Link to="/seleccion-pokemon">
          <button>Combate Rápido</button>
        </Link>
      </div>
    </div>
  );
};

export default Juego;
