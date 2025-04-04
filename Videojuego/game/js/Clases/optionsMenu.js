/*
 * Implementation of the options menu
*/

class OptionsMenu extends GameObject {
    constructor(_color, width, height, x, y, _type) {
        super(_color, width, height, x, y, "options");

        // Get the canvas element
        this.optionsContainer = document.querySelector('.options-container');
    }

    show() {
        // Show the options menu
        this.optionsContainer.style.display = 'block';
    }

    hide() {
        // Hide the options menu
        this.optionsContainer.style.display = 'none';
    }
}