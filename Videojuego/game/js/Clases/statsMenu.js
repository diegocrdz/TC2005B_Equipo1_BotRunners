/*
 * Implementation of the options menu
 *
 * Team BotRunners:
 * - Diego Córdova Rodríguez, A01781166
 * - Lorena Estefanía Chewtat Torres, A01785378
 * - Eder Jezrael Cantero Moreno, A01785888
 *
 * Date: 24/04/2025
*/

"use strict";

// Define the menu that appears when the player presses the options button
class StatsMenu extends GameObject {
    constructor(_color, width, height, x, y, _type) {
        super(_color, width, height, x, y, "options");

        // Get the canvas element
        this.statsContainer = document.querySelector('.stats-container');
    }

    show() {
        // Show the options menu
        this.statsContainer.style.display = 'block';
    }

    hide() {
        // Hide the options menu
        this.statsContainer.style.display = 'none';
    }
}