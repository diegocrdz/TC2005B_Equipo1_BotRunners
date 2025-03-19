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

let abilities = ["damage", "health", "resistance", "double jump", "dash"]; // List of abilities that the player can gain

// Scale of the whole world, to be applied to all objects
// Each unit in the level file will be drawn as these many square pixels
const scale = 32;
const levelWidth = Math.floor(canvasWidth / scale);
const levelHeight = Math.floor(canvasHeight / scale);


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
        this.playerHealthBar = (ctx) => {
            const barWidth = 260; // Width of the health bar
            const barHeight = 10; // Height of the health bar
            const x = canvasWidth / 2; // X position of the health bar
            const y = canvasHeight - 60; // Y position (above the player)

            // Calculate the width of the health portion
            const healthWidth = (this.player.health / this.player.maxHealth) * barWidth;

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
                } else if (actor.type == 'coin' && actor.isCollectible) {
                    this.player.gainXp(actor.xp_value); // Gain 5 experience points
                    GAME_LEVELS[this.levelNumber] = GAME_LEVELS[this.levelNumber].replace('$', '.'); // Remove the coin from the level
                    this.actors = this.actors.filter(item => item !== actor); // Remove the coin from the actors list
                } else if (actor.type == 'enemy') {
                    // Check if the player is attacking
                    if (this.player.isAttacking) { // If the player is attacking, deal damage to the enemy
                        actor.takeDamage(this.player.damage, this.player.attackCooldown);
                        if (actor.health <= 0) {
                            actor.die();
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
    // Regenerate the levels
    let numRooms = 6; // Define the number of rooms for the new levels
    let levelGenerator = new LevelGenerator(numRooms);
    let rooms = levelGenerator.generate();

    GAME_LEVELS = []; // Clear the existing levels

    // Generate new levels based on the room types
    for (let i = 0; i < numRooms; i++) {
        let level = generateRandomLevel(levelWidth, 16, 10, 1, 1, 3, rooms.get(i).type);
        GAME_LEVELS.push(level);
    }

    // Reset the game state with the new levels
    game = new Game('playing', new Level(GAME_LEVELS[0]));
    frameStart = undefined; // Reset the frame start time
    console.log("Game restarted with new levels");
}

function setEventListeners() {
    window.addEventListener("keydown", event => {
        if (event.key == 'w'){
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

        if(event.key == 'w' && game.player.isJumping){ //falta poner que no se pase del limite
            game.player.doubleJump();
        }

        if(event.shiftKey){
            game.player.dash(game.level);
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
