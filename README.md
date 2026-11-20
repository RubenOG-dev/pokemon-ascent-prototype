# Pokémon Ascent — prototipo de selección de equipo y combate

Prototipo web de un juego estilo Pokémon. El jugador crea su entrenador, arma un equipo de 6 Pokémon con datos reales de la PokéAPI y combate por turnos contra un equipo rival generado al azar.

> **Estado:** prototipo en fase temprana. Es jugable de principio a fin, pero con reglas simplificadas y sin persistencia de partidas.

## Flujo de juego

1. **Inicio** (`/`): pantalla de bienvenida con una carga animada.
2. **Perfil** (`/perfil`): eliges avatar (chico o chica) y un nombre. Se guarda en el navegador.
3. **Modo de juego** (`/juego`): por ahora, solo el modo "Combate Rápido".
4. **Selección de equipo** (`/seleccion-pokemon`): explora la Pokédex y elige 6 Pokémon.
5. **Combate** (`/combate-rapido`): lucha por turnos hasta que uno de los dos equipos se queda sin Pokémon vivos.

## Funcionalidades

**Selección de equipo**
- Carga la Pokédex completa (1.281 Pokémon) desde la PokéAPI.
- Filtros por nombre, número de Pokédex y tipo (dos tipos a la vez).
- Ficha de detalle con tipos, estadísticas y movimientos.
- Equipo de hasta 6 Pokémon. Quitar uno con la × que aparece al pasar el ratón. El botón de combate solo se activa con exactamente 6.

**Combate**
- Rival con 6 Pokémon elegidos al azar de toda la Pokédex.
- Cada Pokémon tiene sus PS (la estadística `hp` base). Un ataque hace entre 5 y 24 de daño.
- Sprites de espalda para tu Pokémon y de frente para el rival, sobre una arena de fondo.
- Al caer un Pokémon aparece una modal con tu equipo: los caídos en rojo y los vivos en blanco. Si caes tú, eliges el siguiente. Si cae el rival, puedes cambiar o mantener al tuyo.
- El log muestra el movimiento que usa cada Pokémon. Los movimientos se toman de los 10 primeros de la PokéAPI, así que algunos son de estado y no hacen daño.
- El turno del rival empieza un segundo después de tu ataque. Tras derrotar a un rival, el turno siempre es tuyo.

**Audio y controles globales**
- Música de menú y música de combate, con cambio automático al entrar y salir del combate.
- Sonido de ataque en cada golpe.
- Control de volumen (música y efectos) y botón para silenciar todo, disponible en todas las pantallas.
- Botones para volver a Inicio o a la selección de equipo.
- La música arranca con el primer clic o tecla, porque el navegador no deja reproducir audio antes.

## Tecnologías

- **React 18** con Create React App (`react-scripts` 5)
- **React Router 7** para la navegación
- **PokéAPI** como fuente de datos (sin backend)
- **Chart.js** (`react-chartjs-2`) para la gráfica de estadísticas de la ficha
- `localStorage` para guardar el perfil

## Decisiones y compromisos

- **Sin backend para los datos.** Los Pokémon vienen directamente de la PokéAPI. Es lo más simple para tener datos reales, pero la selección hace **1.282 peticiones** al entrar (1 listado y 1 por Pokémon), sin caché. Por eso tarda en cargar y depende de la red. El siguiente paso natural sería cachear o servir los datos desde un backend.
- **Combate sin estado global.** El turno del rival es un temporizador que se cancela si cambia el estado, así no hay ataques fuera de turno tras el fin de la partida.
- **Reglas simples a propósito.** El daño es aleatorio y no depende de tipos ni de estadísticas. Esto deja sin resolver la ventaja de tipos, que es la mecánica central de los juegos de Pokémon.
- **Sin persistencia de partidas.** Solo se guarda el perfil. El equipo y los resultados se pierden al recargar.

## Qué falta

- Ventaja de tipos y daño que dependa de las estadísticas.
- Varios combates seguidos, ranking o progreso guardado.
- Modos de juego adicionales.
- Efectos de sonido más allá del de ataque.
- Pruebas automatizadas: el proyecto no tiene tests.

## Puesta en marcha

Requiere Node.js 18 o superior.

```bash
cd client
npm install
npm start
```

Se abre en `http://localhost:3000`. La selección de equipo necesita conexión a internet, porque usa la PokéAPI.

Para generar una versión de producción:

```bash
npm run build
```

### Recursos de audio

Los ficheros de audio están en `client/public/assets/audio/`:
- `music.mp3`: música de menú.
- `combat-music.mp3`: música de combate.
- `attack-effect.mp3`: efecto de ataque.

Si falta un fichero, la app sigue funcionando sin ese sonido. Si falta la música de fondo, el aviso aparece en la consola del navegador; los efectos fallan en silencio.

### Servidor opcional

El directorio `server/` no es necesario para jugar. Si se usa, sus credenciales de base de datos se leen de variables de entorno (`DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`). La plantilla está en `server/.env.example`.
