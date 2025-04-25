/*
 * Implementation of backgrounds for the game
 *
 * Team BotRunners:
 * - Diego Córdova Rodríguez, A01781166
 * - Lorena Estefanía Chewtat Torres, A01785378
 * - Eder Jezrael Cantero Moreno, A01785888
 *
 * Date: 24/04/2025
*/

"use strict";

// Backgrounds for the game
const backgrounds = {
    0: [
        "../../assets/backgrounds/level1/1.png",
        "../../assets/backgrounds/level1/2.png",
        "../../assets/backgrounds/level1/3.png",
        "../../assets/backgrounds/level1/4.png",
        "../../assets/backgrounds/level1/5.png",
        "../../assets/backgrounds/level1/6.png",
        "../../assets/backgrounds/level1/7.png",
        "../../assets/backgrounds/level1/8.png",
        "../../assets/backgrounds/level1/9.png",
        "../../assets/backgrounds/level1/10.png"
    ],
    1: [
        "../../assets/backgrounds/level2/1.png",
        "../../assets/backgrounds/level2/2.png",
        "../../assets/backgrounds/level2/3.png",
        "../../assets/backgrounds/level2/4.png",
        "../../assets/backgrounds/level2/5.png",
        "../../assets/backgrounds/level2/6.png",
        "../../assets/backgrounds/level2/7.png",
        "../../assets/backgrounds/level2/8.png",
        "../../assets/backgrounds/level2/9.png",
        "../../assets/backgrounds/level2/10.png"
    ],
    2: [
        "../../assets/backgrounds/level3/1.png",
        "../../assets/backgrounds/level3/2.png",
        "../../assets/backgrounds/level3/3.png",
        "../../assets/backgrounds/level3/4.png",
        "../../assets/backgrounds/level3/5.png",
        "../../assets/backgrounds/level3/6.png",
        "../../assets/backgrounds/level3/7.png",
        "../../assets/backgrounds/level3/8.png",
        "../../assets/backgrounds/level3/9.png",
        "../../assets/backgrounds/level3/10.png"
    ]
}

// Function to get a random background for a level
function getRandomBackground(level) {
    // Get a random background from the specified level
    let index = Math.floor(Math.random() * backgrounds[level].length);
    // Return the random background
    return backgrounds[level][index];
}