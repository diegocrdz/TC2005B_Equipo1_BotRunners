/*
 * Weapons for the game
 *
 * Team BotRunners:
 * - Diego Córdova Rodríguez, A01781166
 * - Lorena Estefanía Chewtat Torres, A01785378
 * - Eder Jezrael Cantero Moreno, A01785888
 *
 * Date: 24/04/2025
*/

"use strict";

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

// Define weapons for the game
const weapons = {
    // Basic weapons
    arm: new Weapon("arm", 0, 500),
    slow_gun: new Weapon("slowGun", 0, 800),
    // Better wapons
    roboticArm: new Weapon("romoticArm", 4, 250),
    fast_gun: new Weapon("fastGun", 2, 400),
}