// Implementation of the game

"use strict";

// Global variables
const canvasWidth = 800;
const canvasHeight = 600;

// Context of the canvas
let ctx;

// Variables for the game
let oldTime;

// Variables for the character
const speed = 0.5; // Movement speed
const gravity = 0.05; // Gravity force
const jumpForce = 2.0; // Jump force

// Animation frames for the player

// Idle frames
const playerIdleFrames = [
    new Image(),
    new Image(),
]
playerIdleFrames[0].src = "../assets/characters/skippy/skippy_idle_1.png";
playerIdleFrames[1].src = "../assets/characters/skippy/skippy_idle_2.png";

// Running frames
const playerRunningFrames = [
    new Image(),
    new Image(),
]
playerRunningFrames[0].src = "../assets/characters/skippy/skippy_walk_1.png";
playerRunningFrames[1].src = "../assets/characters/skippy/skippy_walk_2.png";

// Crouching frames
const playerCrouchingFrames = [
    new Image(),
    new Image(),
]
playerCrouchingFrames[0].src = "../assets/characters/skippy/skippy_crouch_1.png";
playerCrouchingFrames[1].src = "../assets/characters/skippy/skippy_crouch_2.png";

// Jumping frames
const playerJumpingFrames = [
    new Image(),
    new Image(),
]
playerJumpingFrames[0].src = "../assets/characters/skippy/skippy_jump_1.png";
playerJumpingFrames[1].src = "../assets/characters/skippy/skippy_jump_2.png";

// Melee frames
const playerMeleeFrames = [
    new Image(),
    new Image(),
]
playerMeleeFrames[0].src = "../assets/characters/skippy/skippy_attack_melee_1.png";
playerMeleeFrames[1].src = "../assets/characters/skippy/skippy_attack_melee_2.png";

// Animation frames for the enemy

// Enemy normal
const enemyNormalFrames = [
    new Image(),
    new Image(),
]
enemyNormalFrames[0].src = "../assets/characters/enemies/robot_normal_1.png";
enemyNormalFrames[1].src = "../assets/characters/enemies/robot_normal_2.png";

// Enemy heavy
const enemyHeavyFrames = [
    new Image(),
    new Image(),
]
enemyHeavyFrames[0].src = "../assets/characters/enemies/robot_heavy_1.png";
enemyHeavyFrames[1].src = "../assets/characters/enemies/robot_heavy_2.png";

// Enemy fly
const enemyFlyFrames = [
    new Image(),
    new Image(),
]
enemyFlyFrames[0].src = "../assets/characters/enemies/robot_fly_1.png";
enemyFlyFrames[1].src = "../assets/characters/enemies/robot_fly_2.png";

// Classes for the game

class Player extends BaseCharacter {
    constructor(position) {
        super(position, 100, 100, "blue", "Player", 100, 10, speed);

        // Player properties
        this.level = 0;
        this.experience = 0;
        this.expToNextLevel = 100;
        this.abilities = [];

        // Player animation properties
        this.currentImage = playerIdleFrames[0];
        this.animationFrame = 0;
        this.animationTimer = 0;

        // Player state properties
        this.isAttacking = false;
        this.isCrouching = false;
        this.canJump = true;

        // Player attack properties
        this.attackRange = 50;
        this.lastAttackTime = null;
        this.attackCooldown = 1000; // 1 second
    }

    gainExperience(amount) {
        this.experience += amount;
        if (this.experience >= this.expToNextLevel) {
            this.levelUp();
        }
    }

    levelUp() {
        this.level++;
        this.experience = 0;
        this.expToNextLevel += 15;
        console.log(`¡Subiste al nivel ${this.level}!`);
    }

    update(deltaTime) {
        super.update(deltaTime);

        // Check if the player is on the ground
        if (this.position.y + this.height >= canvasHeight) {
            this.velocity.y = 0;
            this.canJump = true;
        }

        this.controlAnimation(deltaTime);
    }

    controlAnimation(deltaTime) {
        // Control the idle animation
        if (this.velocity.x === 0 && this.velocity.y === 0) {
            this.animationTimer += deltaTime;
            if (this.animationTimer > 200) { // Change frame every 200 ms
                this.animationFrame = (this.animationFrame + 1) % 2;
                this.currentImage = playerIdleFrames[this.animationFrame];
                this.animationTimer = 0;
            }
        }

        // Control the running animation
        if (this.velocity.x !== 0) {
            this.animationTimer += deltaTime;
            if (this.animationTimer > 200) { // Change frame every 200 ms
                this.animationFrame = (this.animationFrame + 1) % 2;
                this.currentImage = playerRunningFrames[this.animationFrame];
                this.animationTimer = 0;
            }
        }

        // Control the crouching animation
        if (this.isCrouching) {
            this.currentImage = playerCrouchingFrames[0];
        }

        // Control the jumping animation
        if (this.velocity.y < 0) {
            this.currentImage = playerJumpingFrames[0];
        }

        // Control the melee attack animation
        if (this.isAttacking) {
            this.currentImage = playerMeleeFrames[1];
        }
    }
}

class Enemy extends BaseCharacter {
    constructor(position, width, height, color, type, health, damage, speed, expReward) {
        super(position, width, height, color, type, health, damage, speed);
        this.expReward = expReward;
    }

    die() {
        console.log(`${this.type} ha sido derrotado.`);
        return this.expReward;
    }

    update(deltaTime) {
        super.update(deltaTime);
    }

    moveToPlayer(player) {
        if (this.position.x < player.position.x) { // If the player is to the right, move right
            this.position.x += this.speed;
        }
        else if (this.position.x > player.position.x) { // If the player is to the left, move left
            this.position.x -= this.speed;
        }
    }

    moveHorizontally() {
        this.position.x += this.speed;
    }
}

class EnemyNormal extends Enemy {
    constructor(position) {
        super(position, 100, 100, "red", "EnemyNormal", 50, 20, 0.5, 10);

        // Enemy animation properties
        this.currentImage = enemyNormalFrames[0];
        this.animationFrame = 0;
        this.animationTimer = 0;
    }

    update(deltaTime) {
        super.update(deltaTime);

        // Move towards the player
        this.moveToPlayer(player);

        this.controlAnimation(deltaTime);
    }

    controlAnimation(deltaTime) {
        // Control the idle animation
        this.animationTimer += deltaTime;
        if (this.animationTimer > 200) { // Change frame every 200 ms
            this.animationFrame = (this.animationFrame + 1) % 2;
            this.currentImage = enemyNormalFrames[this.animationFrame];
            this.animationTimer = 0;
        }
    }

    draw(ctx) {
        ctx.save();
        if (this.position.x < player.position.x) {
            ctx.scale(-1, 1);
            ctx.drawImage(this.currentImage, -this.position.x - this.width, this.position.y, this.width, this.height);
        } else {
            ctx.drawImage(this.currentImage, this.position.x, this.position.y, this.width, this.height);
        }
        ctx.restore();
    }
}

class EnemyHeavy extends Enemy {
    constructor(position) {
        super(position, 100, 100, "darkred", "EnemyHeavy", 75, 40, 0.1, 20);

        // Enemy animation properties
        this.currentImage = enemyHeavyFrames[0];
        this.animationFrame = 0;
        this.animationTimer = 0;
    }

    update(deltaTime) {
        super.update(deltaTime);

        // Move towards the player
        this.moveToPlayer(player);

        this.controlAnimation(deltaTime);
    }

    controlAnimation(deltaTime) {
        // Control the idle animation
        this.animationTimer += deltaTime;
        if (this.animationTimer > 200) { // Change frame every 200 ms
            this.animationFrame = (this.animationFrame + 1) % 2;
            this.currentImage = enemyHeavyFrames[this.animationFrame];
            this.animationTimer = 0;
        }
    }

    draw(ctx) {
        ctx.save();
        if (this.position.x < player.position.x) {
            ctx.scale(-1, 1);
            ctx.drawImage(this.currentImage, -this.position.x - this.width, this.position.y, this.width, this.height);
        } else {
            ctx.drawImage(this.currentImage, this.position.x, this.position.y, this.width, this.height);
        }
        ctx.restore();
    }
}

class EnemyFly extends Enemy {
    constructor(position) {
        super(position, 100, 100, "brown", "EnemyAerial", 25, 10, 3, 15);

        // Enemy animation properties
        this.currentImage = enemyFlyFrames[0];
        this.animationFrame = 0;
        this.animationTimer = 0;
    }

    update(deltaTime) {
        super.update(deltaTime);

        // Moves from left to right
        this.moveHorizontally();

        // Unapply gravity
        this.velocity.y = 0;

        this.controlAnimation(deltaTime);
    }

    controlAnimation(deltaTime) {
        // Control the idle animation
        this.animationTimer += deltaTime;
        if (this.animationTimer > 200) { // Change frame every 200 ms
            this.animationFrame = (this.animationFrame + 1) % 2;
            this.currentImage = enemyFlyFrames[this.animationFrame];
            this.animationTimer = 0;
        }
    }

    draw(ctx) {
        ctx.save();
        if (this.position.x < player.position.x) {
            ctx.scale(-1, 1);
            ctx.drawImage(this.currentImage, -this.position.x - this.width, this.position.y, this.width, this.height);
        } else {
            ctx.drawImage(this.currentImage, this.position.x, this.position.y, this.width, this.height);
        }
        ctx.restore();
    }
}

/*

class ObstacleBox extends GameObject {
    constructor(position) {
        super(position, 50, 50, "black", "Obstacle");
    }
}

class ObstaclePipe extends GameObject {
    constructor(position) {
        super(position, 50, 100, "black", "Obstacle");
    }
}

class ObstacleSpike extends GameObject {
    constructor(position) {
        super(position, 10, 10, "black", "Obstacle");
    }
}

class ObstacleGate extends GameObject {
    constructor(position) {
        super(position, 50, 50, "black", "Obstacle");
        this.opened = false;
    }

    open() {
        this.opened = true;
        this.color = "gray";
    }
}

class InteractableButton extends GameObject {
    constructor(position, gate) {
        super(position, 50, 50, "blue", "Button");
        this.gate = gate;
    }

    press() {
        this.gate.open();
        this.color = "lightblue";
    }
}

class Ladder extends GameObject {
    constructor(position) {
        super(position, 50, 50, "brown", "Ladder");
    }
}

*/

// Objects for the game

const player = new Player(new Vec(100, canvasHeight));
const enemyNormal = new EnemyNormal(new Vec(canvasWidth - 200, canvasHeight));
const enemyHeavy = new EnemyHeavy(new Vec(canvasWidth - 100, canvasHeight));
const enemyFly = new EnemyFly(new Vec(canvasWidth - 50, canvasHeight / 4));

// Main function

function main() {
    // Get a reference to the object with id 'canvas' in the page
    const canvas = document.getElementById('canvas');
    // Resize the element
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    // Get the context for drawing in 2D
    ctx = canvas.getContext('2d');

    createEventListeners();

    drawScene(0);
}

// Function to add listeners to the keyboard events

function createEventListeners() {
    window.addEventListener("keydown", (event) => {
        if (event.key === "w" && player.canJump) {
            player.velocity.y = -jumpForce;
            player.canJump = false;
        }
        if (event.key === "s" && !player.isCrouching) {
            player.isCrouching = true;
            player.position.y += player.height / 2;
            player.height = player.height / 2;
        }
        if (event.key === "a") {
            player.velocity.x = -speed;
        }
        if (event.key === "d") {
            player.velocity.x = speed;
        }
        if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
            player.isAttacking = true;
            player.width = 115;
        }
    });

    window.addEventListener("keyup", (event) => {
        if (event.key === "w" || event.key === "s") {
            player.velocity.y = 0;
        }
        if (event.key === "a" || event.key === "d") {
            player.velocity.x = 0;
        } 
        if (event.key === "s") {
            player.isCrouching = false;
            player.height = player.height * 2;
        }
        if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
            player.isAttacking = false;
            player.width = 100;
        }
    });
}

// Function to draw the scene

function drawScene(newTime) {

    if (oldTime == undefined) {
        oldTime = newTime;
    }
    let deltaTime = newTime - oldTime;

    // Clean the canvas so we can draw everything again
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Draw elements
    player.draw(ctx);
    enemyNormal.draw(ctx);
    enemyHeavy.draw(ctx);
    enemyFly.draw(ctx);

    // Update the properties of the objects
    player.update(deltaTime);
    enemyNormal.update(deltaTime);
    enemyHeavy.update(deltaTime);
    enemyFly.update(deltaTime);

    // Call the function again
    oldTime = newTime;
    requestAnimationFrame(drawScene);
}