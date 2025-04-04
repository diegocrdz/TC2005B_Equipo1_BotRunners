/*
 * Sound effects for the game
*/

let sfxVolume = 0.5; // Volume for sound effects
let musicVolume = 0.5; // Volume for music

const sfx = {
    // Sound effects
    collect: new Audio("../../assets/sfx/collect.ogg"),
    click: new Audio("../../assets/sfx/menu/click.ogg"),
    pause: new Audio("../../assets/sfx/pause.ogg"),
    gameOver: new Audio("../../assets/sfx/loose.ogg"),
    levelUp: new Audio("../../assets/sfx/levelup.ogg"),
    jump : new Audio("../../assets/sfx/jump.wav"),
    hit : new Audio("../../assets/sfx/click_001.ogg"),
    getHit : new Audio("../../assets/sfx/getHit1.mp3"),
    dash : new Audio("../../assets/sfx/dash.mp3"),
    shoot : new Audio("../../assets/sfx/shoot.ogg"),
    bossDie : new Audio("../../assets/sfx/bossDie.ogg"),
    enemyDie : new Audio("../../assets/sfx/enemyDie3.ogg"),
    button : new Audio("../../assets/sfx/button.wav"),
};

const music = {
    // Background music
    level1: new Audio("../../assets/Sounds/music/level_1.mp3"),
    level2: new Audio("../../assets/Sounds/music/level_2.ogg"),
    level3: new Audio("../../assets/Sounds/music/level_3.ogg"),
    //boss music
    musicBoss1: new Audio ("../../assets/Sounds/music/boss_1.ogg"),
    musicBoss2: new Audio ("../../assets/Sounds/music/boss_2.ogg"),
    musicFinalBoss: new Audio ("../../assets/Sounds/music/final_boss.mp3"),
};

const musicMenus ={
     //menu and pause
     musicPause: new Audio ("../../assets/Sounds/music/pause.ogg"),
     musicMenu: new Audio ("../../assets/Sounds/music/menu.ogg")
}

// Initialize volume
updateVolume(musicVolume, sfxVolume);

// 1. Primero corregir la inicialización del volumen para incluir musicMenus
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

music.level1.loop = true;
music.level2.loop = true;
music.level3.loop = true;
music.musicBoss1.loop = true;
music.musicBoss2.loop = true;
music.musicFinalBoss.loop = true;
musicMenus.musicMenu.loop = true;
musicMenus.musicPause.loop = true;

// Set volume for music 
for (const key in music) {
    music[key].volume = musicVolume;
}

function selectMusic(level, levelNumber, gameState) {
    // Si el juego está pausado, pausar toda la música y retornar
    if(gameState === 'paused' || gameState === 'mainMenu'){
        for (const key in music) {
            music[key].pause();
        }
      
    }

    if (gameState === 'playing') {
        for (const key in musicMenus) {
            musicMenus[key].pause();
        }
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
        }
    }
}

function selectMusicMenus(gameState) {
    for (const key in musicMenus) {
        musicMenus[key].pause();
    }
    
    if (gameState === 'mainMenu') {
        musicMenus.musicMenu.play();
    }
    else if (gameState === 'paused') {
        musicMenus.musicPause.play();
    }
    else if (gameState === 'playing') {
        selectMusic(level, game.levelNumber, 'playing');
    }
}