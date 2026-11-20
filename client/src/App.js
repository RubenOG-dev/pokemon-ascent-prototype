import React, { useEffect } from 'react';
import audioManager from './components/efectos de sonido(datos)/audiomanager';
import VolumeControl from './components/VolumeControl';
import GameNav from './components/GameNav';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Inicio from './pages/Inicio/Inicio'; // Página de inicio
import Perfil from './pages/Perfil/Perfil'; // Crear avatar y nombre del jugador
import Juego from './pages/Juego/Juego'; // Página de juego
import SeleccionPokemon from './pages/SeleccionPokemon/SeleccionPokemon'; // Página de selección de Pokémon
import CombateRapido from './pages/CombateRapido/CombateRapido'; // Página de combate rápido

function App() {
  // La música arranca con el primer clic o tecla en cualquier pantalla del juego.
  // Los navegadores no dejan reproducir audio sin un gesto del usuario.
  useEffect(() => {
    const startOnce = () => audioManager.startMusic();
    window.addEventListener('pointerdown', startOnce, { once: true });
    window.addEventListener('keydown', startOnce, { once: true });
    return () => {
      window.removeEventListener('pointerdown', startOnce);
      window.removeEventListener('keydown', startOnce);
    };
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/juego" element={<Juego />} />
        <Route path="/seleccion-pokemon" element={<SeleccionPokemon />} />
        <Route path="/combate-rapido" element={<CombateRapido />} />
      </Routes>
      {/* Fuera de las rutas: se ve en todas las pantallas */}
      <VolumeControl />
      <GameNav />
    </Router>
  );
}

export default App;
