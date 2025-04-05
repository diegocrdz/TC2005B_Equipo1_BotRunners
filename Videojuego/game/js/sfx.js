/*
 * Sound effects for the game
 * This file contains the sound effects and music for the game,
 * including global variables for volume and functions to play sounds.
 *
 * Team BotRunners:
 * - Diego Córdova Rodríguez, A01781166
 * - Lorena Estefanía Chewtat Torres, A01785378
 * - Eder Jezrael Cantero Moreno, A01785888
 *
 * Date: 04/04/2025
*/

// Global variables for volume
let sfxVolume = 0.5;
let musicVolume = 0.1;
// Sound effects
const sfx = {
    collect: new Audio("../../assets/Sounds/sfx/collect.ogg"),
    click: new Audio("../../assets/Sounds/sfx/click.ogg"),
    pause: new Audio("../../assets/Sounds/sfx/pause.ogg"),
    gameOver: new Audio("../../assets/Sounds/sfx/loose.ogg"),
    levelUp: new Audio("../../assets/Sounds/sfx/levelup.ogg"),
    jump : new Audio("../../assets/Sounds/sfx/jump.wav"),
    hit : new Audio("../../assets/Sounds/sfx/hit.ogg"),
    getHit : new Audio("../../assets/Sounds/sfx/getHit.mp3"),
    dash : new Audio("../../assets/Sounds/sfx/dash.mp3"),
    shoot : new Audio("../../assets/Sounds/sfx/shoot.ogg"),
    bossDie : new Audio("../../assets/Sounds/sfx/bossDie.ogg"),
    enemyDie : new Audio("../../assets/Sounds/sfx/enemyDie.ogg"),
    button : new Audio("../../assets/Sounds/sfx/button.wav"),
};

// Background music
const music = {
    // Level music
    level1: new Audio("../../assets/Sounds/music/level_1.mp3"),
    level2: new Audio("../../assets/Sounds/music/level_2.ogg"),
    level3: new Audio("../../assets/Sounds/music/level_3.ogg"),
    // Boss music
    musicBoss1: new Audio ("../../assets/Sounds/music/boss_1.ogg"),
    musicBoss2: new Audio ("../../assets/Sounds/music/boss_2.ogg"),
    musicFinalBoss: new Audio ("../../assets/Sounds/music/final_boss.mp3"),
};

// Music for the menus
const musicMenus ={
    // Menu music
    musicPause: new Audio ("../../assets/Sounds/music/pause.ogg"),
    musicMenu: new Audio ("../../assets/Sounds/music/menu.ogg"),
    musicGameOver: new Audio ("../../assets/Sounds/music/game_over.ogg"),
    musicWin: new Audio ("../../assets/Sounds/music/win.ogg"),
    musicCinematic: new Audio ("../../assets/Sounds/music/cinematic.ogg"),
}

// Initialize volume
updateVolume(musicVolume, sfxVolume);

// Initialize loop for music
for (const key in music) {
    music[key].loop = true;
}
for (const key in musicMenus) {
    musicMenus[key].loop = true;
}

// Function to update the volume of sound effects and music
function updateVolume(musicVolume, sfxVolume) {
    // Update the volume for sfx
    for (const key in sfx) {
        sfx[key].volume = sfxVolume;
    }
    // Update the volume for music
    for (const key in music) {
        music[key].volume = musicVolume;
    }
    // Update volume for menu music
    for (const key in musicMenus) {
        musicMenus[key].volume = musicVolume;
    }
}

// Function to update the music based on the level and game state
function selectMusic(level, levelNumber, gameState) {
    // If the game is paused or in the main menu, pause all music
    if (gameState === 'paused' ||
        gameState === 'mainMenu' ||
        gameState === 'gameover' ||
        gameState === 'win' ||
        gameState === 'cinematic') {
        for (const key in music) {
            music[key].pause();
        }
    }
    // If the game is playing, play the appropriate music based on the level
    else if (gameState === 'playing') {
        // Pause all music before playing the new one
        for (const key in musicMenus) {
            musicMenus[key].pause();
        }
        for (const key in music) {
            music[key].pause();
        }
        // Switch to the appropriate music based on the level and level number
        switch(level) {
            case 0:
                if (levelNumber === 5) {
                    music.musicBoss1.play();
                } else {
                    music.level1.play();
                }
                break;
            case 1:
                if (levelNumber === 5) {
                    music.musicBoss2.play();
                } else {
                    music.level2.play();
                }
                break;
            case 2:
                if (levelNumber === 5) {
                    music.musicFinalBoss.play();
                } else {
                    music.level3.play();
                }
                break;
            default:
                break;
        }
    }
}

// Function to play music for the menus
function selectMusicMenus(gameState) {
    // Pause all music before playing the new one
    for (const key in musicMenus) {
        musicMenus[key].pause();
    }
    for (const key in music) {
        music[key].pause();
    }
    // Play the appropriate music based on the game state
    if (gameState === 'mainMenu') {
        musicMenus.musicMenu.play();
    } else if (gameState === 'paused') {
        musicMenus.musicPause.play();
    } else if (gameState === 'gameover') {
        console.log("Game Over music playing");
        musicMenus.musicGameOver.play();
    } else if (gameState === 'win') {
        musicMenus.musicWin.play();
    } else if (gameState === 'cinematic') {
        musicMenus.musicCinematic.play();
    } else if (gameState === 'playing') {
        selectMusic(level, game.levelNumber, 'playing');
    }
}