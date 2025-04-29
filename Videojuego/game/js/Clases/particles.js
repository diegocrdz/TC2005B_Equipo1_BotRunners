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

// This class is used to create particles that are left behind when the player dashes
class Particle extends AnimatedObject {
    constructor(_color, width, height, x, y, _type, actor) {
        super("gray", width, height, x, y, "particle");

        this.actor = actor;

        // Sprite properties
        this.setSprite('../../assets/objects/dash_particle.png', new Rect(0, 0, 16, 16));
        this.frames = {
            right: [0, 4],
            left: [5, 9],
            repeat: false,
            duration: 100,
        };
        this.currentAnimation = this.frames.right;
        this.sheetCols = 10; // Number of columns in the sprite sheet

        // Particle properties
        this.speed = 0.5;
        this.velocity = new Vec(0, 0);
        this.duration = 500;
        this.offsetX = 0;

        // Add the particle to the game
        game.addParticle(this);
    }

    update(level, deltaTime) {
        if (this.actor.isFacingRight) {
            // Set velocity to the right
            this.velocity.x = this.speed;
            this.offsetX = -2.5;

            // Set the animation
            if (this.currentAnimation !== "right") {
                this.setAnimation(...this.frames.right, this.frames.repeat, this.frames.duration);
                this.currentAnimation = "right"; // Update the current animation
            }

        } else {
            this.velocity.x = -this.speed; // Set velocity to the left
            this.offsetX = this.actor.size.x; // Set offset to the left

            // Set the animation
            if (this.currentAnimation !== "left") {
                this.setAnimation(...this.frames.left, this.frames.repeat, this.frames.duration);
                this.currentAnimation = "left"; // Update the current animation
            }
        }

        // Update the position of the particle
        this.position = this.actor.position.plus(new Vec(this.offsetX, 0.5)).times(scale);

        // Update the animation frame
        this.updateFrame(deltaTime);
        
        // Decrease the duration of the particle
        this.duration -= deltaTime;
        if (this.duration <= 0) {
            // Remove the particle from the game
            game.removeParticle(this);
        }
    }
}