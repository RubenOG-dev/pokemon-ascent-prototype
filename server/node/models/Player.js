// server/node/models/Player.js
const Creature = require('./Creature');  // Importamos la clase Creature

class Player {
    constructor(name) {
        this.name = name;
        this.creatures = [];  // El jugador tendrá una lista de criaturas
    }

    // Método para agregar una criatura a la lista del jugador
    addCreature(creature) {
        this.creatures.push(creature);
    }

    // Método para atacar con una de las criaturas del jugador
    attackCreature(creature, target) {
        creature.attack(target);
    }
}

module.exports = Player;
