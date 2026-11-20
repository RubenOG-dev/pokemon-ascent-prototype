// client/src/pages/Inicio.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Inicio.css'; // Asegúrate de tener este archivo CSS para los estilos

const Inicio = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isStarted, setIsStarted] = useState(false); // Estado para controlar la pantalla de inicio
  const [progress, setProgress] = useState(0); // Estado para el progreso de la barra

  const navigate = useNavigate();

  const handleStart = () => {
    setIsStarted(true); // Ocultamos el contenido inicial
    setIsLoading(true); // Mostramos el círculo de carga
    let interval = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          clearInterval(interval);
          setTimeout(() => {
            navigate('/perfil'); // Navegación interna: no recarga la página, así la música sigue sonando
          }, 1000); // Esperamos 1 segundo antes de redirigir
          return 100;
        }
        return Math.min(oldProgress + 1, 100);
      });
    }, 30); // Aumentamos el progreso cada 30 ms
  };

  return (
    <div className={`inicio-container ${isStarted ? 'started' : ''}`}>
      {!isStarted ? (
        <div className="welcome-message">
          <h1>¡Bienvenido al Mundo Pokémon!</h1>
          <p>Embárcate en una aventura para capturar criaturas y convertirte en el mejor entrenador.</p>
          <button onClick={handleStart}>¡Empezar Aventura!</button>
        </div>
      ) : (
        <div className="loading-overlay">
          <div className="loading-circle"></div>
          <p>Cargando...</p>
          <div className="progress-bar-container">
            <div className="progress-bar" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inicio;
