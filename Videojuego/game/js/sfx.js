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