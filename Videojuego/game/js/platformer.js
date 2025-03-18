/*
 * Implementation of the game
 */

"use strict";

// Global variables
const canvasWidth = 800;
const canvasHeight = 600;

// Context for the display canvas
let ctx;

// The time at the previous frame
let frameStart;

// Variables for the game
let game;
let player;
let enemy;
let level;

// Scale of the whole world, to be applied to all objects
// Each unit in the level file will be drawn as these many square pixels
const scale = 32;
const levelWidth = Math.floor(canvasWidth / scale);
const levelHeight = Math.floor(canvasHeight / scale);

// The project works only with very small values for velocities and acceleration
const walkSpeed = 0.01;
const initialJumpSpeed = -0.03;
const gravity = 0.0000981;

// let debugJump = false;

// Class that represents a player of the game
class Player extends AnimatedObject {
    constructor(_color, width, height, x, y, _type) {
        super("green", width, height, x, y, "player");
        this.velocity = new Vec(0.0, 0.0);
        this.money = 0;

        // Player state variables
        this.isFacingRight = true;
        this.isJumping = false;
        this.isCrouching = false;
        this.isAttacking = false;
        this.isHit = false;
        this.hasUsedPotion = false; // Track if the health potion has been used

        // Player properties
        this.health = 100;
        this.maxHealth = 100;
        this.damage = 20;
        this.resistance = 0;
        this.xp = 0;
        this.xpToNextLevel = 100;
        this.level = 0;
        this.attackCooldown = 400;

        // Track if the health potion has been used
        this.hasUsedPotion = false;

        // Movement variables to define directions and animations
        this.movement = {
            right:  { status: false,
                      axis: "x",
                      sign: 1,
                      repeat: true,
                      duration: 100,
                      moveFrames: [2, 3],
                      idleFrames: [0, 1] },
            left:   { status: false,
                      axis: "x",
                      sign: -1,
                      repeat: true,
                      duration: 100,
                      moveFrames: [13, 14],
                      idleFrames: [11, 12] },
            jump:   { status: false,
                      repeat: true,
                      duration: 100,
                      right: [4, 5],
                      left: [15, 16] },
            crouch: { status: false,
                      repeat: true,
                      duration: 100,
                      right: [6, 7],
                      left: [17, 18],
                      upRight: [0, 1],
                      upLeft: [11, 12] },
            attack: { status: false,
                        repeat: false,
                        duration: 20,
                        right: [0, 1],
                        left: [2, 3] },
            hit:    { status: false,
                        repeat: false,
                        duration: 50,
                        right: [10, 10],
                        left: [21, 21] }
        };
    }

    update(level, deltaTime) {

        // Make the character fall constantly because of gravity
        this.velocity.y = this.velocity.y + gravity * deltaTime;

        // New variables for the velocity of the player
        let velX = this.velocity.x;
        let velY = this.velocity.y;

        // Find out where the player should end if it moves
        let newXPosition = this.position.plus(new Vec(velX * deltaTime, 0)); // d = v * t
        // Move only if the player does not move inside a wall
        if (!level.contact(newXPosition, this.size, 'wall')) {
            this.position = newXPosition;
        }

        // Find out where the player should end if it moves
        let newYPosition = this.position.plus(new Vec(0, velY * deltaTime)); // d = v * t
        // Move only if the player does not move inside a wall
        if (!level.contact(newYPosition, this.size, 'wall')) {
            this.position = newYPosition;
        } else {
            this.land(); 
        }

        this.updateFrame(deltaTime);
    }

    // Start moving the player in a certain direction
    startMovement(direction) {
        const dirData = this.movement[direction];
        this.isFacingRight = direction == "right"; // Check if the direction is right
        if (!dirData.status) { // If the player is not already moving
            dirData.status = true;
            this.velocity[dirData.axis] = dirData.sign * walkSpeed; // Set the velocity

            if (this.isHit) { // If the player is hit, keep the hit animation
                this.hit();
            }
            else if (this.isCrouching) { // If the player is crouching, keep crouching
                this.crouch();
            }
            else {
                this.setAnimation(...dirData.moveFrames, dirData.repeat, dirData.duration);
            }
        }
    }

    stopMovement(direction) {
        const dirData = this.movement[direction];
        dirData.status = false;
        this.velocity[dirData.axis] = 0;
        this.setAnimation(...dirData.idleFrames, dirData.repeat, 100);
    }

    crouch() {
        this.isCrouching = true;
        const crouchData = this.movement.crouch;
        if (this.isFacingRight) {
            this.setAnimation(...crouchData.right, crouchData.repeat, crouchData.duration);
        } else {
            this.setAnimation(...crouchData.left, crouchData.repeat, crouchData.duration);
        }
    }

    standUp () {
        this.isCrouching = false;
        const crouchData = this.movement.crouch;
        if (this.isFacingRight) {
            this.setAnimation(...crouchData.upRight, crouchData.repeat, crouchData.duration);
        } else {
            this.setAnimation(...crouchData.upLeft, crouchData.repeat, crouchData.duration);
        }
    }

    jump() {
        if (!this.isJumping) {
            // Give a velocity so that the player starts moving up
            this.velocity.y = initialJumpSpeed;
            this.isJumping = true;
            const jumpData = this.movement.jump;
            if (this.isFacingRight) {
                this.setAnimation(...jumpData.right, jumpData.repeat, jumpData.duration);
            } else {
                this.setAnimation(...jumpData.left, jumpData.repeat, jumpData.duration);
            }
            //debugJump = true;
        }
    }

    land() {
        // If the character is touching the ground,
        // there is no vertical velocity
        this.velocity.y = 0;
        // Force the player to move down to touch the floor
        this.position.y = Math.ceil(this.position.y);
        if (this.isJumping) {
            // Reset the jump variable
            this.isJumping = false;
            const leftData = this.movement["left"];
            const rightData = this.movement["right"];
            // Continue the running animation if the player is moving
            if (leftData.status) {
                this.setAnimation(...leftData.moveFrames, leftData.repeat, leftData.duration);
            } else if (rightData.status) {
                this.setAnimation(...rightData.moveFrames, rightData.repeat, rightData.duration);
            // Otherwise switch to the idle animation
            } else {
                if (this.isFacingRight) {
                    this.setAnimation(...rightData.idleFrames, rightData.repeat, rightData.duration);
                } else {
                    this.setAnimation(...leftData.idleFrames, leftData.repeat, leftData.duration);
                }
            }
        }
    }

    attack() {
        if (this.isAttacking) return;

        this.isAttacking = true;
        const attackData = this.movement.attack;
        let originalSize = this.size.x;

        // Change to the attack sprite and rect
        this.setSprite('../../assets/characters/skippy/skippy_attack_1.png', new Rect(0, 0, 32, 24));
        this.size.x = 4; // Adjust the size to match the new sprite

        if (this.isFacingRight) {
            this.setAnimation(...attackData.right, attackData.repeat, attackData.duration);
        } else {
            this.setAnimation(...attackData.left, attackData.repeat, attackData.duration);
        }

        setTimeout(() => {
            this.isAttacking = false;
            this.size.x = originalSize; // Adjust the size to match the new sprite
            // Restore the original sprite and rect
            this.setSprite('../../assets/characters/skippy/skippy_1.png', new Rect(0, 0, 24, 24));
        }, this.attackCooldown);
    }

    takeDamage(amount) {
        if (this.isInvulnerable) return;

        this.health -= amount * (1 - this.resistance);
        this.hit();

        if (this.health <= 0) {
            this.die();
        } else {
            this.isInvulnerable = true;
            setTimeout(() => {
                this.isInvulnerable = false;
            }, 1000); // Cooldown period of 1 second
        }
    }

    gainXp(amount) {
        this.xp += amount;
        if (this.xp >= this.xpToNextLevel) {
            this.level++;
            this.xp = 0;
            this.xpToNextLevel += 15;
        }
    }

    die() {
        console.log("Player died");
        restartGame();
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
        }, hitData.duration);
    }

    useHealthPotion() {
        if (!this.hasUsedPotion && this.health < 100) {

            let increase = (this.maxHealth * 50) / 100; // Calculate 50% of the max health

            this.health += increase; // Increase health
            if (this.health > 100) {
                this.health = 100; // Cap health at 100
            }
            this.hasUsedPotion = true; // Mark the potion as used
            game.potionImage.src = '../assets/sprites/potion_empty.png'; // Change the sprite to the empty potion
        }
    }
}

class Enemy extends AnimatedObject {
    constructor(_color, width, height, x, y, _type) {
        super("red", width, height, x, y, "enemy");
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
                moveFrames: [0, 1],
                idleFrames: [0, 1]
            },
            left: {
                status: false,
                axis: "x",
                sign: -1,
                repeat: true,
                duration: 100,
                moveFrames: [3, 4],
                idleFrames: [3, 4]
            },
            hit: { 
                status: false,
                repeat: true,
                duration: 200,
                right: [5, 5],
                left: [2, 2]
            },
        };
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

    update(level, deltaTime) {
        // Make the character fall constantly because of gravity
        this.velocity.y = this.velocity.y + gravity * deltaTime;
    
        let velX = this.velocity.x;
        let velY = this.velocity.y;
    
        // Adjust horizontal velocity to follow the player
        if (level.player.position.x > this.position.x) {
            if (!this.isFacingRight) {
                this.isFacingRight = true;
                this.startMovement("left");
            }
            this.velocity.x = Math.abs(this.speed); // Move right
        } else {
            if (this.isFacingRight) {
                this.isFacingRight = false;
                this.startMovement("right");
            }
            this.velocity.x = -Math.abs(this.speed); // Move left
        }
    
        // Find out where the enemy should end if it moves horizontally
        let newXPosition = this.position.plus(new Vec(velX * deltaTime, 0));
        // Move only if the enemy does not move inside a wall
        if (!level.contact(newXPosition, this.size, 'wall')) {
            this.position = newXPosition;
        }
    
        // Find out where the enemy should end if it moves vertically
        let newYPosition = this.position.plus(new Vec(0, velY * deltaTime));
        // Move only if the enemy does not move inside a wall
        if (!level.contact(newYPosition, this.size, 'wall')) {
            this.position = newYPosition;
        } else {
            this.velocity.y = 0; // Stop vertical movement on collision
        }
    
        this.updateFrame(deltaTime);
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
        // Eliminate the enemy from the actor list
        game.actors = game.actors.filter(actor => actor !== this);
        
        // Eliminate the enemies from the level. The player is supposed to kill every enemy to pass each level.
        GAME_LEVELS[game.levelNumber] = GAME_LEVELS[game.levelNumber].replace('N', '.');
        GAME_LEVELS[game.levelNumber] = GAME_LEVELS[game.levelNumber].replace('H', '.');
        GAME_LEVELS[game.levelNumber] = GAME_LEVELS[game.levelNumber].replace('F', '.');
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
        }, hitData.duration);
    }
}

class NormalEnemy extends Enemy {
    constructor(_color, width, height, x, y, _type) {
        super("red", width, height, x, y, "N");

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
        super("red", width, height, x, y, "H");

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
        super("red", width, height, x, y, "F");

        this.health = 25;
        this.maxHealth = 25;
        this.damage = 10;
        this.xp_reward = 15;

        this.speed = 0.002;
        this.velocity = new Vec(this.speed, 0);

        // Define movement directions for flying enemies
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
            }
        };
    }

    update(level, deltaTime) {

        let velX = this.velocity.x;

        // Reverse direction if the enemy hits a wall
        let newXPosition = this.position.plus(new Vec(velX * deltaTime, 0));
        if (level.contact(newXPosition, this.size, 'wall')) {
            this.velocity.x = -this.velocity.x; // Reverse direction
            this.startMovement(this.velocity.x > 0 ? "right" : "left"); // Update animation direction
        } else {
            this.position = newXPosition;
        }

        this.updateFrame(deltaTime);
    }
}

class Coin extends GameObject {
    constructor(_color, width, height, x, y, _type) {
        super("yellow", width, height, x, y, "coin");
    }
}

class Level {
    constructor(plan) {
        // Split the plan string into a matrix of strings
        let rows = plan.trim().split('\n').map(l => [...l]);
        this.height = rows.length;
        this.width = rows[0].length;
        this.actors = [];

        // Variable to randomize environments
        let rnd = Math.random();

        // Fill the rows array with a label for the type of element in the cell
        // Most cells are 'empty', except for the 'wall'
        this.rows = rows.map((row, y) => {
            return row.map((ch, x) => {
                let item = levelChars[ch];
                let objClass = item.objClass;
                let cellType = item.label;
                // Create a new instance of the type specified
                let actor = new objClass("#DCE1E7", 1, 1, x, y, item.label);
                // Configurations for each type of cell
                // TODO: Simplify this code, sinde most of it is repeated
                if (actor.type == "player") {
                    // Also instantiate a floor tile below the player
                    this.addBackgroundFloor(x, y);

                    // Make the player larger
                    actor.position = actor.position.plus(new Vec(0, -3));
                    actor.size = new Vec(3, 3);

                    actor.setSprite(item.sprite, item.rect);
                    actor.sheetCols = item.sheetCols;

                    const dirData = actor.movement["right"];
                    actor.setAnimation(...dirData.idleFrames, dirData.repeat, dirData.duration);

                    this.player = actor;
                    cellType = "empty";
                } else if (actor.type == "coin") {
                    // Also instantiate a floor tile below the player
                    this.addBackgroundFloor(x, y);

                    actor.setSprite(item.sprite, item.rect);
                    this.actors.push(actor);
                    cellType = "empty";
                } else if (actor.type == "enemy") {
                    // Make the enemy larger
                    this.addBackgroundFloor(x, y);
                    actor.position = actor.position.plus(new Vec(0, -3));
                    actor.size = new Vec(3, 3);

                    actor.setSprite(item.sprite, item.rect);
                    actor.sheetCols = item.sheetCols;

                    const dirData = actor.movement["right"];
                    actor.setAnimation(...dirData.moveFrames, dirData.repeat, dirData.duration);

                    this.actors.push(actor);
                    cellType = "empty";
                } else if (actor.type == "wall") {
                    // Randomize sprites for each wall tile
                    // item.rect = this.randomEvironment(rnd);
                    actor.setSprite(item.sprite, item.rect);
                    this.actors.push(actor);
                    cellType = "wall";
                } else if (actor.type == "floor") {
                    //actor.setSprite(item.sprite, item.rect);
                    this.actors.push(actor);
                    cellType = "floor";
                } else if (actor.type == "door") {
                    //actor.setSprite(item.sprite, item.rect);
                    this.actors.push(actor);
                    cellType = "door";
                } else if (actor.type == "box") {
                    this.addBackgroundFloor(x, y);
                    actor.position = actor.position.plus(new Vec(0, -2));
                    actor.size = new Vec(3, 3);

                    actor.setSprite(item.sprite, item.rect);
                    this.actors.push(actor);
                    cellType = "box";
                } else if (actor.type == "ladder") {
                    actor.setSprite(item.sprite, item.rect);
                    this.actors.push(actor);
                    cellType = "empty";
                }
                return cellType;
            });
        });
    }

    addBackgroundFloor(x, y) {
        let floor = levelChars['.'];
        let floorActor = new GameObject("#DCE1E7", 1, 1, x, y, floor.label);
        //floorActor.setSprite(floor.sprite, floor.rect);
        this.actors.push(floorActor);
    }

    // Randomize sprites for each wall tile
    randomTile(xStart, xRange, y) {
        let tile = Math.floor(Math.random() * xRange + xStart);
        return new Rect(tile, y, 32, 32);
    }

    randomEvironment(rnd) {
        let rect;
        if (rnd < 0.33) {
            rect = this.randomTile(1, 10, 6);    // yellow marble
        } else if (rnd < 0.66) {
            rect = this.randomTile(1, 12, 16);     // green marble with carvings
        } else {
            rect = this.randomTile(21, 12, 16);  // brown and yellow pebbles
        }
        return rect;
    }

    // Detect when the player touches a wall
    contact(playerPos, playerSize, type) {
        // Determine which cells the player is occupying
        let xStart = Math.floor(playerPos.x);
        let xEnd = Math.ceil(playerPos.x + playerSize.x);
        let yStart = Math.floor(playerPos.y);
        let yEnd = Math.ceil(playerPos.y + playerSize.y);

        // Check each of those cells
        for (let y=yStart; y<yEnd; y++) {
            for (let x=xStart; x<xEnd; x++) {
                // Anything outside of the bounds of the canvas is considered
                // to be a wall, so it blocks the player's movement
                let isOutside = x < 0 || x >= this.width ||
                                y < 0 || y >= this.height;
                let here = isOutside ? 'wall' : this.rows[y][x];
                // Detect if an object of type specified is being touched
                if (here == type) {
                    return true;
                }
            }
        }
        return false;
    }
}


class Game {
    constructor(state, level) {
        this.state = state;
        this.level = level;
        this.levelNumber = 0;
        this.player = level.player;
        this.enemy = level.enemy;
        this.actors = level.actors;
        this.paused = false; // Game starts unpaused

        this.labelMoney = new TextLabel(20, canvasHeight - 30,
                                        "30px Ubuntu Mono", "white");

        this.labelDebug = new TextLabel(20, canvasHeight - 60,
                                        "20px Ubuntu Mono", "white");

        this.labelLife = new TextLabel(canvasWidth - 120, canvasHeight - 50, "20px Ubuntu Mono", "white");

        this.labelLevel = new TextLabel(canvasWidth - 120, canvasHeight - 20, "20px Ubuntu Mono", "white");

        // Health bar for the player
        this.playerHealthBar = (ctx, scale) => {
            const barWidth = 260; // Width of the health bar
            const barHeight = 10; // Height of the health bar
            const x = canvasWidth / 2; // X position of the health bar
            const y = canvasHeight - 60; // Y position (above the player)

            // Calculate the width of the health portion
            const healthWidth = (this.player.health / 100) * barWidth;

            // Draw the background (red bar)
            ctx.fillStyle = "black";

            ctx.fillRect(x, y, barWidth, barHeight);

            // Draw the foreground (green bar)
            ctx.fillStyle = "lightgreen";

            ctx.fillRect(x, y, healthWidth, barHeight);

            // Draw a border around the health bar
            ctx.strokeStyle = "black";
            // Make the border bigger
            ctx.lineWidth = 3;
            ctx.strokeRect(x, y, barWidth, barHeight);
        };

        // Load the health potion image
        this.potionImage = new Image();
        this.potionImage.src = '../assets/sprites/potion_full.png'; // Load the full potion sprite

        // Method to draw the health potion
        this.drawHealthPotion = (ctx) => {
            const potionX = (canvasWidth / 2) - 70; // Posición X de la poción (al lado de la barra de vida)
            const potionY = canvasHeight - 70; // Posición Y de la poción (alineada con la barra de vida)
            const potionWidth = 60; // Ancho del sprite de la poción
            const potionHeight = 60; // Alto del sprite de la poción
            ctx.drawImage(this.potionImage, potionX, potionY, potionWidth, potionHeight);
        };

        // Experience bar for the player
        this.playerXpBar = (ctx, scale) => {
            const barWidth = 260; // Width of the health bar
            const barHeight = 10; // Height of the health bar
            const x = canvasWidth / 2; // X position of the health bar
            const y = canvasHeight - 30; // Y position (above the player)

            // Calculate the width of the health portion
            const xpWidth = (this.player.xp / this.player.xpToNextLevel) * barWidth;

            // Draw the background (red bar)
            ctx.fillStyle = "black";

            ctx.fillRect(x, y, barWidth, barHeight);

            // Draw the foreground (green bar)
            ctx.fillStyle = "yellow";

            ctx.fillRect(x, y, xpWidth, barHeight);

            // Draw a border around the health bar
            ctx.strokeStyle = "black";
            // Make the border bigger
            ctx.lineWidth = 3;
            ctx.strokeRect(x, y, barWidth, barHeight);
        };

        console.log(`############ LEVEL ${level} START ###################`);
    }

    update(deltaTime) {
        this.player.update(this.level, deltaTime);

        for (let actor of this.actors) {
            actor.update(this.level, deltaTime);
        }

        // A copy of the full list to iterate over all of them
        // DOES THIS WORK?
        let currentActors = this.actors;
        // Detect collisions
        for (let actor of currentActors) {
            if (actor.type != 'floor' && overlapRectangles(this.player, actor)) {
                //console.log(`Collision of ${this.player.type} with ${actor.type}`);
                if (actor.type == 'wall') {
                    //console.log("Hit a wall");
                } else if (actor.type == 'coin') {
                    this.player.gainXp(5); // Gain 5 experience points
                    GAME_LEVELS[this.levelNumber] = GAME_LEVELS[this.levelNumber].replace('$', '.'); // Remove the coin from the level
                    this.actors = this.actors.filter(item => item !== actor); // Remove the coin from the actors list
                } else if (actor.type == 'enemy') {
                    // Check if the player is attacking
                    if (this.player.isAttacking) { // If the player is attacking, deal damage to the enemy
                        actor.takeDamage(this.player.damage, this.player.attackCooldown);
                        if (actor.health <= 0) {
                            this.player.gainXp(actor.xp_reward);
                        }
                    }
                    else { // If the player is not attacking, the enemy deals damage to the player
                        this.player.takeDamage(actor.damage);
                    }
                } else if (actor.type == 'door') {
                    
                    if (this.player.position.x > actor.position.x) { // If the door is on the left

                        this.level = new Level(GAME_LEVELS[--this.levelNumber]);
                        this.level.player = this.player; // Keep the player in the new level
                        this.player.position = new Vec(levelWidth - this.player.size.x - 2, 12); // Set the player at the left of the door

                    } else if (this.player.position.x < actor.position.x) { // If the door is on the right

                        this.level = new Level(GAME_LEVELS[++this.levelNumber]);
                        this.level.player = this.player; // Keep the player in the new level
                        this.player.position = new Vec(1, 12); // Set the player at the right of the door
                    }
                    // Update the actors list
                    this.actors = this.level.actors;
                }

            }
        }
    }

    draw(ctx, scale) {
        // First draw the background tiles
        for (let actor of this.actors) {
            if (actor.type === 'floor' || actor.type === 'wall') {
                actor.draw(ctx, scale);
            }
        }
    
        // Then draw the rest of the actors
        for (let actor of this.actors) {
            if (actor.type !== 'floor' && actor.type !== 'wall') {
                actor.draw(ctx, scale);

                // Draw health bar for enemies
                if (actor.type === 'enemy') {
                    actor.drawHealthBar(ctx, scale);
                }
            }
        }
        
        // Draw the player on top of everything else
        this.player.draw(ctx, scale);

        // Draw the labels
        this.labelMoney.draw(ctx, `Money: ${this.player.money}`);
        this.labelDebug.draw(ctx, `Velocity: ( ${this.player.velocity.x.toFixed(3)}, ${this.player.velocity.y.toFixed(3)} )`);
        this.labelLife.draw(ctx, `Health: ${this.player.health}`);
        this.labelLevel.draw(ctx, `Lvl. ${this.player.level}`);

        // Draw the player's health bar
        this.playerHealthBar(ctx, scale);

        // Draw the player's experience bar
        this.playerXpBar(ctx, scale);

        // Draw the health potion
        this.drawHealthPotion(ctx);
    }

    // Pause or resume the game
    togglePause() {
        this.paused = !this.paused;
        console.log(this.paused ? "Game paused" : "Game resumed");
    }

    // Increase the stats of the enemies depending on the level of the game
    adjustDificulty() {

        // Vairable to increase the stats of the enemies
        let increase = 0;

        // Increase the stats of the enemies depending on the level of the game
        if (this.levelNumber == 1) {
            increase = 10;
        }
        else if (this.levelNumber == 2) {
            increase = 20;
        }

        // Increase the stats of the enemies
        for (let actor of this.level.actors) {
            if (actor.type === 'enemy') {
                actor.maxHealth += increase;
                actor.health += increase;
                actor.damage += increase;
            }
        }

        console.log("Difficulty increased by " + increase);
    }
}

// Object with the characters that appear in the level description strings
// and their corresponding objects
const levelChars = {
    // Rect defined as offset from the first tile, and size of the tiles
    ".": {objClass: GameObject,
          label: "floor",
          sprite: '../assets/sprites/ProjectUtumno_full.png',
          rect: new Rect(12, 17, 32, 32)},
    "#": {objClass: GameObject,
          label: "wall",
          sprite: '../../assets/blocks/marble_packed.png',
          rect: new Rect(0, 0, 18, 18)},
    "@": {objClass: Player,
          label: "player",
          sprite: '../../assets/characters/skippy/skippy_1.png',
          rect: new Rect(0, 0, 24, 24), // Size of each frame
          sheetCols: 22,
          startFrame: [0, 0]},
    "N": {objClass: NormalEnemy,
          label: "enemy",
          sprite: '../../assets/characters/enemies/robot_normal.png',
          rect: new Rect(0, 0, 24, 24),
          sheetCols: 6,
          startFrame: [0, 0]},
    "H": {objClass: HeavyEnemy,
          label: "enemy",
          sprite: '../../assets/characters/enemies/robot_heavy.png',
          rect: new Rect(0, 0, 24, 24),
          sheetCols: 6,
          startFrame: [0, 0]},
    "F": {objClass: FlyingEnemy,
          label: "enemy",
          sprite: '../../assets/characters/enemies/robot_fly.png',
          rect: new Rect(0, 0, 24, 24),
          sheetCols: 6,
          startFrame: [0, 0]},
    "$": {objClass: Coin,
          label: "collectible",
          sprite: '../../assets/objects/xp_orb.png',
          rect: new Rect(0, 0, 32, 32),
          sheetCols: 8,
          startFrame: [0, 7]},
    "D": {objClass: GameObject,
          label: "door",
          sprite: '../../assets/interactable/ladder_1.png',
          rect: new Rect(0, 0, 18, 18)},
    "B": {objClass: GameObject,
          label: "wall",
          sprite: '../../assets/obstacles/box_1.png',
          rect: new Rect(0, 0, 18, 18)},
    "L": {objClass: GameObject,
          label: "ladder",
          sprite: '../../assets/interactable/ladder_1.png',
          rect: new Rect(0, 0, 18, 18)}
};


function main() {
    // Set a callback for when the page is loaded,
    // so that the canvas can be found
    window.onload = init;
}

function init() {
    const canvas = document.getElementById('canvas');
    //const canvas = document.querySelector('canvas');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    ctx = canvas.getContext('2d');

    gameStart();
}

function gameStart() {
    // Register the game object, which creates all other objects
    game = new Game('playing', new Level(GAME_LEVELS[0]));

    setEventListeners();

    // Call the first frame with the current time
    updateCanvas(document.timeline.currentTime);
}

function restartGame() {
    // Reset the game state
    game = new Game('playing', new Level(GAME_LEVELS[0]));
    frameStart = undefined; // Reset the frame start time
    console.log("Game restarted!");
}

function setEventListeners() {
    window.addEventListener("keydown", event => {
        if (event.key == 'w') {
            game.player.jump();
        }
        if (event.key == 'a') {
            game.player.startMovement("left");
        }
        if (event.key == 'd') {
            game.player.startMovement("right");
        }
        if (event.key == 's') {
            game.player.crouch();
        }

        // Attack
        if (event.key == 'ArrowLeft') {
            game.player.isFacingRight = false;
            game.player.attack();
        }
        if (event.key == 'ArrowRight') {
            game.player.isFacingRight = true;
            game.player.attack();
        }

        // Pause the game
        if (event.key == 'p') {
            game.togglePause();
        }

        // Use health potion
        if (event.key == '3') {
            game.player.useHealthPotion();
        }
    });

    window.addEventListener("keyup", event => {
        if (event.key == 'a') {
            game.player.stopMovement("left");
        }
        if (event.key == 'd') {
            game.player.stopMovement("right");
        }
        if (event.key == 's') {
            game.player.standUp();
        }
    });
}

// Function that will be called for the game loop
function updateCanvas(frameTime) {
    if (frameStart === undefined) {
        frameStart = frameTime;
    }
    let deltaTime = frameTime - frameStart;
    
    if (!game.paused) { // Skip updates if the game is paused
        let deltaTime = frameTime - frameStart;

        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        game.update(deltaTime);
        game.draw(ctx, scale);

        frameStart = frameTime; // Update time for the next frame
    }

    // Update time for the next frame
    frameStart = frameTime;
    requestAnimationFrame(updateCanvas);
}

// Call the start function to initiate the game
main();
