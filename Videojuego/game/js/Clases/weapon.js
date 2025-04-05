/*
 * Weapons for the game
 *
 * Team BotRunners:
 * - Diego Córdova Rodríguez, A01781166
 * - Lorena Estefanía Chewtat Torres, A01785378
 * - Eder Jezrael Cantero Moreno, A01785888
 *
 * Date: 04/04/2025
*/

// Class that defines a general weapon for the game
// The weapons used by the player are defined in his class player.js
class Weapon {
    constructor(name, damage, cooldown) {
        this.name = name;
        this.damage = damage;
        this.cooldown = cooldown;

        this.isUnlocked = false;
    }
}