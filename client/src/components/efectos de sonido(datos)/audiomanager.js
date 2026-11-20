// Gestor de audio sencillo.
// Los volúmenes se guardan de 0 a 1. Los sliders pasan el valor en porcentaje (0-100).
// Si un fichero de audio no existe, o el navegador bloquea la reproducción,
// se avisa en consola y el juego sigue funcionando.

export const MUSIC_MENU = '/assets/audio/music.mp3';
export const MUSIC_COMBAT = '/assets/audio/combat-music.mp3';
export const SOUND_ATTACK = '/assets/audio/attack-effect.mp3';

const audioManager = {
  musicVolume: 0.5,
  effectsVolume: 0.5,
  music: null, // elemento Audio de la pista que está sonando
  musicSrc: MUSIC_MENU, // pista que debe sonar ahora
  started: false, // true tras el primer clic o tecla del usuario

  setMusicVolume(percent) {
    this.musicVolume = Number(percent) / 100;
    if (this.music) {
      this.music.volume = this.musicVolume;
    }
  },

  setEffectsVolume(percent) {
    this.effectsVolume = Number(percent) / 100;
  },

  // Cambia de pista (por ejemplo, al entrar en combate).
  // Si el usuario todavía no ha interactuado, solo se guarda y sonará al primer gesto.
  playMusic(src) {
    if (this.musicSrc === src && this.music) return;
    this.musicSrc = src;
    if (this.music) {
      this.music.pause();
      this.music = null;
    }
    if (this.started) {
      this.startMusic();
    }
  },

  // Debe llamarse desde un gesto del usuario: los navegadores no dejan reproducir audio antes
  startMusic() {
    this.started = true;
    if (!this.music) {
      this.music = new Audio(this.musicSrc);
      this.music.loop = true;
    }
    this.music.volume = this.musicVolume;
    // Si falla (fichero no encontrado, navegador bloqueando el audio...), se avisa en consola
    this.music.play().catch((err) => console.warn('No se pudo reproducir la música:', err.message));
  },

  // Efecto puntual (por ejemplo, un sonido al atacar)
  playSound(src) {
    const sound = new Audio(src);
    sound.volume = this.effectsVolume;
    sound.play().catch(() => {});
  },
};

export default audioManager;
