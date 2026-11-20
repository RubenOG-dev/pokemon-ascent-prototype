// client/src/components/VolumeControl.js
// Control de volumen flotante. Se pinta en App.js, así que está en todas las pantallas.
import React, { useState, useEffect } from "react";
import audioManager from "./efectos de sonido(datos)/audiomanager";
import "./VolumeControl.css";

const VolumeControl = () => {
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [musicVolume, setMusicVolume] = useState(50);
  const [effectsVolume, setEffectsVolume] = useState(50);
  const [previousVolumes, setPreviousVolumes] = useState({
    music: 50,
    effects: 50,
  });

  // Cada slider (o el silencio, que los pone a 0) actualiza el gestor de audio
  useEffect(() => {
    audioManager.setMusicVolume(musicVolume);
  }, [musicVolume]);

  useEffect(() => {
    audioManager.setEffectsVolume(effectsVolume);
  }, [effectsVolume]);

  const toggleSound = () => {
    if (isSoundOn) {
      setPreviousVolumes({ music: musicVolume, effects: effectsVolume });
      setMusicVolume(0);
      setEffectsVolume(0);
    } else {
      setMusicVolume(previousVolumes.music);
      setEffectsVolume(previousVolumes.effects);
    }
    setIsSoundOn(!isSoundOn);
  };

  const handleMusicVolumeChange = (e) => setMusicVolume(e.target.value);
  const handleEffectsVolumeChange = (e) => setEffectsVolume(e.target.value);

  return (
    <div className="volume-widget">
      <button className="volume-btn" onClick={() => setIsOpen(!isOpen)}>
        🎵 Volumen
      </button>
      {isOpen && (
        <div className="volume-modal">
          <h3>Control de Volumen</h3>
          <div className="slider-group">
            <label htmlFor="music-volume">Música:</label>
            <input
              id="music-volume"
              type="range"
              min="0"
              max="100"
              value={musicVolume}
              onChange={handleMusicVolumeChange}
              disabled={!isSoundOn}
            />
            <span>{musicVolume}%</span>
          </div>
          <div className="slider-group">
            <label htmlFor="effects-volume">Efectos:</label>
            <input
              id="effects-volume"
              type="range"
              min="0"
              max="100"
              value={effectsVolume}
              onChange={handleEffectsVolumeChange}
              disabled={!isSoundOn}
            />
            <span>{effectsVolume}%</span>
          </div>
          <div className="mute-all">
            <button className="mute-all-btn" onClick={toggleSound}>
              {isSoundOn ? "Silenciar Todo 🔇" : "Activar Todo 🔊"}
            </button>
          </div>
          <button className="close-btn" onClick={() => setIsOpen(false)}>
            Cerrar
          </button>
        </div>
      )}
    </div>
  );
};

export default VolumeControl;
