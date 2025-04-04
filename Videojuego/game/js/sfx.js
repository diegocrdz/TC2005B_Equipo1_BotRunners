/*
 * Sound effects for the game
*/

const sfxVolume = 0.2; // Volume for sound effects
const musicVolume = 0.5; // Volume for music

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
    enemyDie : new Audio("../../assets/sfx/enemyDie1.wav"),
    button : new Audio("../../assets/sfx/button.wav"),
};

// Set volume for sound effects
for (const key in sfx) {
    sfx[key].volume = sfxVolume;
}