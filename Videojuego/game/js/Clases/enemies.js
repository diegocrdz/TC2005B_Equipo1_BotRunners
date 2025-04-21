/*
 * Enemies in the game
 *
 * Team BotRunners:
 * - Diego Córdova Rodríguez, A01781166
 * - Lorena Estefanía Chewtat Torres, A01785378
 * - Eder Jezrael Cantero Moreno, A01785888
 *
 * Date: 04/04/2025
*/

// Generic enemy class
class Enemy extends AnimatedObject {
    constructor(_color, width, height, x, y, _type) {
        super("red", width, height, x, y, _type);
        this.isFacingRight = false; // Default direction is left
        this.isHit = false;

        // Properties
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

    // Make the enemy move horizontally
    moveHorizontally(level, deltaTime) {
        const newXPosition = this.position.plus(new Vec(this.velocity.x * deltaTime, 0));
        if (!level.contact(newXPosition, this.size, 'wall')
            && !level.contact(newXPosition, this.size, 'box')) {
            this.position = newXPosition;
        }
    }

    // Make the enemy change direction when it hits a wall
    bounceOffWalls(level, deltaTime) {
        const newXPosition = this.position.plus(new Vec(this.velocity.x * deltaTime, 0));
        if (level.contact(newXPosition, this.size, 'wall')) {
            this.velocity.x = -this.velocity.x; // Reverse direction
            this.isFacingRight = !this.isFacingRight; // Update facing direction
            this.startMovement(this.isFacingRight ? "right" : "left"); // Update animation
        }
    }

    // Make the enemy change direction to follow the player
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

    // Make the enemy move vertically
    moveVertically(level, deltaTime) {
        const newYPosition = this.position.plus(new Vec(0, this.velocity.y * deltaTime));
        if (!level.contact(newYPosition, this.size, 'wall')
            && !level.contact(newYPosition, this.size, 'box')) {
            this.position = newYPosition;
        } else {
            this.velocity.y = 0; // Stop vertical movement on collision
        }
    }

    // Draw the enemy and hitbox
    draw(ctx, scale) {
        super.draw(ctx, scale);
        this.drawHitbox(ctx, scale);
    }

    // Draw the health bar above the enemy
    drawHealthBar(ctx, scale) {
        const healthBar = new Bar(
                                this.position.x * scale, // x
                                (this.position.y - 0.1) * scale, // y
                                this.size.x * scale, // width
                                6, // height
                                this.maxHealth, // maxHealth
                                this.health,  // currentHealth
                                "red", // color
                                "black", // borderColor
                                "black"); // backgroundColor
        
        healthBar.draw(ctx);
    }

    // Start the movement in a specific direction
    startMovement(direction) {
        const dirData = this.movement[direction];
        dirData.status = true;
        this.velocity[dirData.axis] = dirData.sign * this.speed;
        this.setAnimation(...dirData.moveFrames, dirData.repeat, dirData.duration);
    }

    // Stop the movement
    stopMovement(direction) {
        const dirData = this.movement[direction];
        dirData.status = false;
        this.velocity[dirData.axis] = 0;
        this.setAnimation(...dirData.idleFrames, dirData.repeat, dirData.duration);
    }

    // Take damage from the player
    takeDamage(amount, cooldown) {
        if (this.isInvulnerable) return;
    
        this.health -= amount; // Reduce health by the damage amount
        this.hit(); // Play the hit animation
        sfx.hit.play(); // Play the hit sound effect
    
        if (this.health <= 0) {
            this.die(); // Kill the enemy if health is 0 or less
        } else {
            this.isInvulnerable = true; // Make the enemy invulnerable for a short time
            setTimeout(() => {
                this.isInvulnerable = false;
            }, cooldown); // Cooldown period
        }
    }

    // Kill the enemy and drop a coin with experience value
    die() {
        // Get the position of the enemy
        let x = this.position.x + 1;
        let y = this.position.y;
        
        // Play the enemy die sound effect
        this.playDieSound();

        // Create a coin with the experience value of the enemy
        let expCoin = new Coin("yellow", 1, 1, x, y, "$");
        expCoin.xp_value = Math.floor(this.xp_reward * game.xpMultiplier); // Asigna el valor de experiencia del enemigo
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

        // Update the player statistics
        game.player.enemiesKilled++;
        game.player.outgoingDamage += this.maxHealth;
    }

    // Play the sound effect when the enemy dies
    // This function can be overridden to play a different sound
    playDieSound(){
        sfx.enemyDie.play(); // Play the enemy die sound effect
    }

    // Play the hit animation when the enemy is hit
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

// Normal enemy that follows the player
class NormalEnemy extends Enemy {
    constructor(_color, width, height, x, y, _type) {
        super("red", width, height, x, y, "enemy");

        // Properties
        this.health = 50;
        this.maxHealth = 50;
        this.damage = 20;
        this.xp_reward = 10;

        this.speed = 0.003;
        this.velocity = new Vec(this.speed, 0);
    }
}

// Heavy enemy that follows the player
class HeavyEnemy extends Enemy {
    constructor(_color, width, height, x, y, _type) {
        super("red", width, height, x, y, "enemy");

        // Properties
        this.health = 75;
        this.maxHealth = 75;
        this.damage = 25;
        this.xp_reward = 20;

        this.speed = 0.0005;
        this.velocity = new Vec(this.speed, 0);
    }
}

// Flying enemy that moves from side to side
class FlyingEnemy extends Enemy {
    constructor(_color, width, height, x, y, _type) {
        super("red", width, height, x, y, "enemy");
        this.isFacingRight = true; // Default direction is right

        // Properties
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

class TurtleEnemy extends Enemy {
    constructor(_color, width, height, x, y, _type) {
        super("red", width, height, x, y, "boss");
        this.isFacingRight = true; // Default direction is right


        // Properties
        this.health = 300;
        this.maxHealth = 300;
        this.damage = 30;
        this.xp_reward = 100;

        this.speed = 0.002;
        this.velocity = new Vec(this.speed, 0);

        this.state = "open"; // State of the turtle (open or closed)
        this.isShooting = false; // Flag to check if the turtle is shooting
        this.isImmortal = false; // Flag to check if the turtle is invulnerable

        this.hasClosedAnimationPlayed = false;
        this.hasOpenAnimationPlayed = false;

        // Hitbox properties
        this.offsetX = 1;
        this.offsetY = 1;
        this.hWidth = this.size.x + 2;
        this.hHeight = this.size.y + 3;

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
            closed: {
                status : false,
                repeat: true,
                duration : 200,
                left: [6, 6],
                right: [7, 7]
            }
        };
    }

    update(level, deltaTime) {
        this.setHitbox(this.offsetX, this.offsetY, this.hWidth, this.hHeight);
        this.velocity.y += gravity * deltaTime;
        
        if(this.state === "open") {
           this.open(level, deltaTime);
        } else if(this.state === "closed") {
            this.close();
        }
        

        this.updateFrame(deltaTime);
    }

    close(){
        this.isImmortal = true;

        if(!this.hasClosedAnimationPlayed){
            const closeData = this.movement.closed;
        
            if (this.isFacingRight) {
                this.setAnimation(...closeData.right, closeData.repeat, closeData.duration);
            } else {
                this.setAnimation(...closeData.left, closeData.repeat, closeData.duration);
            }

            this.hasClosedAnimationPlayed = true;
            this.hasOpenAnimationPlayed = false;
        }
        

        if(!this.isShooting){
            this.isShooting = true;
            let projectileRight = new Projectile("blue", 1.5, 1.5,
                this.position.x + this.size.x + 0.5, 
                this.position.y + this.size.y / 2,
                "projectile",
                "right");
    
            let projectileLeft = new Projectile("blue", 1.5, 1.5,
                this.position.x - this.size.x + 0.5, 
                this.position.y + this.size.y / 2,
                "projectile",
                "left");
            
            projectileRight.type = "enemy"; // Set the type of the projectile
            projectileRight.setSprite('../../assets/objects/lapiz2.png', new Rect(0, 0, 28, 28));
            projectileRight.speed = 0.005;
            projectileRight.velocity = new Vec(projectileRight.speed, 0);
    
            projectileLeft.type = "enemy";
            projectileLeft.setSprite('../../assets/objects/lapiz2.png', new Rect(0, 0, 28, 28));
            projectileLeft.speed = 0.005;
            projectileLeft.velocity = new Vec(-projectileLeft.speed, 0);
    
            game.addProjectile(projectileRight);
            game.addProjectile(projectileLeft);
    
            // Cooldown for shooting
            setTimeout(() => {
                this.isShooting = false;
            }, 1000);
        }

        setTimeout(() => {
            this.state = "open"; // Change state to open
        }
        , 5000); // Change state every 5 seconds
    }

    open(level, deltaTime){
        this.isImmortal = false; // Make the turtle vulnerable again
        if(!this.hasOpenAnimationPlayed){
            this.hasOpenAnimationPlayed = true;
            this.hasClosedAnimationPlayed = false;
        }

        this.moveHorizontally(level, deltaTime);
        this.followPlayer(level, deltaTime);
        this.moveVertically(level, deltaTime);

        setTimeout(() => {
            this.state = "closed"; // Change state to open
        }
        , 5000); // Change state every 5 seconds
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
            if(this.state === "open"){        
                this.startMovement(this.isFacingRight ? "right" : "left");
            }
        }, hitData.duration * 2); // 2 times the duration of the hit animation
    }
    
    takeDamage(amount, cooldown) {
        if (this.isInvulnerable || this.isImmortal) return;
        
        this.health -= amount; // Reduce health by the damage amount
        this.hit();
        sfx.hit.play(); // Play the hit sound effect
    
        if (this.health <= 0) {
            this.die(); // Kill the enemy if health is 0 or less
        } else {
            this.isInvulnerable = true; // Make the enemy invulnerable for a short time
            setTimeout(() => {
                this.isInvulnerable = false;
            }, cooldown); // Cooldown period
        }
    }

    playDieSound(){
        sfx.bossDie.play();
    }
}

// Sword tron 
class SwordEnemy extends Enemy {
    constructor(_color, width, height, x, y, _type) {
        super("red", width, height, x, y, "boss");

        // Properties
        this.health = 300;
        this.maxHealth = 300;
        this.damage = 10;
        this.xp_reward = 500;

        this.speed = 0.003;
        this.velocity = new Vec(this.speed, 0);

        this.isDashing = false;
        this.canDash = false; // Flag to check if the enemy can dash



        this.hasDashAnimationPlayed = false;

        // Hitbox properties
        this.offsetX = 1;
        this.offsetY = 1;
        this.hWidth = this.size.x + 2;
        this.hHeight = this.size.y + 3;

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
            dash: {
                status : false,
                repeat: true,
                duration : 200,
                left: [6, 6],
                right: [7, 7]
            }
        };

        setTimeout(() => {
            this.canDash = true; // Allow the enemy to dash after 5 seconds
        }
        , 5000); // 5 seconds

    }

    update(level, deltaTime) {
        this.setHitbox(this.offsetX, this.offsetY, this.hWidth, this.hHeight);
        this.velocity.y += gravity * deltaTime;

        if(this.canDash &&!this.isDashing) {
            this.isDashing = true; // Set the dashing flag
            this.canDash = false;
            this.dash(level, deltaTime); // Call the dash function
        } else {
            this.moveHorizontally(level, deltaTime);
            this.followPlayer(level, deltaTime);
            this.moveVertically(level, deltaTime);
        }


        this.updateFrame(deltaTime);
    }
    
    dash(level, deltaTime) {
        let dashDistance = 15;
        let dashSpeed = 0.05;
        let moved = 0;
        let step = dashSpeed * deltaTime;

        let dashData = this.movement.dash;
        if(!this.hasDashAnimationPlayed){
            if (this.isFacingRight) {
                this.setAnimation(...dashData.right, dashData.repeat, dashData.duration);
            } else {
                this.setAnimation(...dashData.left, dashData.repeat, dashData.duration);
            }
            console.log("direction", this.isFacingRight);

            this.hasDashAnimationPlayed = true;
        }
        
    
        let dashMove = () => {
            
            
            if (moved < dashDistance) {
                let direction = this.isFacingRight ? 1 : -1;
                let newXPosition = this.position.plus(new Vec(direction * step, 0));
    
                if (level.contact(newXPosition, this.size, 'wall') || 
                    level.contact(newXPosition, this.size, 'box')) {
                    this.isDashing = false; // Stop dashing if a wall or box is hit
                    return;
                }
    
                this.position = newXPosition;
                moved += step;

                requestAnimationFrame(dashMove);
            }
        };
    
        sfx.dash.play();
        dashMove();

    
        setTimeout(() => {
            this.isDashing = false; // Reset the dashing flag after the dash duration
        }, 500);
    
        setTimeout(() => {
            this.canDash = true;
            this.hasDashAnimationPlayed = false; // Reset the dash animation flag
             // Start the dash movement
        }, 5000);
    }
    
    playDieSound(){
        sfx.bossDie.play();
    }
}


// Boss enemy that follows the player and jumps when health is low
class BossEnemy extends Enemy {
    constructor(_color, width, height, x, y, _type) {
        super("red", width, height, x, y, "boss");

        // Properties
        this.health = 300;
        this.maxHealth = 300;
        this.damage = 30;
        this.xp_reward = 500;

        this.speed = 0.003;
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

    // Play the boss die sound effect
    playDieSound(){
        sfx.bossDie.play();
    }
}