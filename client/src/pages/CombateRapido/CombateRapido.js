// client/src/pages/CombateRapido/CombateRapido.js
import React, { useState, useEffect, useRef } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import './CombateRapido.css';
import audioManager, { MUSIC_COMBAT, MUSIC_MENU, SOUND_ATTACK } from '../../components/efectos de sonido(datos)/audiomanager';

const MAX_TEAM = 6;

const randomDamage = () => Math.floor(Math.random() * 20) + 5;

// La vida máxima de un Pokémon es su estadística "hp"
const getMaxHp = (pokemon) => {
  const hpStat = pokemon.stats?.find((stat) => stat.stat.name === 'hp');
  return hpStat ? hpStat.base_stat : 100;
};

// Convierte un Pokémon de la selección en un luchador con vida y sprites.
// Si no hay sprite de espalda, se usa el de frente.
const toFighter = (pokemon) => {
  const maxHp = getMaxHp(pokemon);
  return {
    name: pokemon.name,
    frontSprite: pokemon.sprites?.front_default,
    backSprite: pokemon.sprites?.back_default || pokemon.sprites?.front_default,
    maxHp,
    hp: maxHp,
    moves: (pokemon.moves ?? []).map((m) => m.move.name),
  };
};

// Nombre de un movimiento al azar del luchador (con guiones cambiados por espacios)
const pickMove = (fighter) => {
  if (fighter.moves.length === 0) return 'un ataque';
  const name = fighter.moves[Math.floor(Math.random() * fighter.moves.length)];
  return name.replace(/-/g, ' ');
};

// Elige n Pokémon al azar, sin repetir
const pickRandom = (list, n) => {
  const pool = [...list];
  const picked = [];
  while (picked.length < n && pool.length > 0) {
    const index = Math.floor(Math.random() * pool.length);
    picked.push(pool.splice(index, 1)[0]);
  }
  return picked;
};

// Posición del primer luchador vivo, o -1 si no queda ninguno
const findAlive = (team) => team.findIndex((fighter) => fighter.hp > 0);

const CombateRapido = () => {
  const { state } = useLocation();

  // Equipo del jugador y rival (el rival se elige al azar de todos los Pokémon)
  const [playerTeam, setPlayerTeam] = useState(() =>
    (state?.selectedPokemons ?? []).map(toFighter)
  );
  const [rivalTeam, setRivalTeam] = useState(() =>
    pickRandom(state?.allPokemons ?? [], MAX_TEAM).map(toFighter)
  );

  // Posición del luchador que está en el campo en cada lado
  const [playerIndex, setPlayerIndex] = useState(0);
  const [rivalIndex, setRivalIndex] = useState(0);

  const [turn, setTurn] = useState('player'); // 'player' | 'enemy'
  const [modal, setModal] = useState(null); // null | 'player' | 'rival'
  const [result, setResult] = useState(null); // null | 'win' | 'lose'
  const [battleLog, setBattleLog] = useState([]);

  const isGameOver = result !== null;
  const playerFighter = playerTeam[playerIndex];
  const rivalFighter = rivalTeam[rivalIndex];

  // Música de combate al entrar; al salir vuelve la del menú
  useEffect(() => {
    audioManager.playMusic(MUSIC_COMBAT);
    return () => audioManager.playMusic(MUSIC_MENU);
  }, []);

  // Auto-scroll: el registro baja hasta el último mensaje al añadir cualquier línea
  const logRef = useRef(null);
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [battleLog]);

  // Turno del rival: ataca un segundo después de tu turno.
  // Si cambia algo antes (modal, fin de combate), el temporizador se cancela.
  useEffect(() => {
    if (isGameOver || modal || turn !== 'enemy' || !playerFighter) return;
    const timer = setTimeout(() => {
      const damage = randomDamage();
      audioManager.playSound(SOUND_ATTACK);
      const newHp = Math.max(0, playerFighter.hp - damage);
      const updatedTeam = playerTeam.map((fighter, i) =>
        i === playerIndex ? { ...fighter, hp: newHp } : fighter
      );
      setPlayerTeam(updatedTeam);
      setBattleLog(prevLog => [...prevLog, `${rivalFighter.name} usó ${pickMove(rivalFighter)} y te hizo ${damage} puntos de daño.`]);

      if (newHp > 0) {
        setTurn('player');
        return;
      }
      // Ha caído tu Pokémon: eliges otro, o se acaba el combate
      setBattleLog(prevLog => [...prevLog, `${playerFighter.name} ha sido derrotado.`]);
      if (findAlive(updatedTeam) === -1) {
        setResult('lose');
      }
      setModal('player');
    }, 1000);
    return () => clearTimeout(timer);
  }, [turn, modal, isGameOver, playerTeam, playerIndex, rivalTeam, rivalIndex]);

  // Sin equipo (o sin rivales) no hay combate: volver a la selección
  if (playerTeam.length === 0 || rivalTeam.length === 0) {
    return <Navigate to="/seleccion-pokemon" replace />;
  }

  const playerAttack = () => {
    if (isGameOver || modal || turn !== 'player') return;
    const damage = randomDamage();
    audioManager.playSound(SOUND_ATTACK);
    const newHp = Math.max(0, rivalFighter.hp - damage);
    const updatedTeam = rivalTeam.map((fighter, i) =>
      i === rivalIndex ? { ...fighter, hp: newHp } : fighter
    );
    setRivalTeam(updatedTeam);
    setBattleLog(prevLog => [...prevLog, `Tu ${playerFighter.name} usó ${pickMove(playerFighter)} contra ${rivalFighter.name} y le hizo ${damage} puntos de daño.`]);

    if (newHp > 0) {
      setTurn('enemy');
      return;
    }
    // Ha caído el del rival. Aún no se muestra cuál sale después.
    setBattleLog(prevLog => [...prevLog, `${rivalFighter.name} ha sido derrotado.`]);
    if (findAlive(updatedTeam) === -1) {
      setResult('win');
    }
    setModal('rival');
  };

  // Cierra la modal tras caer un rival: ahora sale su siguiente Pokémon vivo
  const closeRivalModal = () => {
    setRivalIndex(findAlive(rivalTeam));
    setModal(null);
  };

  // Mantener el Pokémon actual: el rival saca al siguiente y es tu turno
  const keepPokemon = () => {
    closeRivalModal();
    setTurn('player');
  };

  // Cambiar a otro Pokémon vivo (tras caer el tuyo, o voluntariamente tras un KO)
  const switchPokemon = (index) => {
    if (playerTeam[index].hp === 0) return;
    setPlayerIndex(index);
    setBattleLog(prevLog => [...prevLog, `Sale ${playerTeam[index].name}.`]);
    if (modal === 'rival') {
      // Tras derrotar a un rival, el turno siempre es tuyo
      closeRivalModal();
      setTurn('player');
    } else {
      // Tras caer el tuyo, el rival ataca al que acabas de elegir
      setModal(null);
      setTurn('enemy');
    }
  };

  // Barra de vida con el mismo criterio de colores que la selección
  const hpPercent = (fighter) => (fighter.hp / fighter.maxHp) * 100;
  const hpColor = (fighter) => {
    const percent = hpPercent(fighter);
    if (percent > 50) return 'green';
    if (percent > 20) return 'orange';
    return 'red';
  };

  let modalText = '';
  if (modal === 'player' && result === 'lose') {
    modalText = 'Todos tus Pokémon están debilitados.';
  } else if (modal === 'player') {
    modalText = 'Tu Pokémon ha caído. Elige el siguiente.';
  } else if (result === 'win') {
    modalText = `Has acabado con ${rivalFighter.name} de tu oponente. Has derrotado a todo su equipo.`;
  } else if (modal === 'rival') {
    // Mismo criterio que closeRivalModal: el siguiente rival vivo es el que sale
    const nextRival = rivalTeam[findAlive(rivalTeam)];
    modalText = `Has acabado con ${rivalFighter.name} de tu oponente. El rival sacará a ${nextRival.name}.`;
  }

  return (
    <div className="combate-rapido-container">
      <h1>Combate Rápido</h1>

      {/* Arena: la imagen de fondo tiene las plataformas; los sprites se colocan encima */}
      <div
        className="arena"
        style={{ backgroundImage: 'url(/assets/images/combat-background.png)' }}
      >
        <div className="fighter-info rival-info">
          <strong>{rivalFighter.name}</strong>
          <div className="hp-bar">
            <div style={{ width: `${hpPercent(rivalFighter)}%`, backgroundColor: hpColor(rivalFighter) }} />
          </div>
          <span>{rivalFighter.hp}/{rivalFighter.maxHp} · Vivos {rivalTeam.filter(f => f.hp > 0).length}/{rivalTeam.length}</span>
        </div>
        <div className="fighter-info player-info">
          <strong>{playerFighter.name}</strong>
          <div className="hp-bar">
            <div style={{ width: `${hpPercent(playerFighter)}%`, backgroundColor: hpColor(playerFighter) }} />
          </div>
          <span>{playerFighter.hp}/{playerFighter.maxHp} · Vivos {playerTeam.filter(f => f.hp > 0).length}/{playerTeam.length}</span>
        </div>
        <img src={playerFighter.backSprite} alt={playerFighter.name} className="fighter-sprite player-sprite" />
        <img src={rivalFighter.frontSprite} alt={rivalFighter.name} className="fighter-sprite rival-sprite" />
      </div>

      <button onClick={playerAttack} disabled={isGameOver || modal !== null || turn !== 'player'}>
        {isGameOver ? 'Combate terminado' : turn === 'player' ? 'Atacar' : 'Turno del rival...'}
      </button>

      <div className="battle-log" ref={logRef}>
        {battleLog.map((log, index) => (
          <p key={index}>{log}</p>
        ))}
      </div>

      {modal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Tu equipo</h2>
            <p>{modalText}</p>

            {!isGameOver && (
              <div className="modal-team">
                {playerTeam.map((fighter, i) => {
                  const fainted = fighter.hp === 0;
                  // En la modal del rival, el que ya está en el campo solo se mantiene con el botón
                  const canPick = !fainted && !(modal === 'rival' && i === playerIndex);
                  return (
                    <div
                      key={i}
                      className={`modal-card ${fainted ? 'fainted' : ''} ${canPick ? 'selectable' : ''}`}
                      onClick={canPick ? () => switchPokemon(i) : undefined}
                    >
                      <img src={fighter.frontSprite} alt={fighter.name} className="modal-sprite" />
                      <strong>{fighter.name}</strong>
                      <span>{fighter.hp}/{fighter.maxHp} PS</span>
                    </div>
                  );
                })}
              </div>
            )}

            {isGameOver ? (
              <Link to="/seleccion-pokemon">Volver a la selección de equipo</Link>
            ) : modal === 'rival' ? (
              <button onClick={keepPokemon}>Mantener el Pokémon actual</button>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};

export default CombateRapido;
