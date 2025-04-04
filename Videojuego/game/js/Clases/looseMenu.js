/*
 * Implementation of the menu that appears when the player dies
*/

class LooseMenu extends GameObject {
    constructor(_color, width, height, x, y, _type) {
        super(_color, width, height, x, y, "loosemenu");

        this.gameOverLabel = new TextLabel(this.size.x / 2 - 160,
                                        this.size.y / 4 + 50,
                                        "40px 'Press Start 2P'",
                                        "white");
        
        const buttonWidth = 200;
        const buttonHeight = 50;

        this.buttons = [
            this.retryButton = new MenuButton(_color, buttonWidth, buttonHeight, 0, 0,
                                                "retry", "Reintentar", "black", "black"),
            this.menuButton = new MenuButton(_color, buttonWidth, buttonHeight, 0, 0,
                                                "menu", "Menú", "black", "black"),
        ];
    }

    draw(ctx) {
        // Draw the background of the pause menu
        ctx.fillStyle = "rgba(53, 19, 19, 0.9)";
        // Fill the entire canvas
        ctx.fillRect(this.position.x, this.position.y, this.size.x, this.size.y);

        // Draw the pause label
        this.gameOverLabel.draw(ctx, "PERDISTE");

        // Define button positions
        let initialButtonX = this.size.x / 2 - 100;
        let initialButtonY = this.size.y / 3 + 50;
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
                sfx.click.play(); // Play the click sound
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
            case "retry":
                restartRooms(true, 0, 6);
                break;
            case "menu":
                restartRooms(true, 0, 6);
                game.state = "mainMenu";
                selectMusic(this.level, this.levelNumber, 'mainMenu')
                break;
            default:
                break;
        }
    }
}