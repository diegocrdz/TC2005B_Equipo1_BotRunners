class Enemy extends AnimatedObject {
    constructor(_color, width, height, x, y, _type) {
        super("red", width, height, x, y, _type);
        this.isFacingRight = false; // Default direction is left
        this.isHit = false;

        this.health = 0;
        this.maxHealth = 0;
        this.damage = 0;
        this.xp_reward = 0;
        this.attackCooldown = 500;

        this.speed = 0;
        this.velocity = new Vec(this.speed, 0.0);

        // Movement variables to define directions and animations
        this.movement = {
            right: { 
                status: false,
                axis: "x",
                sign: 1,
                repeat: true,
                duration: 100,
                moveFrames: [3, 4],
                idleFrames: [3, 4]
            },
            left: {
                status: false,
                axis: "x",
                sign: -1,
                repeat: true,
                duration: 100,
                moveFrames: [0, 1],
                idleFrames: [0, 1]
            },
            hit: { 
                status: false,
                repeat: true,
                duration: 200,
                right: [5, 5],
                left: [2, 2]
            },
        };

        // Hitbox properties
        this.offsetX = 0.5;
        this.offsetY = 1;
        this.hWidth = this.size.x + 1;
        this.hHeight = this.size.y + 1;
    }

    update(level, deltaTime) {
        this.setHitbox(this.offsetX, this.offsetY, this.hWidth, this.hHeight);

        // Make the character fall constantly because of gravity
        this.velocity.y = this.velocity.y + gravity * deltaTime;
    
        // Move the enemy horizontally
        this.moveHorizontally(level, deltaTime);
        // Follow the player
        this.followPlayer(level, deltaTime);
        // Move the enemy vertically
        this.moveVertically(level, deltaTime);
    
        this.updateFrame(deltaTime);
    }

    moveHorizontally(level, deltaTime) {
        const newXPosition = this.position.plus(new Vec(this.velocity.x * deltaTime, 0));
        if (!level.contact(newXPosition, this.size, 'wall')
            && !level.contact(newXPosition, this.size, 'box')) {
            this.position = newXPosition;
        }
    }

    bounceOffWalls(level, deltaTime) {
        const newXPosition = this.position.plus(new Vec(this.velocity.x * deltaTime, 0));
        if (level.contact(newXPosition, this.size, 'wall')) {
            this.velocity.x = -this.velocity.x; // Reverse direction
            this.isFacingRight = !this.isFacingRight; // Update facing direction
            this.startMovement(this.isFacingRight ? "right" : "left"); // Update animation
        }
    }

    followPlayer(level, deltaTime) {
        const playerToRight = level.player.position.x > this.position.x;

        if (playerToRight) {
            if (!this.isFacingRight) {
                this.isFacingRight = true;
                this.startMovement("right");
            }
            this.velocity.x = Math.abs(this.speed); // Move right
        } else {
            if (this.isFacingRight) {
                this.isFacingRight = false;
                this.startMovement("left");
            }
            this.velocity.x = -Math.abs(this.speed); // Move left
        }
    }

    moveVertically(level, deltaTime) {
        const newYPosition = this.position.plus(new Vec(0, this.velocity.y * deltaTime));
        if (!level.contact(newYPosition, this.size, 'wall')
            && !level.contact(newYPosition, this.size, 'box')) {
            this.position = newYPosition;
        } else {
            this.velocity.y = 0; // Stop vertical movement on collision
        }
    }

    draw(ctx, scale) {
        super.draw(ctx, scale);
        this.drawHitbox(ctx, scale);
    }

    // Draw the health bar above the enemy
    drawHealthBar(ctx, scale) {
        const barWidth = this.size.x * scale; // Width of the health bar
        const barHeight = 6; // Height of the health bar
        const x = this.position.x * scale; // X position of the health bar
        const y = (this.position.y - 0.1) * scale; // Y position (above the enemy)

        // Calculate the width of the health portion
        const healthWidth = (this.health / this.maxHealth) * barWidth;

        // Draw the background (red bar)
        ctx.fillStyle = "black";
        ctx.fillRect(x, y, barWidth, barHeight);

        // Draw the foreground (green bar)
        ctx.fillStyle = "red";
        ctx.fillRect(x, y, healthWidth, barHeight);

        // Optional: Draw a border around the health bar
        ctx.strokeStyle = "black";
        // Make the border bigger
        ctx.lineWidth = 3;
        ctx.strokeRect(x, y, barWidth, barHeight);
    }

    startMovement(direction) {
        const dirData = this.movement[direction];
        dirData.status = true;
        this.velocity[dirData.axis] = dirData.sign * this.speed;
        this.setAnimation(...dirData.moveFrames, dirData.repeat, dirData.duration);
    }

    stopMovement(direction) {
        const dirData = this.movement[direction];
        dirData.status = false;
        this.velocity[dirData.axis] = 0;
        this.setAnimation(...dirData.idleFrames, dirData.repeat, dirData.duration);
    }

    takeDamage(amount, cooldown) {
        if (this.isInvulnerable) return;
    
        this.health -= amount; // Reduce health by the damage amount
        this.hit(); // Play the hit animation
    
        if (this.health <= 0) {
            this.die(); // Kill the enemy if health is 0 or less
        } else {
            this.isInvulnerable = true; // Make the enemy invulnerable for a short time
            setTimeout(() => {
                this.isInvulnerable = false;
            }, cooldown); // Cooldown period
        }
    }

    die() {
        // Get the position of the enemy
        let x = this.position.x + 1;
        let y = this.position.y;
        
        // Create a coin with the experience value of the enemy
        let expCoin = new Coin("yellow", 1, 1, x, y, "$");
        expCoin.xp_value = this.xp_reward; // Asigna el valor de experiencia del enemigo
        expCoin.hasGravity = true; // Make the coin fall
    
        // Add the coin to the actors list of the game
        game.actors.push(expCoin);

        // Eliminate the enemy from the actor list
        game.actors = game.actors.filter(actor => actor !== this);
        
        // Eliminate the enemies from the level. The player is supposed to kill every enemy to pass each level.
        if (this.type === "enemy") {
            GAME_LEVELS[game.levelNumber] = GAME_LEVELS[game.levelNumber].replace('N', '.');
            GAME_LEVELS[game.levelNumber] = GAME_LEVELS[game.levelNumber].replace('H', '.');
            GAME_LEVELS[game.levelNumber] = GAME_LEVELS[game.levelNumber].replace('F', '.');
        } else if (this.type === "boss") {
            GAME_LEVELS[game.levelNumber] = GAME_LEVELS[game.levelNumber].replace('X', '.');
        }
    }

    hit() {
        if (this.isHit) return; // Prevent re-triggering the hit animation if already playing
    
        this.isHit = true;
        const hitData = this.movement.hit;
        
        if (this.isFacingRight) {
            this.setAnimation(...hitData.right, hitData.repeat, hitData.duration);
        } else {
            this.setAnimation(...hitData.left, hitData.repeat, hitData.duration);
        }

        // Reset the isHit flag after the animation duration
        setTimeout(() => {
            this.isHit = false;
            // Continue moving in the same direction after being hit
            this.startMovement(this.isFacingRight ? "right" : "left");
        }, hitData.duration * 2); // 2 times the duration of the hit animation
    }
}

class NormalEnemy extends Enemy {
    constructor(_color, width, height, x, y, _type) {
        super("red", width, height, x, y, "enemy");

        this.health = 50;
        this.maxHealth = 50;
        this.damage = 20;
        this.xp_reward = 10;

        this.speed = 0.003;
        this.velocity = new Vec(this.speed, 0);
    }
}

class HeavyEnemy extends Enemy {
    constructor(_color, width, height, x, y, _type) {
        super("red", width, height, x, y, "enemy");

        this.health = 75;
        this.maxHealth = 75;
        this.damage = 40;
        this.xp_reward = 20;

        this.speed = 0.0005;
        this.velocity = new Vec(this.speed, 0);
    }
}

class FlyingEnemy extends Enemy {
    constructor(_color, width, height, x, y, _type) {
        super("red", width, height, x, y, "enemy");
        this.isFacingRight = true; // Default direction is right

        this.health = 25;
        this.maxHealth = 25;
        this.damage = 10;
        this.xp_reward = 15;

        this.speed = 0.002;
        this.velocity = new Vec(this.speed, 0);
    }

    update(level, deltaTime) {
        this.setHitbox(this.offsetX, this.offsetY, this.hWidth, this.hHeight);
        this.moveHorizontally(level, deltaTime);
        this.bounceOffWalls(level, deltaTime);
        this.updateFrame(deltaTime);
    }
}

class BossEnemy extends Enemy {
    constructor(_color, width, height, x, y, _type) {
        super("red", width, height, x, y, "boss");

        this.health = 200;
        this.maxHealth = 200;
        this.damage = 30;
        this.xp_reward = 500;

        this.speed = 0.002;
        this.velocity = new Vec(this.speed, 0);

        // Jumping flag for special attack
        this.isJumping = false;

        // Hitbox properties
        this.offsetX = 1;
        this.offsetY = 1;
        this.hWidth = this.size.x + 2;
        this.hHeight = this.size.y + 3;
    }

    update(level, deltaTime) {
        this.setHitbox(this.offsetX, this.offsetY, this.hWidth, this.hHeight);
        this.velocity.y += gravity * deltaTime;
        this.moveHorizontally(level, deltaTime);
        this.followPlayer(level, deltaTime);
        this.moveVertically(level, deltaTime);

        // Make the boss jump if health is below 50%
        if (this.health < this.maxHealth / 2
            && this.velocity.y === 0
            && !this.isJumping) {
            this.velocity.y = -0.039; // Make the boss jump if on the ground
            this.isJumping = true; // Set the jumping flag
            setTimeout(() => {
                this.velocity.y = 0; // Stop the boss from jumping
                this.isJumping = false; // Reset the jumping flag
            }, 1000); // 1 second
        }

        this.updateFrame(deltaTime);
    }
}