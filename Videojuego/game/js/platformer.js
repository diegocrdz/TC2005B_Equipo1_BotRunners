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
        this.actors = level.actors;

        // From the actors list, filter the enemies
        this.enemies = this.actors.filter(actor => actor.type === 'enemy');

        // List of projectiles
        this.projectiles = [];

        this.labelMoney = new TextLabel(20, canvasHeight - 30,
                                        "30px Ubuntu Mono", "white");

        this.labelDebug = new TextLabel(20, canvasHeight - 60,
                                        "20px Ubuntu Mono", "white");

        this.labelTime =  new TextLabel(canvasWidth - 150, 150,
                                        "23px monospace", "#434a5f");

        this.labelLife = new TextLabel(canvasWidth - 120, canvasHeight - 50,
                                        "20px Ubuntu Mono", "white");

        this.labelLevel = new TextLabel(canvasWidth - 120, canvasHeight - 20,
                                        "20px Ubuntu Mono", "white");
        
        // Load board images for indicating ladders direction
        this.ladderUpImage = new Image();

        this.ladderDownImage = new Image();

        // Method to draw the ladder up sign
        this.drawLadderUp = (ctx) => {
            const ladderX = (canvasWidth / 2) - 70; // Posición X de la escalera (al lado de la barra de vida)
            const ladderY = canvasHeight / 3; // Posición Y de la escalera (alineada con la barra de vida)
            const ladderWidth = 60; // Ancho del sprite de la escalera
            const ladderHeight = 60; // Alto del sprite de la escalera
            ctx.drawImage(this.ladderUpImage, ladderX, ladderY, ladderWidth, ladderHeight);
        };

        // Method to draw the ladder down sign
        this.drawLadderDown = (ctx) => {
            const ladderX = (canvasWidth / 2) - 70; // Posición X de la escalera (al lado de la barra de vida)
            const ladderY = canvasHeight / 3 + 80; // Posición Y de la escalera (alineada con la barra de vida)
            const ladderWidth = 60; // Ancho del sprite de la escalera
            const ladderHeight = 60; // Alto del sprite de la escalera
            ctx.drawImage(this.ladderDownImage, ladderX, ladderY, ladderWidth, ladderHeight);
        };

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

        // Load the health potion image
        this.potionImage = new Image();
        this.potionImage.src = '../assets/sprites/potion_full.png'; // Load the full potion sprite

        // Weapons
        this.weaponBackgroundImage = new Image();
        this.weaponBackgroundImage.src = '../../../Videojuego/assets/objects/gray_weapon_background.png';

        this.weaponSelectionImage = new Image();
        this.weaponSelectionImage.src = '../../../Videojuego/assets/objects/weapon_selection.png';

        this.armImage = new Image();
        this.armImage.src =   '../../../Videojuego/assets/objects/melee_1.png';

        this.roboticArmImage = new Image();
        this.roboticArmImage.src =   '../../../Videojuego/assets/objects/melee_2.png';

        this.slowPistolImage = new Image();
        this.slowPistolImage.src =   '../../../Videojuego/assets/objects/gun_1.png';

        this.fastPistolImage = new Image();
        this.fastPistolImage.src =   '../../../Videojuego/assets/objects/gun_2.png';
   

        //Method to draw the selection backgrounds
        this.drawBackgrounds = (ctx) => {
            const armBackgroundX = (canvasWidth / 2) - 360;
            const pistolBackgroundX = (canvasWidth / 2) - 260;
            const potionBackgroundX = (canvasWidth / 2) - 160;
            const weaponBackgroundY = canvasHeight - 78;
            const weaponBackgroundWidth = 70; 
            const weaponBackgroundHeight = 70;

            ctx.drawImage(this.weaponBackgroundImage, armBackgroundX, weaponBackgroundY, weaponBackgroundWidth, weaponBackgroundHeight);
            ctx.drawImage(this.weaponBackgroundImage, pistolBackgroundX, weaponBackgroundY, weaponBackgroundWidth, weaponBackgroundHeight);
            ctx.drawImage(this.weaponBackgroundImage, potionBackgroundX, weaponBackgroundY, weaponBackgroundWidth, weaponBackgroundHeight);

            if(game.player.selectedWeapon == 1){
                ctx.drawImage(this.weaponSelectionImage, armBackgroundX, weaponBackgroundY, weaponBackgroundWidth, weaponBackgroundHeight);
            } else if(game.player.selectedWeapon == 2){
                ctx.drawImage(this.weaponSelectionImage, pistolBackgroundX, weaponBackgroundY, weaponBackgroundWidth, weaponBackgroundHeight);
            } else if(game.player.selectedWeapon == 3){
                ctx.drawImage(this.weaponSelectionImage, potionBackgroundX, weaponBackgroundY, weaponBackgroundWidth, weaponBackgroundHeight);
            }
        }
        

        // Method to draw the health potion
        this.drawHealthPotion = (ctx) => {
            const potionX = (canvasWidth / 2) - 155; // Posición X de la poción (al lado de la barra de vida)
            const potionY = canvasHeight - 70; // Posición Y de la poción (alineada con la barra de vida)
            const potionWidth = 60; // Ancho del sprite de la poción
            const potionHeight = 50; // Alto del sprite de la poción
            ctx.drawImage(this.potionImage, potionX, potionY, potionWidth, potionHeight);
        };

        this.drawWeapons = (ctx) => {
            const armX = (canvasWidth / 2) - 355; // Posición X de la poción (al lado de la barra de vida)
            const armY = canvasHeight - 70; // Posición Y de la poción (alineada con la barra de vida)
            const armWidth = 60; // Ancho del sprite de la poción
            const armHeight = 50; // Alto del sprite de la poción

            const pistolX = (canvasWidth / 2) - 256;
            const pistolY = canvasHeight - 80; // Posición Y de la poción (alineada con la barra de vida)
            const pistolWidth = 65; // Ancho del sprite de la poción
            const pistolHeight = 65; // Alto del sprite de la poción

            ctx.drawImage(this.armImage, armX, armY, armWidth, armHeight);
            ctx.drawImage(this.slowPistolImage, pistolX, pistolY, pistolWidth, pistolHeight);
        };

        console.log(`############ LEVEL ${this.levelNumber} START ###################`);
    }

    addProjectile(projectile) {
        this.projectiles.push(projectile);
    }

    removeProjectile(projectile) {
        const index = this.projectiles.indexOf(projectile);
        if (index > -1) {
            this.projectiles.splice(index, 1);
        }
    }

    removeEnemy(enemy) {
        const index = this.enemies.indexOf(enemy);
        if (index > -1) {
            this.enemies.splice(index, 1);
        }
        this.actors = this.actors.filter(actor => actor !== enemy);
    }

    // Function to load a specific level
    moveToLevel(levelNumber, playerPositionX, playerPositionY) {

        // If the player is in the boss room and wants
        // to move to the next room, the game is finished
        if (rooms.get(this.levelNumber).type === "boss"
            && levelNumber === this.levelNumber + 1) {
            restartGame();
            return;
        }


        this.level = new Level(GAME_LEVELS[levelNumber]); // Create a new level
        this.levelNumber = levelNumber;
        this.level.player = this.player; // Assign the new player instance
        this.actors = this.level.actors;
    
        // Set the player's position explicitly
        if (playerPositionX !== undefined && playerPositionY !== undefined) {
            this.player.position = new Vec(playerPositionX, playerPositionY); // Set the player's position
            this.player.setHitbox(0, 0, this.player.size.x, this.player.size.y); // Update hitbox
        }
    
        // Reset the player pressing keys
        // This is necessary to avoid the player
        // moving automatically when changing levels
        this.player.isPressingUp = false;
        this.player.isPressingDown = false;
    
        console.log("Moved to level " + levelNumber);
    }

    getBranch(type) {
        // Check if the current room has a connection to a branch
        const currentRoom = rooms.get(this.levelNumber); // Get the current room
        const connectedRooms = Array.from(currentRoom.connections); // Get the connected rooms as an array
        console.log("Connected rooms: " + connectedRooms);

        // Search for a room of type "branch" or "button" in the connected rooms
        const targetRoomId = connectedRooms.find(roomId => {
            const room = rooms.get(roomId);
            return room.type === type;
        });

        return targetRoomId; // Return the found room ID
    }

    // Function to 

    update(deltaTime) {
        this.player.update(this.level, deltaTime);

        for (let actor of this.actors) {
            actor.update(this.level, deltaTime);
        }
        
        // Update projectiles
        this.projectiles.forEach(projectile => projectile.update(this.level, deltaTime));

        // A copy of the full list to iterate over all of them
        // DOES THIS WORK?
        let currentActors = this.actors;

        // Update door state
        // .some() returns true if at least one element satisfies the condition
        // ref: https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/some
        // actor => actor.type === 'enemy' is a function that returns true if the actor is an enemy
        const hasEnemies = this.actors.some(actor => actor.type === 'enemy');
        for (let actor of this.actors) {
            if (actor.type === 'door') {
                if (hasEnemies) {
                    actor.close(); // Update the state and sprite of doors
                    // Update the ladder signs
                    this.ladderUpImage.src = '../../assets/backgrounds/sign_up_1.png';
                    this.ladderDownImage.src = '../../assets/backgrounds/sign_down_1.png';
                } else {
                    actor.open(); // Update the state and sprite of doors
                    // Update the ladder signs
                    this.ladderUpImage.src = '../../assets/backgrounds/sign_up.png';
                    this.ladderDownImage.src = '../../assets/backgrounds/sign_down.png';
                }
            }
        }

        // Detect collisions with projectiles
        for (let projectile of this.projectiles) {
            for (let actor of currentActors) {
                if (actor.type === 'enemy' && overlapRectangles(projectile, actor)) {
                    actor.takeDamage(game.player.damage); // Deal damage to the enemy
                    this.removeProjectile(projectile); // Remove the projectile
                    break; // Stop checking other enemies for this projectile
                }
            }
        }

        // Detect collisions with player
        for (let actor of currentActors) {
            if (actor.type != 'floor' && overlapRectangles(this.player, actor)) {
                //console.log(`Collision of ${this.player.type} with ${actor.type}`);
                if (actor.type == 'wall') {
                    //console.log("Hit a wall");

                } else if (actor.type == 'coin' && actor.isCollectible) {
                    // Collect the coin
                    this.player.gainXp(actor.xp_value);
                    // Remove the coin from the level string
                    GAME_LEVELS[this.levelNumber] = GAME_LEVELS[this.levelNumber].replace('$', '.');
                    // Remove the coin from the actors list
                    this.actors = this.actors.filter(item => item !== actor); // Remove the coin from the actors list

                } else if (actor.type == 'enemy') {
                    // If the player is attacking, deal damage to the enemy
                    if (this.player.isAttacking) {
                        actor.takeDamage(this.player.damage, this.player.attackCooldown);
                    }
                    // If the player is not attacking, the enemy deals damage to the player
                    else {
                        this.player.takeDamage(actor.damage);
                    }

                } else if (actor.type == 'door' && actor.isOpen) {
                    
                    // If the door is on the left, move to the previous level
                    if (this.player.position.x > actor.position.x) {
                        this.moveToLevel(this.levelNumber - 1, levelWidth - this.player.size.x - 2, 12);
                        this.lastRoomNumber = this.levelNumber;
                        
                    // If the door is on the right, move to the next level
                    } else if (this.player.position.x < actor.position.x) {
                        this.moveToLevel(this.levelNumber + 1, 2, 12);
                        this.lastRoomNumber = this.levelNumber;
                    }

                } else if (actor.type == 'ladder' && !hasEnemies) {

                    // Initialize the target room ID
                    let targetRoomId = undefined;

                    // If the player jumps and he is in a room with 1 branch
                    // he will go to the button room
                    // if there is no button room, he will go to branch2
                    // if there is no branch2, he will go to branch1
                    if (this.player.isPressingUp
                        && rooms.get(this.levelNumber).type === "ladder1") {
                        targetRoomId = this.getBranch("button");
                        if (targetRoomId !== undefined) {
                            this.moveToLevel(targetRoomId);
                        } else {
                            targetRoomId = this.getBranch("branch2");
                            if (targetRoomId !== undefined) {
                                this.moveToLevel(targetRoomId);
                            } else {
                                targetRoomId = this.getBranch("branch1");
                                if (targetRoomId !== undefined) {
                                    this.moveToLevel(targetRoomId);
                                }
                            }
                        }
                    }

                    // If the player jumps and he is in a room with 2 branches
                    // he will go to the button room
                    // if there is no button room, he will go to branch1
                    if (this.player.isPressingUp
                        && rooms.get(this.levelNumber).type === "ladder2") {
                        targetRoomId = this.getBranch("button");
                        if (targetRoomId !== undefined) {
                            this.moveToLevel(targetRoomId);
                        } else {
                            targetRoomId = this.getBranch("branch1");
                            if (targetRoomId !== undefined) {
                                this.moveToLevel(targetRoomId);
                            }
                        }
                    }

                    // If the player crouches and he is in a room with 2 branches
                    // he will go to branch2
                    if (this.player.isPressingDown
                                && rooms.get(this.levelNumber).type === "ladder2") {
                        targetRoomId = this.getBranch("branch2");
                        if (targetRoomId !== undefined) {
                            console.log("Going to branch2");
                            this.moveToLevel(targetRoomId, this.player.position.x, 5);
                        }
                    }
                    
                    // If the player jumpps and he is in a brach below
                    // he will go to the last room visited
                    if (this.player.isPressingUp
                        && rooms.get(this.levelNumber).type === "branch2") {
                        this.moveToLevel(this.lastRoomNumber);
                    }

                    // If the player crouches and he is in a branch up
                    // he will go to the last room visited
                    if (this.player.isPressingDown
                        && rooms.get(this.levelNumber).type === "branch1") {
                        this.moveToLevel(this.lastRoomNumber, this.player.position.x, 5);
                    }

                    // If the player crouches and he is in a button room
                    // he will go to the last room visited
                    if (this.player.isPressingDown
                        && rooms.get(this.levelNumber).type === "button") {
                            this.moveToLevel(this.lastRoomNumber, this.player.position.x, 5);
                    }

                } else if (actor.type == 'button') {
                    actor.press(); // Press the button
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

        // Draw the ladders signs
        if (rooms.get(this.levelNumber).type === "ladder1") {
            this.drawLadderUp(ctx);
        }
        if (rooms.get(this.levelNumber).type === "ladder2") {
            this.drawLadderUp(ctx);
            this.drawLadderDown(ctx);
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

        // Draw the projectiles
        this.projectiles.forEach(projectile => projectile.draw(ctx, scale));

        // Draw the labels
        //this.labelMoney.draw(ctx, `Money: ${this.player.money}`);
        //this.labelDebug.draw(ctx, `Velocity: ( ${this.player.velocity.x.toFixed(3)}, ${this.player.velocity.y.toFixed(3)} )`);
        this.labelTime.draw(ctx, `${this.chronometer.$elapsedTime.textContent}`);
        this.labelLife.draw(ctx, `Health: ${this.player.health}`);
        this.labelLevel.draw(ctx, `Lvl. ${this.player.level}`);

        // Draw the player's health bar
        this.playerHealthBar(ctx, scale);

        // Draw the player's experience bar
        this.playerXpBar(ctx, scale);

        //Draw the weapon backgrounds
        this.drawBackgrounds(ctx);

        // Draw the health potion
        this.drawHealthPotion(ctx);

        //Draw the weapons
        this.drawWeapons(ctx);
    }

    // Pause or resume the game
    togglePause() {
        this.paused = !this.paused;

        if(this.paused){
            this.chronometer.pause(); //pauses chronometer
        } else{
            this.chronometer.start(); //resumes chronometer
        }

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
    "D": {objClass: Door,
          label: "door",
          sprite: '../../assets/interactable/door_open.png',
          rect: new Rect(0, 0, 18, 18),
          isOpen: true},
    "U": {objClass: GameObject,
          label: "door_up",
          sprite: '../../assets/interactable/platform_1.png',
          rect: new Rect(0, 0, 18, 18)},
    "V": {objClass: GameObject,
          label: "door_down",
          sprite: '../../assets/interactable/platform_1.png',
          rect: new Rect(0, 0, 18, 18)},
    "B": {objClass: GameObject,
          label: "wall",
          sprite: '../../assets/obstacles/box_1.png',
          rect: new Rect(0, 0, 18, 18)},
    "L": {objClass: GameObject,
          label: "ladder",
          sprite: '../../assets/interactable/ladder_1.png',
          rect: new Rect(0, 0, 18, 18)},
    "0": {objClass: Button,
          label: "button",
          sprite: '../../assets/interactable/button_off.png',
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

    game.chronometer = new Chronometer(); //initiates chronometer
    game.chronometer.start(); //starts chronometer

    setEventListeners();

    // Call the first frame with the current time
    updateCanvas(document.timeline.currentTime);

    
}

function restartGame() {
    
    GAME_LEVELS = [];
    numRooms = 6;
    levelGenerator = new LevelGenerator(numRooms);
    rooms = levelGenerator.generate();
    console.log(rooms);

    // Fill the list of levels with the generated rooms
    for (let i = 0; i < rooms.size; i++) {
        let level = generateRandomLevel(levelWidth, 16, 10, 1, 1, 3, rooms.get(i).type);
        GAME_LEVELS.push(level);
    }

    // Print the generated levels to the console
    for (let i = 0; i < GAME_LEVELS.length; i++) {
        console.log(GAME_LEVELS[i]);
    }

    if (game.chronometer) {
        game.chronometer.pause(); // stops the current chronometer
    }

    game = new Game('playing', new Level(GAME_LEVELS[0]));

    if (!game.chronometer) {
        game.chronometer = new Chronometer(); // if the chronometer doesnt exists, it creates a new one
    }

    game.chronometer.reset(); // resets the chronometer
    game.chronometer.start();
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

        // Attack with the melee weapon
        if (event.key == 'ArrowLeft' && game.player.selectedWeapon == 1) {
            game.player.isFacingRight = false;
            game.player.attack();
        }
        if (event.key == 'ArrowRight' && game.player.selectedWeapon == 1) {
            game.player.isFacingRight = true;
            game.player.attack();
        }

        // Attack with the ranged weapon
        if (event.key == 'ArrowLeft' && game.player.selectedWeapon == 2) {
            game.player.isFacingRight = false;
            game.player.shoot();
        }
        if (event.key == 'ArrowRight' && game.player.selectedWeapon == 2) {
            game.player.isFacingRight = true;
            game.player.shoot();
        }

        // Pause the game
        if (event.key == 'p') {
            game.togglePause();
        }

        // Restart the game
        if (event.key == 'r') {
            restartGame();
        }

        // Use first weapom
        if (event.key == '1') {
            game.player.selectWeapon(1);

        } else if(event.key == '2') {
            game.player.selectWeapon(2);

        } else if(event.key == '3') {
            game.player.selectWeapon(3)
            game.player.useHealthPotion();
        }

        // Use ladders
        if (event.key == 'ArrowUp') {
            game.player.isPressingUp = true;
        }
        if (event.key == 'ArrowDown') {
            game.player.isPressingDown = true;
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

        // Use ladders
        if (event.key == 'ArrowUp') {
            game.player.isPressingUp = false;
        }
        if (event.key == 'ArrowDown') {
            game.player.isPressingDown = false;
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
