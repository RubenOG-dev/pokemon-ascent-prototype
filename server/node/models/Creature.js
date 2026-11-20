// server/node/models/Creature.js

class Creature {
    constructor(name, type, health) {
        this.name = name;
        this.type = type;
        this.health = health;
    }

    // Método de ataque que afecta a la salud de la criatura objetivo
    attack(target) {
        const damage = Math.floor(Math.random() * 10) + 5;
        target.health -= damage;
        console.log(`${this.name} atacó a ${target.name} causando ${damage} de daño.`);
    }

    // Verifica si la criatura sigue viva
    isAlive() {
        return this.health > 0;
    }
}

module.exports = Creature;
