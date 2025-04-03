/*
 * Sound effects for the game
*/

const sfxVolume = 0.5; // Volume for sound effects
const musicVolume = 0.5; // Volume for music

const sfx = {
    // Sound effects
    collect: new Audio("../../assets/sfx/collect.ogg"),
    click: new Audio("../../assets/sfx/menu/click.ogg"),
    pause: new Audio("../../assets/sfx/pause.ogg"),
    gameOver: new Audio("../../assets/sfx/loose.ogg"),
    levelUp: new Audio("../../assets/sfx/levelup.ogg"),
};

// Set volume for sound effects
for (const key in sfx) {
    sfx[key].volume = sfxVolume;
}

const music = {
      //Level music:
      level1: new Audio('../../../Videojuego/assets/Sounds/music/level_1.mp3'),
      level2: new Audio('../../../Videojuego/assets/Sounds/music/level_2.ogg'),
      level3: new Audio('../../../Videojuego/assets/Sounds/music/level_3.ogg'),
      //boss music:
      musicBoss1: new Audio('../../../Videojuego/assets/Sounds/music/boss_1.ogg'),
      musicBoss2: new Audio('../../../Videojuego/assets/Sounds/music/boss_2.ogg'),
      musicFinalBoss: new Audio('../../../Videojuego/assets/Sounds/music/final_boss.mp3'),
      //menus
      musicMenu: new Audio('../../../Videojuego/assets/Sounds/music/menu.ogg'),
      musicPause: new Audio('../../../Videojuego/assets/Sounds/music/pause.ogg')
}

// Set volume for music 
for (const key in music) {
    music[key].volume = musicVolume;
}