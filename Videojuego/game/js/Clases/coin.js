/*
 * Coins that the player can collect to gain experience points
 * Coins are also dropped by enemies when they die
 *
 * Team BotRunners:
 * - Diego Córdova Rodríguez, A01781166
 * - Lorena Estefanía Chewtat Torres, A01785378
 * - Eder Jezrael Cantero Moreno, A01785888
 *
 * Date: 24/04/2025
*/

"use strict";

// Coin collectible by the player
class Coin extends GameObject {
    constructor(_color, width, height, x, y, _type) {
        super("yellow", width, height, x, y, "coin");
        this.velocity = new Vec(0.0, 0.0);

        this.setSprite('../../assets/objects/xp_orb.png', new Rect(0, 0, 32, 32));

        this.xp_value = 5; // Default value of the coin
        this.isCollectible = false; // Prevent the player from collecting the coin immediately
        this.hasGravity = false; // Coins do not fall by default

        // Timer to make the coin collectible after a short delay
        setTimeout(() => {
            this.isCollectible = true;
        }, 500);
    }  

    update(level, deltaTime) {
        this.setHitbox(0, 0, this.size.x, this.size.y); // Update the hitbox

        if (this.hasGravity) {
            // Apply gravity
            this.velocity.y = this.velocity.y + gravity * deltaTime;

            let velY = this.velocity.y;

            // Find out where the coin should end if it moves vertically
            let newYPosition = this.position.plus(new Vec(0, velY * deltaTime));
            // Move only if the coin does not move inside a wall
            if (!level.contact(newYPosition, this.size, 'wall')
                && !level.contact(newYPosition, this.size, 'box')) {
                this.position = newYPosition;
            } else {
                this.velocity.y = 0; // Stop vertical movement on collision
            }
        }
    }
}