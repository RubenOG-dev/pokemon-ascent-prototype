import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./SeleccionPokemon.css";
import Header from "../../components/Header.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const traducirTipo = (tipo) => {
  const tiposTraduccion = {
    agua: "water",
    bicho: "bug",
    dragón: "dragon",
    eléctrico: "electric",
    fantasma: "ghost",
    fuego: "fire",
    hada: "fairy",
    hielo: "ice",
    lucha: "fighting",
    normal: "normal",
    planta: "grass",
    psíquico: "psychic",
    roca: "rock",
    siniestro: "dark",
    tierra: "ground",
    volador: "flying",
    veneno: "poison",
    acero: "steel",
  };
  return tiposTraduccion[tipo] || tipo;
};

const Filtros = ({
  types,
  setNameSearchTerm,
  setPokedexSearchTerm,
  setTypeFilter1,
  setTypeFilter2,
}) => (
  <div className="filtros">
    <input
      type="text"
      placeholder="Buscar por nombre..."
      onChange={(e) => setNameSearchTerm(e.target.value)}
    />
    <input
      type="number"
      placeholder="Número Pokédex"
      onChange={(e) => setPokedexSearchTerm(e.target.value)}
    />
    <select onChange={(e) => setTypeFilter1(e.target.value)}>
      <option value="">Filtrar por tipo 1</option>
      {types.map((type, index) => (
        <option key={index} value={type}>
          {type}
        </option>
      ))}
    </select>
    <select onChange={(e) => setTypeFilter2(e.target.value)}>
      <option value="">Filtrar por tipo 2</option>
      {types.map((type, index) => (
        <option key={index} value={type}>
          {type}
        </option>
      ))}
    </select>
  </div>
);

const PokemonCard = ({ pokemon, onSelect }) => {
  const [isJumping, setIsJumping] = useState(false);

  const handleCardClick = () => {
    // Activar el efecto de salto
    setIsJumping(true);
    setTimeout(() => {
      setIsJumping(false); // Eliminar el efecto después de la animación
    }, 1000); // Duración de la animación (1 segundo)

    // Llamar a la función onSelect para hacer algo con el Pokémon
    onSelect(pokemon);
  };

  return (
    <div
      className={`pokemon-card ${isJumping ? "saltando" : ""}`}
      onClick={handleCardClick}
    >
      <img src={pokemon.sprites?.front_default} alt={pokemon.name} />
    </div>
  );
};

const Equipo = ({ selectedPokemons, onCombat, onRemove }) => (
  <div className="columna equipo">
    <h1>Equipo seleccionado</h1>
    {selectedPokemons.length > 0 ? (
      selectedPokemons.map((pokemon) => {
        // Calcula la vida máxima (maxHp) y la vida actual (currentHp)
        const hpStat = pokemon.stats.find((stat) => stat.stat.name === "hp");
        const maxHp = hpStat ? hpStat.base_stat : 100; // Establece maxHp a la vida total del Pokémon
        const currentHp = maxHp; // Al empezar, la vida actual es la máxima
        const hpPercentage = (currentHp / maxHp) * 100;

        return (
          <div key={pokemon.id} className="pokemon-slot">
            {/* Visible solo al pasar el ratón por la tarjeta */}
            <button
              type="button"
              className="remove-btn"
              title="Quitar del equipo"
              onClick={() => onRemove(pokemon.id)}
            >
              ×
            </button>
            <figure>
              <img
                src={pokemon.sprites?.front_default}
                alt={pokemon.name}
                className="pokemon-image"
              />
            </figure>
            <div id="equipoInfoPokemon">
              {/* Nombre del Pokémon */}
              <h3>{pokemon.name}</h3>
              {/* Barra de vida */}
              <div className="hp-bar-container">
                <div
                  className="hp-bar"
                  style={{
                    width: `${hpPercentage}%`, // Ancho basado en el porcentaje de vida
                    backgroundColor:
                      hpPercentage > 50
                        ? "green"
                        : hpPercentage > 20
                        ? "orange"
                        : "red", // Cambia el color de la barra según la vida
                  }}
                />
              </div>
              <p>
                {currentHp}/{maxHp}
              </p>{" "}
              {/* Muestra la vida actual y máxima del Pokémon */}
            </div>
          </div>
        );
      })
    ) : (
      <p>No has seleccionado Pokémon aún.</p>
    )}
    <div className="equipo-footer">
      <p>
        {selectedPokemons.length < 6
          ? `Has seleccionado ${selectedPokemons.length}/6 Pokémon`
          : "Equipo completo (6/6)"}
      </p>
      <button
        onClick={onCombat}
        disabled={selectedPokemons.length < 6}
        className={selectedPokemons.length < 6 ? "btn-locked" : ""}
      >
        {selectedPokemons.length < 6
          ? "🔒 Combatir con este equipo"
          : "Combatir con este equipo"}
      </button>
    </div>
  </div>
);

const normalizarEstadisticas = (stats) => {
  const maxEstadistica = 200; // Valor máximo estándar para normalizar
  return stats.map((stat) => Math.min(stat.base_stat, maxEstadistica));
};

const SeleccionarPokemons = () => {
  const navigate = useNavigate();
  const [allPokemons, setAllPokemons] = useState([]);
  const [filteredPokemons, setFilteredPokemons] = useState([]);
  const [selectedPokemons, setSelectedPokemons] = useState([]);
  const [selectedPokemonDetails, setSelectedPokemonDetails] = useState(null);
  const [nameSearchTerm, setNameSearchTerm] = useState("");
  const [pokedexSearchTerm, setPokedexSearchTerm] = useState("");
  const [typeFilter1, setTypeFilter1] = useState("");
  const [typeFilter2, setTypeFilter2] = useState("");

  const types = [
    "agua",
    "bicho",
    "dragón",
    "eléctrico",
    "fantasma",
    "fuego",
    "hada",
    "hielo",
    "lucha",
    "normal",
    "planta",
    "psíquico",
    "roca",
    "siniestro",
    "tierra",
    "volador",
    "veneno",
    "acero",
  ];

  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        const response = await fetch(
          "https://pokeapi.co/api/v2/pokemon?limit=1281"
        );
        const data = await response.json();
        const pokemons = await Promise.all(
          data.results.map(async (pokemon) => {
            const pokemonResponse = await fetch(pokemon.url);
            const pokemonData = await pokemonResponse.json();
            return {
              id: pokemonData.id,
              name: pokemon.name,
              types: pokemonData.types,
              sprites: pokemonData.sprites,
              stats: pokemonData.stats,
              moves: pokemonData.moves.slice(0, 10),
            };
          })
        );
        setAllPokemons(pokemons);
        setFilteredPokemons(pokemons);
      } catch (error) {
        console.error("Error al obtener los Pokémon:", error);
      }
    };
    fetchPokemons();
  }, []);

  useEffect(() => {
    const filterPokemons = () => {
      let filtered = allPokemons;

      // Filtrar por nombre
      if (nameSearchTerm) {
        filtered = filtered.filter((pokemon) =>
          pokemon.name.toLowerCase().includes(nameSearchTerm.toLowerCase())
        );
      }

      // Filtrar por número de Pokédex
      if (pokedexSearchTerm) {
        filtered = filtered.filter((pokemon) =>
          pokemon.id.toString().startsWith(pokedexSearchTerm)
        );
      }

      // Filtrar por tipo 1
      if (typeFilter1) {
        const tipo1 = traducirTipo(typeFilter1);
        filtered = filtered.filter((pokemon) =>
          pokemon.types.some((type) => type.type.name === tipo1)
        );
      }

      // Filtrar por tipo 2
      if (typeFilter2) {
        const tipo2 = traducirTipo(typeFilter2);
        filtered = filtered.filter((pokemon) =>
          pokemon.types.some((type) => type.type.name === tipo2)
        );
      }

      setFilteredPokemons(filtered);
    };

    filterPokemons();
  }, [
    nameSearchTerm,
    pokedexSearchTerm,
    typeFilter1,
    typeFilter2,
    allPokemons,
  ]);

  const handleAddToTeam = (pokemon) => {
    if (selectedPokemons.some((p) => p.id === pokemon.id)) {
      alert("Este Pokémon ya está en tu equipo");
      return;
    }
    if (selectedPokemons.length >= 6) {
      alert("Ya tienes 6 Pokémon en tu equipo");
      return;
    }
    setSelectedPokemons((prev) => [...prev, pokemon]);
  };

  return (
    <div className="contenedor">
      <header>
        <Header />
      </header>
      <main>
        <Equipo
          selectedPokemons={selectedPokemons}
          onRemove={(id) =>
            setSelectedPokemons((prev) => prev.filter((p) => p.id !== id))
          }
          onCombat={() =>
            navigate("/combate-rapido", {
              state: { selectedPokemons, allPokemons },
            })
          }
        />
        <div className="columna pokedex">
          <h2>Selecciona tus Pokémon</h2>
          <Filtros
            types={types}
            setNameSearchTerm={setNameSearchTerm}
            setPokedexSearchTerm={setPokedexSearchTerm}
            setTypeFilter1={setTypeFilter1}
            setTypeFilter2={setTypeFilter2}
          />
          <div className="pokemon-cards">
            {filteredPokemons.map((pokemon) => (
              <PokemonCard
                key={pokemon.id}
                pokemon={pokemon}
                onSelect={setSelectedPokemonDetails}
              />
            ))}
          </div>
        </div>
        <div className="columna detalles">
          {selectedPokemonDetails && (
            <div>
              <div id="infoPokemon">
                <div className="headerDetalles">
                  <h2>Detalles del Pokémon</h2>
                  <button
                    onClick={() => handleAddToTeam(selectedPokemonDetails)}
                  >
                    Añadir {selectedPokemonDetails.name} al equipo
                  </button>
                </div>
                <h3>{selectedPokemonDetails.name}</h3>
                <img
                  src={selectedPokemonDetails.sprites.front_default}
                  alt={selectedPokemonDetails.name}
                />
                <div className="tipos">
                  {selectedPokemonDetails.types.map((type, index) => (
                    <div key={index} className={`type-${type.type.name}`}>
                      {type.type.name}
                    </div>
                  ))}
                </div>
              </div>
              <div
                id="estadisticas"
                style={{ width: "350px", height: "250px" }}
              >
                <Bar
                  data={{
                    labels: [
                      "HP",
                      "Ataque",
                      "Defensa",
                      "Velocidad",
                      "Sp. Ataque",
                      "Sp. Defensa",
                    ],
                    datasets: [
                      {
                        label: "Estadísticas",
                        data: normalizarEstadisticas(
                          selectedPokemonDetails.stats
                        ),
                        backgroundColor: "rgba(75, 192, 192, 0.2)",
                        borderColor: "rgba(75, 192, 192, 1)",
                        borderWidth: 1,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    indexAxis: "y",
                    scales: {
                      x: { beginAtZero: true, max: 200 },
                    },
                  }}
                />
              </div>
              <div id="movimientos">
                <h3>Movimientos:</h3>
                <ul>
                  {selectedPokemonDetails.moves.map((move, index) => (
                    <li key={index}>
                      {move.move.name} (Daño:{" "}
                      {Math.floor(Math.random() * 30) + 20})
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </main>
      <footer></footer>
    </div>
  );
};

export default SeleccionarPokemons;
