// client/src/pages/Perfil/Perfil.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AVATARS, savePerfil } from '../../perfil';
import './Perfil.css';

const Perfil = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [avatarId, setAvatarId] = useState('');

  // Hace falta un avatar y un nombre para continuar
  const canContinue = name.trim() !== '' && avatarId !== '';

  const handleContinue = () => {
    savePerfil({ name: name.trim(), avatarId });
    navigate('/juego');
  };

  return (
    <div className="perfil-container">
      <h1>Crea tu entrenador</h1>

      <div className="avatar-options">
        {AVATARS.map((avatar) => (
          <button
            key={avatar.id}
            type="button"
            className={`avatar-option ${avatarId === avatar.id ? 'selected' : ''}`}
            onClick={() => setAvatarId(avatar.id)}
          >
            <img src={avatar.src} alt={avatar.label} />
            <span>{avatar.label}</span>
          </button>
        ))}
      </div>

      <label className="perfil-name">
        Nombre
        <input
          type="text"
          value={name}
          maxLength={16}
          placeholder="Escribe tu nombre"
          onChange={(e) => setName(e.target.value)}
        />
      </label>

      <button onClick={handleContinue} disabled={!canContinue}>
        Continuar
      </button>
    </div>
  );
};

export default Perfil;
