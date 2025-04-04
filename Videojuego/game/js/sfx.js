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
};

// Initialize volume
updateVolume(musicVolume, sfxVolume);

function updateVolume(musicVolume, sfxVolume) {
    // Update the volume for sfx
    for (const key in sfx) {
        sfx[key].volume = sfxVolume;
    }
    // Update the volume for music
    for (const key in music) {
        music[key].volume = musicVolume;
    }
}