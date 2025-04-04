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