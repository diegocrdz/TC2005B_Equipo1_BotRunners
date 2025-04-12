/*
 * Projectiles shot by the player when using the gun
 *
 * Team BotRunners:
 * - Diego Córdova Rodríguez, A01781166
 * - Lorena Estefanía Chewtat Torres, A01785378
 * - Eder Jezrael Cantero Moreno, A01785888
 *
 * Date: 04/04/2025
*/

// Class that defines projectiles shot by the player when using the gun
class Projectile extends GameObject {
    constructor(_color, width, height, x, y, _type, direction) {
        super("blue", width, height, x, y, "projectile");

        this.setSprite('../../assets/objects/xp_orb.png', new Rect(0, 0, 32, 32));
    
        this.speed = 0.04 // Speed of the projectile
        this.duration = 1000; // Duration of the projectile in milliseconds
        this.type = "";

        // Set velocity based on direction
        this.velocity = new Vec(direction === "right" ? this.speed : -this.speed, 0);
    }

    update(level, deltaTime) {
        // Update the hitbox
        this.setHitbox(0, 0, this.size.x, this.size.y);

        // New variables for the velocity
        let velX = this.velocity.x;

        // Find out where the projectile is going
        let newXPosition = this.position.plus(new Vec(velX * deltaTime, 0)); // d = v * t
        // Move only if there is no collision
        if (!level.contact(newXPosition, this.size, 'wall')) {
            this.position = newXPosition;
        } else {
            game.removeProjectile(this);
        }
    }

    // Draw the projectile and its hitbox
    draw(ctx, scale) {
        super.draw(ctx, scale);
        this.drawHitbox(ctx, scale);
    }
}