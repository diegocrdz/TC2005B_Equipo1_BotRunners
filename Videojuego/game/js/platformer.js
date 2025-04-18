/*
 * Implementation of the game
 * This file contains the main game loop and the game logic,
 * including global variables used in the game.
 *
 * Team BotRunners:
 * - Diego Córdova Rodríguez, A01781166
 * - Lorena Estefanía Chewtat Torres, A01785378
 * - Eder Jezrael Cantero Moreno, A01785888
 *
 * Date: 11/04/2025
*/

"use strict";

// Global variables
const canvasWidth = 800;
const canvasHeight = 600;

// Context for the display canvas
let ctx;

// The time at the previous frame
let frameStart;
// Time since the last frame
let deltaTime = 0;

// Variables for the game
let game;
let player;
let level;

// Scale of the whole world, to be applied to all objects
// Each unit in the level file will be drawn as these many square pixels
const scale = 32;
const levelWidth = Math.floor(canvasWidth / scale);
const levelHeight = Math.floor(canvasHeight / scale);

// Main class for the game
class Game {
    constructor(state, level) {
        this.state = state;
        this.level = level;
        this.levelNumber = 0;
        this.player = level.player;
        // Initialize the player sprite
        this.actors = level.actors;
        // Menu for displaying abilities
        this.abilities = new popUpAbility();
        this.xpMultiplier = 1;
        // Button state for the boss room
        this.isButtonPressed = false;
        // Cinematic properties
        this.cinematicImage = new GameObject(null, canvasWidth, canvasHeight - 100, 0, 0, 'cinematic');
        this.cinematicImage.setSprite('../../assets/cinematics/intro.png');
        this.cinematicTimer = undefined;
        this.cinematicSkipped = false;
        this.labelSkip = new TextLabel(canvasWidth / 2 - 150, canvasHeight - 40, "20px monospace", "white");
        // Win cinematic properties
        this.winImage = new GameObject(null, canvasWidth, canvasHeight, 0, 0, 'cinematic');
        this.winImage.setSprite('../../assets/cinematics/win.png');
        // Minimap and chronometer menu
        this.topRightMenu = new TopRightMenu(null, 200, 130, canvasWidth - 200, 0, 'trmenu');
        // Pause menu
        this.pauseMenu = new PauseMenu(null, canvasWidth, canvasHeight, 0, 0, 'pausemenu');
        // Loose menu
        this.looseMenu = new LooseMenu(null, canvasWidth, canvasHeight, 0, 0, 'loosemenu');
        // Main menu
        this.mainMenu = new MainMenu(null, canvasWidth, canvasHeight, 0, 0, 'mainmenu');
        // Options menu
        this.optionsMenu = new OptionsMenu(null, canvasWidth, canvasHeight, 0, 0, 'optionsmenu');
        // Stats menu
        this.statsMenu = new StatsMenu(null, canvasWidth, canvasHeight, 0, 0, 'statsmenu');

        // List of the player's projectiles
        this.projectiles = [];

        // List of the enemies' projectiles
        this.enemiesProjectiles = [];

        // Labels
        this.labelMoney = new TextLabel(20, canvasHeight - 50,
                                        "30px Ubuntu Mono", "white");

        this.labelDebug = new TextLabel(20, canvasHeight - 60,
                                        "20px Ubuntu Mono", "white");
        
        this.labelHP = new TextLabel(canvasWidth / 2 + 35, canvasHeight - 65,
                                    "10px monospace", "white");
        this.labelXP = new TextLabel(canvasWidth / 2 + 35, canvasHeight - 35,
                                    "10px monospace", "white");

        this.labelLife = new TextLabel(canvasWidth - 92, canvasHeight - 50,
                                        "20px monospace", "white");

        this.labelLevel = new TextLabel(canvasWidth - 92, canvasHeight - 20,
                                        "20px monospace", "white");

        this.labelDamage = new TextLabel(canvasWidth - 501, canvasHeight - 52,
                                        "18px monospace", "white");

        this.labelResistance = new TextLabel(canvasWidth - 437, canvasHeight - 52,
                                            "18px monospace", "white");
        
        // Load board images for indicating ladders direction
        this.ladderUpImage = new GameObject(null, 60, 60,
                                            (canvasWidth / 2) - 70, canvasHeight / 3,
                                            'sign');
        
        this.ladderDownImage = new GameObject(null, 60, 60,
                                            (canvasWidth / 2) - 70, canvasHeight / 3 + 80,
                                            'sign');
        
        // Load the tutorial image
        this.tutorial1Image = new GameObject(null, 360, 180,
                                            (canvasWidth / 2) - 175, canvasHeight / 3 - 100,
                                            'tutorial');
        this.tutorial2Image = new GameObject(null, 360, 180,
                                            (canvasWidth / 2) - 175, canvasHeight / 3 - 100,
                                            'tutorial');

        // Health bar for the player
        this.playerHealthBar = new Bar(
            canvasWidth / 2 + 33, // X position
            canvasHeight - 60, // Y position
            260, // Width
            10, // Height
            this.player.maxHealth, // Max health
            this.player.health, // Current health
            "lightgreen", // Bar color
            "black", // Background color
            "black" // Border color
        );
        // XP bar for the player
        this.playerXpBar = new Bar(
            canvasWidth / 2 + 33, // X position
            canvasHeight - 30, // Y position
            260, // Width
            10, // Height
            this.player.xpToNextLevel, // Max XP
            this.player.xp, // Current XP
            "yellow", // Bar color
            "black", // Background color
            "black" // Border color
        );
        
        // Load the health potion image
        this.potionImage = new GameObject(null, 60, 50,
                                        (canvasWidth / 2) - 222, canvasHeight - 70,
                                        'potion');
        this.potionImage.setSprite('../../assets/objects/battery_full.png');

        // Weapon background and selection images
        this.weaponBackgroundImage = new GameObject(null, 70, 70, 0, 0, 'ui');
        this.weaponBackgroundImage.setSprite('../../../Videojuego/assets/objects/gray_weapon_background.png');

        this.abilitiesBackgroundImage = new GameObject(null, 147, 70, (canvasWidth / 2) - 137, canvasHeight - 78, 'ui');
        this.abilitiesBackgroundImage.setSprite('../../../Videojuego/assets/objects/gray_weapon_background.png');

        this.weaponSelectionImage = new GameObject(null, 70, 70, 0, 0, 'ui');
        this.weaponSelectionImage.setSprite('../../../Videojuego/assets/objects/weapon_selection.png');

        // Weapon images for the UI
        this.armImage = new GameObject(null, 55, 50, (canvasWidth / 2) - 380, canvasHeight - 70, 'weapon');
        this.armImage.setSprite('../../../Videojuego/assets/objects/melee_1.png');

        this.roboticArmImage = new GameObject(null, 55, 50, (canvasWidth / 2) - 380, canvasHeight - 70, 'weapon');
        this.roboticArmImage.setSprite('../../../Videojuego/assets/objects/melee_2.png');

        this.slowPistolImage = new GameObject(null, 65, 65, (canvasWidth / 2) - 303, canvasHeight - 80, 'weapon');
        this.slowPistolImage.setSprite('../../../Videojuego/assets/objects/gun_1.png');

        this.fastPistolImage = new GameObject(null, 65, 65, (canvasWidth / 2) - 303, canvasHeight - 80, 'weapon');
        this.fastPistolImage.setSprite('../../../Videojuego/assets/objects/gun_2.png');

        // Abilities images for the UI
        this.damageImage = new Image();
        this.damageImage.src = '../../../Videojuego/assets/objects/ui_damage.png';

        this.resistanceImage = new Image();
        this.resistanceImage.src = '../../../Videojuego/assets/objects/ui_resistance.png';

        this.dashImage = new Image();
        this.dashImage.src = '../../../Videojuego/assets/objects/ui_dash.png';

        this.doubleJumpImage = new Image();
        this.doubleJumpImage.src = '../../../Videojuego/assets/objects/ui_doublejump.png';

        //Method to draw the selection backgrounds
        this.drawBackgrounds = (ctx) => {
            const weaponPositions = [
                { x: (canvasWidth / 2) - 387, y: canvasHeight - 78 }, // Arm background
                { x: (canvasWidth / 2) - 307, y: canvasHeight - 78 }, // Pistol background
                { x: (canvasWidth / 2) - 227, y: canvasHeight - 78 }  // Potion background
            ];

            // Draw weapon backgrounds
            weaponPositions.forEach((pos) => {
                this.weaponBackgroundImage.position = new Vec(pos.x, pos.y);
                this.abilitiesBackgroundImage.draw(ctx,1);
                this.weaponBackgroundImage.draw(ctx, 1);
            });

            this.weaponBackgroundImage.draw(ctx,1);

            // Draw weapon selection highlight
            if (game.player.selectedWeapon === 1) {
                this.weaponSelectionImage.position = new Vec(weaponPositions[0].x, weaponPositions[0].y);
                this.weaponSelectionImage.draw(ctx, 1);
            } else if (game.player.selectedWeapon === 2) {
                this.weaponSelectionImage.position = new Vec(weaponPositions[1].x, weaponPositions[1].y);
                this.weaponSelectionImage.draw(ctx, 1);
            }
            else if (game.player.selectedWeapon === 3) {
                this.weaponSelectionImage.position = new Vec(weaponPositions[2].x, weaponPositions[2].y);
                this.weaponSelectionImage.draw(ctx, 1);
            }
        }
        
        // Method to draw the weapons
        this.drawWeapons = (ctx) => {
            this.armImage.draw(ctx, 1);
            this.slowPistolImage.draw(ctx, 1);
        };
        
        // Method to draw the abilities signs
        this.drawAbilities = (ctx) => {
            const damageX = (canvasWidth / 2) - 125;
            const habilitiesWidth = 25;
            const habilitiesHeight = 30;

            const resistanceX = (canvasWidth / 2) - 65;
            const doubleJumpX = (canvasWidth / 2) - 123;
            const dashX =  (canvasWidth / 2) - 95;
            
            const temporaryAbilitiesY = canvasHeight - 72;
            const permanentAbilitiesY = canvasHeight - 45;

            ctx.drawImage(this.damageImage, damageX, temporaryAbilitiesY, habilitiesWidth, habilitiesHeight);
            ctx.drawImage(this.resistanceImage, resistanceX, temporaryAbilitiesY, habilitiesWidth, habilitiesHeight);
            
            if (game.player.canDoubleJump) {
                ctx.drawImage(this.doubleJumpImage, doubleJumpX, permanentAbilitiesY, habilitiesWidth, habilitiesHeight);
            }
            
            if (game.player.canDash) {
                ctx.drawImage(this.dashImage, dashX, permanentAbilitiesY, habilitiesWidth, habilitiesHeight);
            }
        }
        
        console.log(`############ LEVEL ${level} START ###################`);
    }

    // Start the cinematic sequence
    startCinematic() {
        this.state = 'cinematic';
        selectMusicMenus('cinematic');
        // Start the cinematic timer
        this.cinematicTimer = setTimeout(() => {
            this.startGame();
        }, 30000); // 30 seconds
    }

    // Skip the cinematic sequence
    skipCinematic() {
        if (this.state === 'cinematic') {
            // Skip the cinematic and start the game
            this.cinematicSkipped = true;
            clearTimeout(this.cinematicTimer);
            this.startGame();
            // start music
            selectMusic(level, this.levelNumber, 'playing');
        }
    }

    // Pause the game
    pauseGame() {
        this.state = 'paused';
        console.log("Game paused");
        this.chronometer.pause();
    }

    // Resume the game
    resumeGame() {
        this.state = 'playing';
        console.log("Game resumed");
        this.chronometer.start();
    }

    // Start the game for the first time
    startGame() {
        this.state = 'playing';
        console.log("Game started");
        this.chronometer.reset();
        this.chronometer.start();
        // Start music
        selectMusic(level, this.levelNumber, 'playing');
    }

    // Add projectiles to the game
    addProjectile(projectile) {
        if(projectile.type === 'enemy') {
            this.enemiesProjectiles.push(projectile);
        } else {
            this.projectiles.push(projectile);
        }
    }

    // Remove projectiles from the game
    removeProjectile(projectile) {
        if(projectile.type === 'enemy') {
            const index = this.enemiesProjectiles.indexOf(projectile);
            if (index > -1) {
                this.enemiesProjectiles.splice(index, 1);
            }
        } else {
            const index = this.projectiles.indexOf(projectile);
            if (index > -1) {
                this.projectiles.splice(index, 1);
            }
        }
        
    }



    // Function to load a specific level
    moveToLevel(levelNumber, playerPositionX, playerPositionY) {

        // Save the state of the doors of the current level
        this.level.doors.forEach(door => {
            door.savedState = door.isOpen;
        });

        // If the player is in the boss room and wants
        // to move to the next room, the game is finished
        if (rooms.get(this.levelNumber).type === "boss"
            && levelNumber === this.levelNumber + 1) {

            if (level !== 2) {
                this.levelNumber = 0;
                restartRooms(false, ++level, 6);
                selectMusic(level, this.levelNumber, 'playing');
                return;
            } else {
                console.log("You win");
                this.state = 'win';
                // Pause the chronometer
                this.chronometer.pause();
                selectMusicMenus('win');
                // Update the player state
                this.player.firstTimePlaying = false;
                this.levelNumber = 0;
                return;
            }
        }

        // Create the new level
        this.level = new Level(GAME_LEVELS[levelNumber]);
        this.levelNumber = levelNumber;
        this.level.player = this.player;
        this.actors = this.level.actors;

        // If the player is in the boss room, update the music
        if (this.levelNumber === 5) {
            selectMusic(level, this.levelNumber, 'playing');
        }

        // Restore the state of the doors of the new level
        this.level.doors.forEach(door => {
            if (door.savedState !== undefined) {
                door.isOpen = door.savedState; // Restore the state of the door
                if (door.isOpen) {
                    door.open(); // Open the door if it was open
                } else {
                    door.close(); // Close the door if it was closed
                }
            }
        });
    
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

        // Adjust the difficulty of the enemies
        game.adjustDificulty();
    
        console.log("Moved to level " + levelNumber);
    }

    // Get a branch room from from the specified type
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

    // Update the game state
    update(deltaTime) {

        // If the state is any of the following, do not update anything
        if (this.state === 'paused'
            || this.state === 'abilities'
            || this.state === 'gameover'
            || this.state === 'mainMenu'
            || this.state === 'login'
            || this.state === 'options') {
            // Pause the game and do not update anything
            this.chronometer.pause(); // Pause the chronometer
            return;
        }

        // Update the player
        this.player.update(this.level, deltaTime);

        // Update the actors of the level
        for (let actor of this.actors) {
            actor.update(this.level, deltaTime);
        }

        // Update projectiles
        this.projectiles.forEach(projectile => projectile.update(this.level, deltaTime));
        this.enemiesProjectiles.forEach(projectile => projectile.update(this.level, deltaTime));

        // Update player bars
        this.playerHealthBar.update(this.player.health, this.player.maxHealth);
        this.playerXpBar.update(this.player.xp, this.player.xpToNextLevel);

        // A copy of the full list to iterate over all of them
        // DOES THIS WORK?
        let currentActors = this.actors;

        // Detect collisions with player
        for (let actor of currentActors) {

            // Update door state
            // .some() returns true if at least one element satisfies the condition
            // ref: https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/some
            // actor => actor.type === 'enemy' is a function that returns true if the actor is an enemy
            // actor.close?.(); is called if the actor has the method
            // ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining
            const hasEnemies = this.actors.some(actor => actor.type === 'enemy' || actor.type === 'boss');
            if (actor.type === 'door'
                || actor.type === 'door_up'
                || actor.type === 'door_down') {
                if (hasEnemies) {
                    actor.close?.(); // Update the state and sprite of doors
                    // Update the ladder signs
                    this.ladderUpImage.setSprite('../../assets/backgrounds/sign_up_1.png');
                    this.ladderDownImage.setSprite('../../assets/backgrounds/sign_down_1.png');
                } else {
                    actor.open?.(); // Update the state and sprite of doors
                    // Update the ladder signs
                    this.ladderUpImage.setSprite('../../assets/backgrounds/sign_up.png');
                    this.ladderDownImage.setSprite('../../assets/backgrounds/sign_down.png');
                }
            }

            // Detect collisions with projectiles
            if (actor.type === 'enemy' || actor.type === 'boss') {
                for (let projectile of this.projectiles) {
                    if (overlapRectangles(projectile, actor)) {
                        actor.takeDamage(game.player.damage); // Deal damage to the enemy
                        this.removeProjectile(projectile); // Remove the projectile
                        break; // Stop checking other projectiles for this actor
                    }
                }
            }

            // Detect collisions with projectiles
            if (this.enemiesProjectiles.length > 0) {   
                for (let projectile of this.enemiesProjectiles) {
                    if (overlapRectangles(projectile, game.player)) {
                        game.player.takeDamage(10); // Deal damage to the enemy
                        this.removeProjectile(projectile); // Remove the projectile
                        break; // Stop checking other projectiles for this actor
                    }
                }
            }

            if (actor.type != 'floor' && overlapRectangles(this.player, actor)) {
                //console.log(`Collision of ${this.player.type} with ${actor.type}`);
                if (actor.type == 'wall') {
                    //console.log("Hit a wall");

                } else if (actor.type == 'coin' && actor.isCollectible) {
                    // Collect the coin
                    this.player.gainXp(Math.floor(actor.xp_value * this.xpMultiplier)); // Gain XP
                    // Remove the coin from the level string
                    GAME_LEVELS[this.levelNumber] = GAME_LEVELS[this.levelNumber].replace('$', '.');
                    // Remove the coin from the actors list
                    this.actors = this.actors.filter(item => item !== actor); // Remove the coin from the actors list

                } else if (actor.type == 'enemy' || actor.type == 'boss') {
                    // If the player is attacking, deal damage to the enemy
                    if (this.player.isAttacking) {
                        actor.takeDamage(this.player.damage, this.player.attackCooldown);
                    }
                    // If the player is not attacking, the enemy deals damage to the player
                    else {
                        this.player.takeDamage(actor.damage);
                    }
                } else if (actor.type == 'spikes') { 
                    if(this.player.isCrouching || this.player.isAttacking) {
                        continue;
                    } else {
                        this.player.takeDamage(10); // Player takes 10 damage
                    }
                
                }  else if (actor.type == 'door' && actor.isOpen) {
                    
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

                } else if (actor.type == 'button' && !actor.isPressed) {
                    actor.press(); // Press the button
                    console.log("Boss room opened");
                }
            }
        }
    }

    // Draw the game on the canvas
    draw(ctx, scale) {
        // If the game is in cinematic or win state, draw the respective images
        // Ignore the rest of the game
        if (this.state === 'cinematic') {
            this.labelSkip.draw(ctx, "Presiona ESPACIO para omitir");
            this.cinematicImage.draw(ctx, 1);
            return;
        }
        else if (this.state === 'win') {
            this.winImage.draw(ctx, 1);
            return;
        }

        // First draw the background tiles
        for (let actor of this.actors) {
            if (actor.type === 'floor' || actor.type === 'wall') {
                actor.draw(ctx, scale);
            }
        }

        // Assign the tutorial image depending on the level
        if (level == 0) {
            this.tutorial1Image.setSprite('../../assets/backgrounds/tutorial1.png');
            this.tutorial2Image.setSprite('../../assets/backgrounds/tutorial2.png');
        } else if (level == 1) {
            this.tutorial1Image.setSprite('../../assets/backgrounds/tutorial3.png');
            this.tutorial2Image.setSprite('../../assets/backgrounds/tutorial4.png');
        } else {
            this.tutorial1Image.setSprite('../../assets/backgrounds/tutorial5.png');
            this.tutorial2Image.setSprite('../../assets/backgrounds/tutorial6.png');
        }

        // Draw the tutorial images
        if (rooms.get(this.levelNumber).type === "start") {
            this.tutorial1Image.draw(ctx, 1);
        }
        else if (rooms.get(this.levelNumber).type === "second") {
            this.tutorial2Image.draw(ctx, 1);
        }

        // Draw the ladders signs
        // If the player can only go up
        if (rooms.get(this.levelNumber).type === "ladder1"
            || rooms.get(this.levelNumber).type === "branch2") {
            this.ladderUpImage.draw(ctx, 1);
        }
        // If the player can go up and down
        if (rooms.get(this.levelNumber).type === "ladder2") {
            this.ladderUpImage.draw(ctx, 1);
            this.ladderDownImage.draw(ctx, 1);
        }
        // If the player can only go down
        if (rooms.get(this.levelNumber).type === "branch1"
            || rooms.get(this.levelNumber).type === "button") {
            this.ladderDownImage.draw(ctx, 1);
        }
    
        // Then draw the rest of the actors
        for (let actor of this.actors) {
            if (actor.type !== 'floor' && actor.type !== 'wall') {
                actor.draw(ctx, scale);

                // Draw health bar for enemies
                if (actor.type === 'enemy' || actor.type === 'boss') {
                    actor.drawHealthBar(ctx, scale);
                }
            }
        }

        // Draw the player on top of everything else
        this.player.draw(ctx, scale);

        // Draw the projectiles
        this.projectiles.forEach(projectile => projectile.draw(ctx, scale));
        this.enemiesProjectiles.forEach(projectile => projectile.draw(ctx, scale));

        // Draw the player bars
        this.playerHealthBar.draw(ctx);
        this.playerXpBar.draw(ctx);
        
        //Draw the weapon backgrounds
        this.drawBackgrounds(ctx);

        // Draw the health potion
        this.potionImage.draw(ctx, 1);
        
        // Draw the weapons of the UI
        if (this.player.id === null && this.player.firstTimePlaying) {
            if (level === 0) {
                if (this.player.gunWeapon === null) {
                    this.slowPistolImage.setSprite('../../../Videojuego/assets/objects/gun_1_locked.png');
                } else {
                    this.slowPistolImage.setSprite('../../../Videojuego/assets/objects/gun_1.png');
                }
            } else if (level === 1) {
                this.slowPistolImage.setSprite('../../../Videojuego/assets/objects/gun_1.png');
            } else {
                this.slowPistolImage.setSprite('../../../Videojuego/assets/objects/gun_2.png');
                this.armImage.setSprite('../../../Videojuego/assets/objects/melee_2.png');
            }
        } else {
            this.slowPistolImage.setSprite('../../../Videojuego/assets/objects/gun_2.png');
            this.armImage.setSprite('../../../Videojuego/assets/objects/melee_2.png');
        }
        // Check if the player is logged in
        if (this.player.id !== null) {
            if (this.player.firstTimePlaying) {
                if (level === 0) {
                    this.armImage.setSprite('../../../Videojuego/assets/objects/melee_1.png');
                    if (this.player.gunWeapon === null) {
                        this.slowPistolImage.setSprite('../../../Videojuego/assets/objects/gun_1_locked.png');
                    } else {
                        this.slowPistolImage.setSprite('../../../Videojuego/assets/objects/gun_1.png');
                    }
                } else if (level === 1) {
                    this.armImage.setSprite('../../../Videojuego/assets/objects/melee_1.png');
                    this.slowPistolImage.setSprite('../../../Videojuego/assets/objects/gun_1.png');
                } else {
                    this.slowPistolImage.setSprite('../../../Videojuego/assets/objects/gun_2.png');
                    this.armImage.setSprite('../../../Videojuego/assets/objects/melee_2.png');
                }
            } else {
                this.armImage.setSprite('../../../Videojuego/assets/objects/melee_2.png');
                this.slowPistolImage.setSprite('../../../Videojuego/assets/objects/gun_2.png');
            }
        }
        this.drawWeapons(ctx);

        // Draw the abilities
        this.drawAbilities(ctx);

        // Draw the labels
        this.labelHP.draw(ctx, `${this.player.health} / ${this.player.maxHealth}`);
        this.labelXP.draw(ctx, `${this.player.xp} / ${this.player.xpToNextLevel}`);
        this.labelLife.draw(ctx, `HP: ${this.player.health}`);
        this.labelLevel.draw(ctx, `LVL: ${this.player.level}`);
        this.labelDamage.draw(ctx, `${this.player.damage}`);
        this.labelResistance.draw(ctx, `${this.player.resistance}`);

        // Draw the minimap and chronometer
        this.topRightMenu.draw(ctx);

        // Draw menus and popups
        if (this.state === 'paused') {
            // Pause the game and do not update anything
            this.pauseMenu.draw(ctx);
        } else if (this.state === 'abilities') {
            // Draw the level up menu
            game.abilities.show();
        } else if (this.state === 'gameover') {
            // Draw the game over menu
            this.looseMenu.draw(ctx);
        } else if (this.state === 'mainMenu') { 
            // Draw the main menu
            this.mainMenu.draw(ctx);
        } else if (this.state === 'login') {
            // Draw the login menu over the game
            const loginContainer = document.querySelector('.login-container');
            loginContainer.style.display = 'block'; // Show the login container
            // Keep the main menu displayed
            this.mainMenu.draw(ctx);
        }
    }
    
    // Pause or resume the game
    togglePause() {
        this.paused = !this.paused;

        // Update the game state
        this.state = this.paused ? 'paused' : 'playing';

        // Pause or resume game
        if(this.paused){
            this.chronometer.pause();
        } else{
            this.chronometer.start();
        }

        console.log(this.paused ? "Game paused" : "Game resumed");
    }

    // Increase the stats of the enemies depending on the level of the game
    adjustDificulty() {

        // Vairable to increase the stats of the enemies
        let increase;

        // If the player is playing for the first time
        // increase the enemy stats depending on the level
        if (this.player.firstTimePlaying) {
            if (level === 0) {
                increase = 0;
            } else if (level === 1) {
                increase = 20;
            } else if (level === 2) {
                increase = 40;
            }
        } else {
            // The difficulty keeps increasing
            // depending on the level of the player
            increase = this.player.level * 6;
        }

        // Increase the stats of the enemies
        for (let actor of this.level.actors) {
            if (actor.type === 'enemy' || actor.type === 'boss') {
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
          sprite: '',
          rect: new Rect(12, 17, 32, 32)},
    "#": {objClass: GameObject,
          label: "wall",
          sprite: '../../assets/blocks/marble_packed.png',
          rect: new Rect(0, 0, 18, 18)},
    "@": {objClass: Player,
          label: "player",
          sprite: '../../assets/characters/skippy/skippy_1.png',
          rect: new Rect(0, 0, 24, 24), // 24 x 24 Size of each frame
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
    "X": {objClass: BossEnemy,
          label: "boss",
          sprite: '../../assets/characters/enemies/robot_boss.png',
          rect: new Rect(0, 0, 28, 28),
          sheetCols: 8,
          startFrame: [0, 0]},
    "O": {objClass: TurtleEnemy,
          label: "turtle",
          sprite: '../../assets/characters/enemies/tortutron.png',
          rect: new Rect(0, 0, 28, 28),
          sheetCols: 8,
          startFrame : [0, 0]},
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
          label: "box",
          sprite: '../../assets/obstacles/box_1.png',
          rect: new Rect(0, 0, 18, 18)},
    "E": {objClass: GameObject,
            label: "end_pipe",
            sprite: '../../assets/obstacles/pipe_end_2.png',
            rect: new Rect(0, 0, 18, 18)},
    "S":{objClass: GameObject,
            label: "start_pipe",
            sprite: '../../assets/obstacles/pipe_mid_2.png',
            rect: new Rect(0, 0, 18, 18)},
    "P": {objClass: GameObject,
          label: "spikes",
          sprite: '../../assets/obstacles/spikes.png',
          rect: new Rect(0, 0, 18, 18)},
    "L": {objClass: GameObject,
          label: "ladder",
          sprite: '../../assets/interactable/ladder_1.png',
          rect: new Rect(0, 0, 18, 18)},
    "0": {objClass: Button,
          label: "button",
          sprite: '../../assets/interactable/button_off.png',
          rect: new Rect(0, 0, 18, 18)},
    "T": {objClass: GameObject,
          label: "Tutorial",
          sprite: '../../assets/background/tutorial.png',
          rect: new Rect(0, 0, 18, 18)}
};

function main() {
    // Set a callback for when the page is loaded,
    // so that the canvas can be found
    window.onload = init;
}

// Get canvas and start the game
function init() {
    const canvas = document.getElementById('canvas');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    ctx = canvas.getContext('2d');
    // Start the game
    gameStart();
}

// Start the game for the first time
function gameStart() {
    // Set the global variable of level to 0
    level = 0;

    // List of generated levels
    generateLevel(6) // Generate level with 6 rooms

    // Register the game object, which creates all other objects
    game = new Game('mainMenu', new Level(GAME_LEVELS[0])); //main menu

    game.chronometer = new Chronometer(); //initiates chronometer
    game.chronometer.start(); //starts chronometer
    
    setEventListeners();

    // Call the first frame with the current time
    updateCanvas(document.timeline.currentTime);
}

// Generate a new level with new rooms
// Also specify if the player should be restarted or not
// and the number of rooms to generate
function restartRooms(restartPlayer, levelNumber, numRooms) {

    // Update the global variable of level
    level = levelNumber;

    console.log("New rooms for level " + level);

    // Check if the player should be restarted
    let savedPlayer = null;
    let savedChronometer = null;
    if (!restartPlayer) {
        // Save the current player
        savedPlayer = game.player;
        // Save the current chronometer
        savedChronometer = game.chronometer;
    }

    // Check if the player has an id (is logged in)
    let savedId = null;
    if (game.player.id !== null) {
        // Save the player
        savedId = game.player.id;
        savedPlayer = game.player;
    }
    
    // Generate a new set of rooms
    generateLevel(numRooms);

    // Check if the chronometer exists
    if (game.chronometer) {
        game.chronometer.pause(); // stops the current chronometer
    }

    // Create a new game object with the new level
    game = new Game('playing', new Level(GAME_LEVELS[0]));

    // If the player is not restarted
    if (!restartPlayer) {
        // Restore the player
        game.player = savedPlayer;
        // Reset the potion usage
        game.player.hasUsedPotion = false;
        // Update the player sprites
        game.player.updateSprites();
        // Update the player weapons
        game.player.updateWeapons();
        game.player.selectWeapon(game.player.selectedWeapon);
        // Set and start the saved chronometer
        game.chronometer = savedChronometer;
        game.chronometer.start();
        // If the player is back to the first level (he won)
        // reset the player stats
        if (levelNumber === 0) {
            // Reset the player stats
            game.player.health = 100;
            game.player.maxHealth = 100;
            game.player.resistance = 0;
            game.player.xp = 0;
            game.player.xpToNextLevel = 100;
            game.player.level = 0;
            game.player.canDoubleJump = false;
            game.player.canDash = false;
            game.player.damage = 20;
        }
        // Update the player stats
        updatePlayerStats(game.player.id);
    // If the player is restarted
    } else if (restartPlayer) {
        // If the chronometer doesnt exist, create a new one
        if (!game.chronometer) {
            game.chronometer = new Chronometer();
        }
        // Reset and start the chronometer
        game.chronometer.reset();
        game.chronometer.start();

        // If the player was logged in, restore his info
        // This is necesary to keep the player as logged in
        if (savedId !== null) {
            // Restore the id of the player
            game.player.id = savedId;
            // Call an async function to restore
            // the player stats and inventory
            restorePlayerData(savedId);
        }
    }
}

// Async function to call the database and
// restore the player stats and inventory
async function restorePlayerData(savedId) {
    await setPlayerStats(savedId);
    await setPlayerInventory(savedId);
    // Update the player sprites
    game.player.updateSprites();
    // Update the player weapons
    game.player.updateWeapons();
    // Make the player select the weapon he had
    // This is necessary to avoid the player
    // having the default weapon
    game.player.selectWeapon(game.player.selectedWeapon);
}

// Event listeners
function setEventListeners() {
    // Keyboard down event
    window.addEventListener("keydown", event => {
        // Skip the cinematic and prevent player actions
        if (game.state === 'cinematic') {
            // Play the pause music
            if (event.key == ' ') {
                game.skipCinematic();
            }
            return;
        } else if (game.state === 'win') {
            if (event.key == ' ') {
                // Get the time from the chronometer
                const newTime = game.chronometer.checkTime(game.player.bestTime);

                // If the player got a new best time, update it
                if (newTime) {
                    game.player.bestTime = newTime;
                }

                // Update the player stats
                game.player.completedGames++;

                // Update the database if the player is logged in
                if (game.player.id !== null) {
                    updatePlayerStats(game.player.id);
                }

                // Restart the game but keep the player
                restartRooms(false, 0, 6);
                // Restart the chronometer
                game.chronometer.reset();
                game.chronometer.start();
                selectMusic(level, 0, 'playing');
            }
            return;
        } else if (game.state === 'mainMenu') {
            return; // Block all actions
        }

        // Movement
        if (event.code == "KeyW" || event.code == "Space") {
            game.player.jump();
            if (game.player.isJumping) {
                game.player.doubleJump();
            }
        }
        if (event.code == "KeyA") {
            game.player.startMovement("left");
        }
        if (event.code == "KeyD") {
            game.player.startMovement("right");
        }
        if (event.code == "KeyS") {
            game.player.crouch();
        }

        // Dash
        if(event.shiftKey){
            game.player.dash(game.level, deltaTime);
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
        if (event.code == 'KeyP' || event.code == 'Escape') {
            game.state = 'paused';
            sfx.pause.play(); // Play the pause sound
            selectMusicMenus('paused')
            // Update the player stats in the database
            if (game.player.id !== null) {
                updatePlayerStats(game.player.id);
            }
        }
        
        // Restart the game
        if (event.code == 'KeyR' && game.state === 'playing') {
            restartRooms(true, 0, 6);
            selectMusicMenus('playing');
        }

        // Select weapons or use health potion
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
        // Prevent player actions during the cinematic
        if (game.state === 'cinematic') {
            return; // Block all actions
        }
        
        // Movement
        if (event.code == 'KeyA') {
            game.player.stopMovement("left");
        }
        if (event.code == 'KeyD') {
            game.player.stopMovement("right");
        }
        if (event.code == 'KeyS') {
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

    // Mouse click event
    canvas.addEventListener("click", event => {
        if (game.state === 'mainMenu') {
            const mouseX = getMousePosition(event).x;
            const mouseY = getMousePosition(event).y;
            game.mainMenu.checkClick(mouseX, mouseY);
        }
        if (game.state === 'signUp') {
            const mouseX = getMousePosition(event).x;
            const mouseY = getMousePosition(event).y;
            game.signUpMenu.checkClick(mouseX, mouseY);
        }
        if (game.state === 'paused') {
            const mouseX = getMousePosition(event).x;
            const mouseY = getMousePosition(event).y;
            game.pauseMenu.checkClick(mouseX, mouseY);
        }
        if (game.state === 'gameover') {
            const mouseX = getMousePosition(event).x;
            const mouseY = getMousePosition(event).y;
            game.looseMenu.checkClick(mouseX, mouseY);
        }
        if (game.state === 'abilities') {
            const mouseX = getMousePosition(event).x;
            const mouseY = getMousePosition(event).y;
            game.abilities.checkClick(mouseX, mouseY);
            game.abilities.isSelected = true;
            game.abilities.hide();
            game.chronometer.start(); // Resume the chronometer
            game.state = 'playing'; // Resume the game
        }
    });

    // Mouse move event
    canvas.addEventListener("mousemove", event => {
        if (game.state === 'mainMenu') {
            const mouseX = getMousePosition(event).x;
            const mouseY = getMousePosition(event).y;
            game.mainMenu.checkHover(mouseX, mouseY);
        }
        if( game.state === 'signUp') {
            const mouseX = getMousePosition(event).x;
            const mouseY = getMousePosition(event).y;
            game.signUpMenu.checkHover(mouseX, mouseY);
        }
        if (game.state === 'paused') {
            const mouseX = getMousePosition(event).x;
            const mouseY = getMousePosition(event).y;
            game.pauseMenu.checkHover(mouseX, mouseY);
        }
        if (game.state === 'gameover') {
            const mouseX = getMousePosition(event).x;
            const mouseY = getMousePosition(event).y;
            game.looseMenu.checkHover(mouseX, mouseY);
        }
        if (game.state === 'abilities') {
            const mouseX = getMousePosition(event).x;
            const mouseY = getMousePosition(event).y;
            game.abilities.checkHover(mouseX, mouseY);
        }
    });

    // Login button click event
    // Quit login button
    document.getElementById('backButtonLogin').addEventListener('click', function(event) {
        sfx.click.play(); // Play the click sound
        // Hide the login container after login
        game.state = 'mainMenu';
        // Hide the login container
        const loginContainer = document.querySelector('.login-container');
        loginContainer.style.display = 'none'; // Show the login container
    });
    // Register button
    document.getElementById("registerButton").addEventListener("click", async (event) => {
        // Prevent the page from refreshing
        event.preventDefault();
        
        // Get the values of the username and password fields
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        // Get the login message element
        const loginMessage = document.getElementById("loginMessage");
    
        // Check if the username and password are not empty
        if (username && password) {
            const result = await registerPlayer(username, password);
            if (result) {
                // Change the loginMessage from the container
                loginMessage.textContent = "Sesión iniciada como: " + username;
            } else {
                loginMessage.textContent = "El usuario " + username + " ya existe";
            }
            game.state = "mainMenu";
        } else {
            loginMessage.textContent = "Error al registrarse. Completa todos los campos";
        }

        // Clear the input fields
        document.getElementById("username").value = "";
        document.getElementById("password").value = "";
    });
    // Login button
    document.getElementById("loginButton").addEventListener("click", async (event) => {
        // Prevent the page from refreshing
        event.preventDefault();
        
        // Get the values of the username and password fields
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        // Get the login message element
        const loginMessage = document.getElementById("loginMessage");
    
        // Check if the username and password are not empty
        if (username && password) {
            const result = await getPlayer(username, password);
            if (result) {
                // Change the loginMessage from the container
                loginMessage.textContent = "Sesión iniciada como: " + username;
            } else {
                loginMessage.textContent = "Usuario o contraseña incorrectos";
            }
            game.state = "mainMenu";
        } else {
            loginMessage.textContent = "Error al iniciar sesión. Completa todos los campos";
        }

        // Clear the input fields
        document.getElementById("username").value = "";
        document.getElementById("password").value = "";
    });

    // Options button click event
    // Quit options button
    document.getElementById('backButtonOptions').addEventListener('click', function(event) {
        sfx.click.play(); // Play the click sound
        // Hide the options container
        game.optionsMenu.hide(); // Hide the options menu
    });

    document.getElementById('backButtonStats').addEventListener('click', function(event) {
        sfx.click.play(); // Play the click sound
        // Hide the options container
        game.statsMenu.hide(); // Hide the options menu
    });

    // Stats button click event

    document.getElementById('statsPlayer').addEventListener('click', function(event) {
        sfx.click.play(); // Play the click sound
        getStatistics(game.player.id); 
    });

    document.getElementById('statsGlobal').addEventListener('click', function(event) {
        sfx.click.play(); // Play the click sound
        getGlobalStatistics();
    });

    document.getElementById('statsTop').addEventListener('click', function(event) {
        sfx.click.play(); // Play the click sound
        getTopStatistics();
    });

    // Apply button for the options menu
    document.getElementById('applyButton').addEventListener('click', function(event) {
        // Prevent the page from refreshing
        event.preventDefault();

        // Get the values of the options fields
        const musicSlider = document.getElementById('musicSlider').value;
        const sfxSlider = document.getElementById('sfxSlider').value;

        // Set the new values
        updateVolume(musicSlider, sfxSlider);

        sfx.click.play(); // Play the click sound
    });

    // Update the label for the music slider
    // The input event is triggered when the slider value changes
    musicSlider.addEventListener('input', function () {
        const label = document.querySelector('label[for="musicSlider"]');
        // Update the label and multiply by 100 to get the percentage
        label.textContent = `Volumen Música: ${Math.round(musicSlider.value * 100)}`;
    });

    // Update the label for the SFX slider
    // The input event is triggered when the slider value changes
    sfxSlider.addEventListener('input', function () {
        const label = document.querySelector('label[for="sfxSlider"]');
        // Update the label and multiply by 100 to get the percentage
        label.textContent = `Volumen Efectos: ${Math.round(sfxSlider.value * 100)}`;
    });
}

// Function to get the mouse position in the canvas
function getMousePosition(event) {
    // Get the canvas element
    const rect = canvas.getBoundingClientRect();
    // Get the mouse position in the canvas
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    // Multiply by the scale to get the correct position
    // and subtract the top left corner of the canvas
    const mouseX = (event.clientX - rect.left) * scaleX;
    const mouseY = (event.clientY - rect.top) * scaleY;
    return { x: mouseX, y: mouseY };
}

// Function that will be called for the game loop
function updateCanvas(frameTime) {
    if (frameStart === undefined) {
        frameStart = frameTime;
    }
    deltaTime = frameTime - frameStart;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    game.update(deltaTime);
    game.draw(ctx, scale);

    // Update time for the next frame
    frameStart = frameTime;
    requestAnimationFrame(updateCanvas);
}

// Call the start function to initiate the game
main();