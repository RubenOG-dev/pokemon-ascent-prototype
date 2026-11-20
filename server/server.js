const express = require('express');
const mysql = require('mysql2');
const Player = require('./node/models/Player');
const Creature = require('./node/models/Creature');
const cors = require('cors');

// Configuración de Express
const app = express();
const port = 3000;

// Habilitar CORS para permitir peticiones desde el cliente
app.use(cors());

// Configuración de la base de datos
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '', // Definir en .env (ver README), nunca en el código
    database: process.env.DB_NAME || 'pokemon_game'
});

// Conectar a la base de datos
db.connect(err => {
    if (err) {
        console.error('Error de conexión a la base de datos:', err);
        return;
    }
    console.log('Conectado a la base de datos');
});

// Crear instancias del jugador y las criaturas (Ejemplo inicial)
let player = new Player('Jugador1');
let enemyCreature = new Creature('Pikachu', 'Electric', 100);
let playerCreature = new Creature('Charmander', 'Fire', 100);

// Agregar criaturas al jugador
player.addCreature(playerCreature);

// Ruta principal
app.get('/', (req, res) => {
    res.send('¡Bienvenido al juego!');
});

// Ruta para iniciar la batalla
app.get('/start-battle', (req, res) => {
    // El jugador ataca con su criatura
    player.attackCreature(player.creatures[0], enemyCreature);
    
    // Verificar si la criatura enemiga ha sido derrotada
    if (!enemyCreature.isAlive()) {
        res.send('¡El enemigo ha sido derrotado!');
    } else {
        res.send('La batalla continúa...');
    }
});

// Ruta para crear una partida (modo historia)
app.get('/start-story', (req, res) => {
    const playerName = req.query.playerName || 'Jugador1'; // Obtener nombre de jugador desde query params

    // Crear nuevo jugador e inicializar criaturas
    const newPlayer = new Player(playerName);
    const starterCreature = new Creature('Bulbasaur', 'Grass', 100); // Criatura inicial
    newPlayer.addCreature(starterCreature);

    // Guardar el jugador en la base de datos
    const queryPlayer = 'INSERT INTO players (name) VALUES (?)';
    db.query(queryPlayer, [newPlayer.name], (err, result) => {
        if (err) {
            console.error('Error al insertar jugador:', err);
            return res.status(500).send('Error al crear la partida');
        }

        const playerId = result.insertId; // Obtener el ID del nuevo jugador

        // Guardar las criaturas del jugador
        const queryCreature = 'INSERT INTO creatures (name, type, health, player_id) VALUES (?, ?, ?, ?)';
        db.query(queryCreature, [starterCreature.name, starterCreature.type, starterCreature.health, playerId], (err, result) => {
            if (err) {
                console.error('Error al insertar criatura:', err);
                return res.status(500).send('Error al crear la criatura');
            }

            res.send('Partida creada correctamente en el modo historia');
        });
    });
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});