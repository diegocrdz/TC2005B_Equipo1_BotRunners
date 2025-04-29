/*
 * Particles left by the player after dashing
 *
 * Team BotRunners:
 * - Diego Córdova Rodríguez, A01781166
 * - Lorena Estefanía Chewtat Torres, A01785378
 * - Eder Jezrael Cantero Moreno, A01785888
 *
 * Date: 29/04/2025
*/

"use strict";

// Coin collectible by the player
class Particle extends GameObject {
    constructor(_color, width, height, x, y, _type) {
        super("gray", width, height, x, y, "particle");
        this.velocity = new Vec(0.0, 0.0);

        this.setSprite('../../assets/objects/dust.png', new Rect(0, 0, 18, 18));

        this.duration = 1000; // Duration of the particle
        this.remove = false; // Flag to mark the particle for removal

        game.addParticle(this); // Add the particle to the game
        console.log("Particle created"); // Log when the particle is created
    }  

    update(deltaTime) {
        // Make the particle disappear more slowly
        this.duration -= deltaTime; // Decrease the duration at a slower rate
        if (this.duration <= 0) {
            console.log("Particle removed"); // Log when the particle is removed
            game.removeParticle(this); // Remove the particle from the game
        }
    }
}