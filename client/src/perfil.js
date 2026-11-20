// client/src/perfil.js
// Perfil del jugador (avatar y nombre), guardado en localStorage para que sobreviva a recargas.

export const AVATARS = [
  { id: 'chico', label: 'Chico', src: '/assets/images/entrenador.png' },
  { id: 'chica', label: 'Chica', src: '/assets/images/entrenadora.png' },
];

const STORAGE_KEY = 'perfilJugador';

const PERFIL_POR_DEFECTO = { name: 'Entrenador', avatarId: 'chico' };

// Devuelve el perfil guardado, o el perfil por defecto si no hay ninguno
export const loadPerfil = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return saved ?? PERFIL_POR_DEFECTO;
  } catch {
    return PERFIL_POR_DEFECTO;
  }
};

export const savePerfil = (perfil) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(perfil));
};

// Avatar a partir de su id (si el id no existe, el primero)
export const getAvatar = (avatarId) =>
  AVATARS.find((avatar) => avatar.id === avatarId) ?? AVATARS[0];
