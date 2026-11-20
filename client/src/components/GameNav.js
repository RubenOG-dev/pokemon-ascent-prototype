// client/src/components/GameNav.js
// Botones para volver al inicio o a la selección de equipo. Se ven en todas las pantallas, menos en el inicio.
import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./GameNav.css";

const GameNav = () => {
  const { pathname } = useLocation();
  if (pathname === "/") return null;

  return (
    <div className="game-nav">
      <Link to="/" className="game-nav-btn">Inicio</Link>
      <Link to="/seleccion-pokemon" className="game-nav-btn">Selección de equipo</Link>
    </div>
  );
};

export default GameNav;
