// Collection of classes that will be used in the game

"use strict";

class Vec {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    plus(other) {
        return new Vec(this.x + other.x, this.y + other.y);
    }

    minus(other) {
        return new Vec(this.x - other.x, this.y - other.y);
    }

    times(scalar) {
        return new Vec(this.x * scalar, this.y * scalar);
    }

    magnitude() {
        return Math.sqrt(this.x**2 + this.y**2);
    }
}

class GameObject {
    constructor(position, width, height, color, type) {
        this.position = position;
        this.width = width;
        this.height = height;
        this.color = color;
        this.type = type;
    }

    // Draw the object on the canvas
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }

    // Empty update method that will be overridden by subclasses
    update() {}
}

// Detect collision between two objects
function boxOverlap(obj1, obj2) {
    return obj1.position.x + obj1.width > obj2.position.x &&
           obj1.position.x < obj2.position.x + obj2.width &&
           obj1.position.y + obj1.height > obj2.position.y &&
           obj1.position.y < obj2.position.y + obj2.height;
}

// Base class for characters in the game
class BaseCharacter extends GameObject {
    constructor(position, width, height, color, type, health, damage, speed) {
        super(position, width, height, color, type);
        this.health = health;
        this.damage = damage;
        this.speed = speed;
        this.velocity = new Vec(0, 0);

        this.facingRight = true; // By default, characters face right
        this.currentImage = new Image(); // Current image to draw
        this.animationFrame = 0;
        this.animationTimer = 0;
    }

    move(direction) {
        this.position = this.position.plus(direction.times(this.speed));
    }

    takeDamage(amount) {
        this.health -= amount;
        if (this.health <= 0) {
            this.die();
        }
    }

    die() {
        console.log(`${this.type} ha sido eliminado.`);
    }

    // Empty update method that will be overridden by subclasses
    update(deltaTime) {
        this.position = this.position.plus(this.velocity.times(deltaTime)); // d = v * t

        // Detect collisions with the canvas boundaries
        if (this.position.x < 0) {
            this.position.x = 0;
        }
        if (this.position.x + this.width > canvasWidth) {
            this.position.x = canvasWidth - this.width;
        }
        if (this.position.y < 0) {
            this.position.y = 0;
        }
        if (this.position.y + this.height > canvasHeight) {
            this.position.y = canvasHeight - this.height;
        }

        // Apply gravity
        this.velocity.y += gravity;

        // Update the facing direction
        if (this.velocity.x > 0) {
            this.facingRight = true;
        } else if (this.velocity.x < 0) {
            this.facingRight = false;
        }

        // Call the animation controller
        this.controlAnimation(deltaTime);
    }

    controlAnimation(deltaTime) {
        // Empty method that will be overridden by subclasses
    }

    // Draw the character on the canvas
    draw(ctx) {
        ctx.save(); // Saves the current state of the context
    
        if (!this.facingRight) {
            // If the character is facing left, flip the canvas horizontally
            ctx.translate(this.position.x + this.width, this.position.y);
            ctx.scale(-1, 1);
            ctx.drawImage(
                this.currentImage, // Current image to draw
                0, 0,  // Source position
                this.width,
                this.height
            );
        } else {
            // Draw the character normally
            ctx.translate(this.position.x, this.position.y);
            ctx.drawImage(
                this.currentImage,
                0, 0, 
                this.width,
                this.height
            );
        }
    
        ctx.restore(); // Restores the saved state of the context
    }    
}
