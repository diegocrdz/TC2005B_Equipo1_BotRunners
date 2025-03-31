/*
 * Implementation of the menu that appears when the game is paused.
*/

class PauseMenu extends GameObject {
    constructor(_color, width, height, x, y, _type) {
        super(_color, width, height, x, y, "minimap");

        this.pauseLabel = new TextLabel(this.size.x / 2 - 100,
                                        this.size.y / 4,
                                        "40px 'Press Start 2P'",
                                        "white");
        
        const buttonWidth = 200;
        const buttonHeight = 50;

        this.buttons = [
            this.continueButton = new MenuButton(_color, buttonWidth, buttonHeight, 0, 0,
                                                "continue", "Continuar"),
            this.restartButton = new MenuButton(_color, buttonWidth, buttonHeight, 0, 0,
                                                "restart", "Reiniciar"),
            this.optionsButton = new MenuButton(_color, buttonWidth, buttonHeight, 0, 0,
                                                "options", "Opciones"),
            this.menuButton = new MenuButton(_color, buttonWidth, buttonHeight, 0, 0,
                                                "menu", "Menú"),
        ];
    }

    draw(ctx) {
        // Draw the background of the pause menu
        ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
        // Fill the entire canvas
        ctx.fillRect(this.position.x, this.position.y, this.size.x, this.size.y);

        // Draw the pause label
        this.pauseLabel.draw(ctx, "PAUSA");

        // Define button positions
        let initialButtonX = this.size.x / 2 - 100;
        let initialButtonY = this.size.y / 3;
        const spacing = 10; // Space between buttons

        for (let i=0; i<this.buttons.length; i++) {
            const button = this.buttons[i];

            // Set the button position based on the index
            button.position.x = initialButtonX;
            button.position.y = initialButtonY + (i * (button.size.y + spacing)); // Add some space between buttons
            
            button.label.x = button.position.x + 10;
            button.label.y = button.position.y + (button.size.y / 2) + 5;

            if (button.isHovered) {
                button.color = "white"; // Change button color on hover
            }
            else {
                button.color = "lightgrey"; // Reset button color
            }

            // Draw the button
            button.draw(ctx);
        }
    }

    // Check if the mouse is inside any button
    checkHover(x, y) {
        // Store the hovered button
        let hoveredButton = null;
        // Check if the mouse is inside any button
        for (const button of this.buttons) {
            const isHovered = button.isMouseInside( x, y);
            button.isHovered = isHovered;
            if (isHovered) {
                hoveredButton = button;
            }
        }
        return hoveredButton;
    }

    // Check if the mouse is clicked on any button
    checkClick(x, y) {
        for (const button of this.buttons) {
            // Check if the mouse is inside the button
            const isClicked = button.isMouseInside(x, y);
            button.isPressed = isClicked;
            if (isClicked) {
                // Call the button action
                this.buttonClicked(button.type);
                // Return the clicked button if needed
                return button;
            }
        }
        // If no button was clicked, return null
        return null;
    }

    // Button click actions
    buttonClicked(buttonType) {
        // Decide what to do based on the button type
        switch (buttonType) {
            case "continue":
                game.togglePause();
                break;
            case "restart":
                game.togglePause();
                restartRooms(true, 0, 6);
                break;
            case "options":
                // game.state = "options";
                break;
            case "menu":
                // game.state = "menu";
                break;
            default:
                break;
        }
    }
}