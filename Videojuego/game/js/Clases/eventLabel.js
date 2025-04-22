/*
 * Implementation for labels that appear to notify the user of any event
 *
 * Team BotRunners:
 * - Diego Córdova Rodríguez, A01781166
 * - Lorena Estefanía Chewtat Torres, A01785378
 * - Eder Jezrael Cantero Moreno, A01785888
 *
 * Date: 04/04/2025
*/

"use strict";

class EventLabel {
    constructor() {
        this.labelContainer = document.getElementById("eventLabel");
        this.duration = 5000;
        // Flag to prevent showing the label on specific events
        this.canBeShown = true;
    }

    show(text) {
        if (!this.canBeShown) { return; } // If the label should not be shown, exit the function

        // If the label is already visible, wait for it to hide before showing it again
        if (this.labelContainer.classList.contains("show")) {
            this.hide();
            setTimeout(() => {
                this.show(text);
            }, 500);
            return;
        }

        // Set the text of the label
        this.labelContainer.textContent = text;

        // Add the show class to trigger the css animation
        this.labelContainer.classList.add("show");

        // Automatically hide the label
        setTimeout(() => {
            this.hide();
        }, this.duration);
    }

    hide() {
        // Remove the show class to trigger the css animation
        this.labelContainer.classList.remove("show");
        this.canBeShown = true; // Allow the label to be shown again
    }
}