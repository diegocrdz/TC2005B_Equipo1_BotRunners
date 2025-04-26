/*
 * Implementation of the HTML menus
 *
 * Team BotRunners:
 * - Diego Córdova Rodríguez, A01781166
 * - Lorena Estefanía Chewtat Torres, A01785378
 * - Eder Jezrael Cantero Moreno, A01785888
 *
 * Date: 25/04/2025
*/

"use strict";

// Class for HTML menus
class HTMLMenu {
    constructor(containerId) {
        // Get the canvas element
        this.container = document.querySelector(containerId);
    }

    // Show the menu
    show() {
        this.container.style.display = 'block';
    }

    // Hide the menu
    hide() {
        this.container.style.display = 'none';
    }
}