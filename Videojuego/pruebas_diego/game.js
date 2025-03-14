// Implementation of the game

"use strict";

// Global variables
const canvasWidth = 1000;
const canvasHeight = 600;

// Context of the canvas
let ctx;

// A variable to store the game object
let game;

// Variables for the game
let oldTime;

// Variables for the character
const playerSpeed = 0.5; // Movement speed
const gravity = 0.02; // Gravity force
const jumpForce = 1.3; // Jump force

// Class for the main character in the game
class Player extends GameObject {
    constructor(position, width, height, color) {
        super(position, width, height, color, "player");
        this.velocity = new Vec(0, 0);

        this.isJumping = false;
        this.isCrouching = false;
        this.isFacingRight = true;
        this.isAttacking = false;

        // Animation properties
        this.frameCount = 10; // Number of frames in the sprite sheet
        this.frameIndex = 0; // Current frame index
        this.frameDuration = 100; // Time in milliseconds
        this.lastFrameTime = 0; // Last frame time

        // Player properties
        this.cooldown = 100; // Attack cooldown
    }

    jump() {
        if (this.isJumping) {
            return;
        }
        else {
            this.velocity.y = -jumpForce;
            this.isJumping = true;
        }
    }

    crouch() {
        if (this.isCrouching) {
            return;
        }
        else {
            this.isCrouching = true;
        }
    }
    stopCrouching() {
        if (!this.isCrouching) {
            return;
        }
        else {
            this.isCrouching = false;
        }
    }

    attack() {
        if (this.isAttacking) {
            return;
        }
        else {
            this.isAttacking = true;
        }
    }

    update(deltaTime) {
        this.position = this.position.plus(this.velocity.times(deltaTime));

        if (this.position.y < 0) {
            this.position.y = 0;
        } else if (this.position.y > canvasHeight - this.height) {
            this.position.y = canvasHeight - this.height;
            this.isJumping = false;
        } else if (this.position.x < 0) {
            this.position.x = 0;
        } else if (this.position.x + this.width > canvasWidth) {
            this.position.x = canvasWidth - this.width;
        }

        // Apply gravity
        this.velocity.y += gravity;

        // Update sprite
        if (this.velocity.x > 0) {
            this.isFacingRight = true;
        } else if (this.velocity.x < 0) {
            this.isFacingRight = false;
        }

        // Change facing direction
        if (this.isFacingRight) {
            this.spriteRect = new Rect(0, 0, 24, 24);
        } else {
            this.spriteRect = new Rect(0, 0, 24, 24);
        }

        // Update animation
        this.updateAnimation(deltaTime);
    }

    updateAnimation(deltaTime) {
        // Animation properties
        const frameWidth = 24; // Width of each frame
        const frameHeight = 24; // Height of each frame
        const spritePath = "../assets/characters/skippy/skippy_1.png";

        // Update the frame index based on the time passed
        this.lastFrameTime += deltaTime;
        if (this.lastFrameTime >= this.frameDuration) {
            this.frameIndex = (this.frameIndex + 1) % this.frameCount;
            this.lastFrameTime = 0;
        }

        // Determine the frame count based on the player's state
        if (this.velocity.x == 0 && !this.isJumping && !this.isCrouching) { // Idle animation
            this.frameCount = 2;
            this.frameIndex = this.frameIndex % 2;
        }
        else if (this.isJumping) { // Jumping animation
            this.frameCount = 2;
            this.frameIndex = (this.frameIndex % 2) + 4;
        }
        else if (this.velocity.x != 0 && !this.isCrouching) { // Walking animation
            this.frameCount = 2;
            this.frameIndex = (this.frameIndex % 2) + 2;
        }
        else if (this.isCrouching) { // Crouching animation
            this.frameCount = 2;
            this.frameIndex = (this.frameIndex % 2) + 6;
        }
        
        if (this.isAttacking) { // Attacking animation
            this.frameCount = 2;
            this.frameIndex = (this.frameIndex % 2) + 8;
        }

        // Set the sprite based on the frame index
        const frameX = this.frameIndex * frameWidth;
        this.setSprite(spritePath, new Rect(frameX, 0, frameWidth, frameHeight));
    }

    draw(ctx) {
        ctx.save();
        if (!this.isFacingRight) { // If facing left, flip the sprite
            ctx.scale(-1, 1); // Flip the context horizontally
            ctx.translate(-this.position.x * 2 - this.width, 0); // Move the context back
        }
        super.draw(ctx); // Call the draw method of the parent class
        ctx.restore();
    }
}

class Enemy extends GameObject {
    constructor(position, width, height, color) {
        super(position, width, height, color, "enemy");
    }

    update(deltaTime) {

        if (this.position.y < 0) {
            this.position.y = 0;
        } else if (this.position.y > canvasHeight - this.height) {
            this.position.y = canvasHeight - this.height;
            this.isJumping = false;
        } else if (this.position.x < 0) {
            this.position.x = 0;
        } else if (this.position.x + this.width > canvasWidth) {
            this.position.x = canvasWidth - this.width;
        }
    }
}

// Class to keep track of all the events and objects in the game
class Game {
    constructor() {
        this.createEventListeners();
        this.initObjects();
    }

    initObjects() {
        // Create player
        this.player = new Player(new Vec(20, canvasHeight), 100, 100, "blue");
        //this.player.setSprite('../assets/sprites/link_front.png')
        //this.player.setSprite("../assets/characters/skippy/skippy_1.png",
        //                      new Rect(0, 0, 24, 24));
        
        // Create player
        this.enemy = new Enemy(new Vec(100, canvasHeight), 100, 100, "blue");
        //this.player.setSprite('../assets/sprites/link_front.png')
        this.enemy.setSprite("../assets/characters/enemies/robot_normal.png",
                              new Rect(0, 0, 24, 24));

        // Create doors to connect rooms
        this.rightDoor = new GameObject(new Vec(canvasWidth - 20, canvasHeight - 200), 20, 200, "green", "door");
        this.leftDoor = new GameObject(new Vec(0, canvasHeight - 200), 20, 200, "green", "door");

        this.actors = [];
    }

    draw(ctx) {
        for (let actor of this.actors) {
            actor.draw(ctx);
        }
        this.rightDoor.draw(ctx);
        this.leftDoor.draw(ctx);
        this.player.draw(ctx);
        this.enemy.draw(ctx);
    }

    update(deltaTime) {
        for (let actor of this.actors) {
            actor.update(deltaTime);
        }
        this.player.update(deltaTime);
        this.enemy.update(deltaTime);
    }

    createEventListeners() {
        window.addEventListener('keydown', (event) => {
            if (event.key == 'w' && !this.player.isJumping) {
                this.player.jump();
            } else if (event.key == 'a') {
                this.player.velocity.x = -playerSpeed;
            } else if (event.key == 's') {
                this.player.crouch();
            } else if (event.key == 'd') {
                this.player.velocity.x = playerSpeed;
            } else if (event.key == 'ArrowLeft') {
                this.player.isFacingRight = false;
                this.player.attack();
            }
            else if (event.key == 'ArrowRight') {
                this.player.isFacingRight = true;
                this.player.attack();
            }
        });

        window.addEventListener('keyup', (event) => {
            if (event.key == 'w') {
                this.player.velocity.y *= 0.5; // Reduce the jump height
            } else if (event.key == 'a') {
                this.player.velocity.x = 0;
            } else if (event.key == 's') {
                this.player.stopCrouching();
            } else if (event.key == 'd') {
                this.player.velocity.x = 0;
            } else if (event.key == 'ArrowLeft' || event.key == 'ArrowRight') {
                this.player.isAttacking = false;
            }
        });
    }
}

// Starting function that will be called from the HTML page
function main() {
    // Get a reference to the object with id 'canvas' in the page
    const canvas = document.getElementById('canvas');
    // Resize the element
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    // Get the context for drawing in 2D
    ctx = canvas.getContext('2d');

    // Create the game object
    game = new Game();

    drawScene(0);
}

// Main loop function to be called once per frame
function drawScene(newTime) {
    if (oldTime == undefined) {
        oldTime = newTime;
    }
    let deltaTime = newTime - oldTime;

    // Clean the canvas so we can draw everything again
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    game.draw(ctx);
    game.update(deltaTime);

    oldTime = newTime;
    requestAnimationFrame(drawScene);
}