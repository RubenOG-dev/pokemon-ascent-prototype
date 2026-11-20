import React, { useState } from "react";
import { Link } from "react-router-dom";
import { loadPerfil, getAvatar } from "../perfil";

// El control de volumen no está aquí: vive en VolumeControl, en todas las pantallas.
const Header = () => {
  const [perfil] = useState(loadPerfil);

  return (
    <header className="header">
      <div className="logo">
        <Link to="/juego">
          <img
            src="./assets/images/icon.png"
            alt="Logo de Pokémon Ascent"
            className="logo-img"
          />
          <h1>POKEMON ASCENT</h1>
        </Link>
      </div>
      <nav className="nav">
        <Link to="/juego">Modo de Juego</Link>
      </nav>
      <div className="user-info">
        <img src={getAvatar(perfil.avatarId).src} alt="Avatar del jugador" className="avatar" />
        <span>{perfil.name}</span>
      </div>
      <button className="help-btn">Ayuda</button>
    </header>
  );
};

export default Header;
