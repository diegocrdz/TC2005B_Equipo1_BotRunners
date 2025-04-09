/*
 * Implementation of the main menu of the game
 *
 * Team BotRunners:
 * - Diego Córdova Rodríguez, A01781166
 * - Lorena Estefanía Chewtat Torres, A01785378
 * - Eder Jezrael Cantero Moreno, A01785888
 *
 * Date: 04/04/2025
*/

// Define the main menu for the game
class MainMenu extends GameObject {
    constructor(_color, width, height, x, y, _type) {
        super(_color, width, height, x, y, "minimap");

        this.background = new GameObject(null, canvasWidth, canvasHeight, 0, 0, 'background');
        this.background.setSprite('../../assets/backgrounds/mainMenu.png');

        this.title =  new GameObject(null, 515, 100, canvasWidth / 2 - 255, canvasHeight / 4 - 70, 'title');
        this.title.setSprite('../../docs/img/logo_overclocked.png');
        
        const buttonWidth = 200;
        const buttonHeight = 50;

        this.buttons = [
            this.playButton = new MenuButton(null, buttonWidth, buttonHeight, 0, 0,
                                                "play", "Jugar", "#c1cad6", "#c1cad6"),
            this.optionsButton = new MenuButton(null, buttonWidth, buttonHeight, 0, 0,
                                                "options", "Opciones", "#c1cad6", "#c1cad6"),
            this.statisticsButton = new MenuButton(null, buttonWidth, buttonHeight, 0, 0,
                                                "statistics", "Estadísticas", "#c1cad6", "#c1cad6"),
            this.signUpButton = new MenuButton(null, buttonWidth, buttonHeight, 0, 0,
                                                "login", "Iniciar Sesión", "#c1cad6", "#c1cad6"),
        ];
    }

    draw(ctx) {
        this.background.draw(ctx, 1); // Draw the background

        // Draw the pause label
        this.title.draw(ctx, 1);

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
                button.borderColor = "white"; // Change button color on hover
                button.textColor = "white"; // Change text color on hover
                
            }
            else {
                button.borderColor = "#c1cad6"; // Change button color on hover
                button.textColor = "#c1cad6";
                button.color = "#5A5D8B"; // Reset button color
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
            case "play":
                game.startCinematic();
                break;
            case "options":
                game.optionsMenu.show();
                break;
            case "statistics":
                game.statsMenu.show();
                if (game.player.id!=null) {
                    getStatistics(game.player.id); 
                } 
                break;
            case "login":
                game.state = "login";
                break;
            default:
                break;
        }
    }
}