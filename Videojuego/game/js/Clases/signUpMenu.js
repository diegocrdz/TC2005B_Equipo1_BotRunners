/*
 * Implementation of the menu that appears when the game is paused.
 *
 * Team BotRunners:
 * - Diego Córdova Rodríguez, A01781166
 * - Lorena Estefanía Chewtat Torres, A01785378
 * - Eder Jezrael Cantero Moreno, A01785888
 *
 * Date: 04/04/2025
*/

// Class that represents the sign in and sign up menu
// This menu was implemented to allow the player to sign in
// but later translated to a HTML element
// It is still here in case we need it for future reference
"use strict";
class SignUpMenu extends GameObject {
    constructor(_color, width, height, x, y, _type) {
        super(_color, width, height, x, y, "minimap");

        this.background = new GameObject(null, canvasWidth, canvasHeight, 0, 0, 'background');
        this.background.setSprite('../../assets/backgrounds/signupbackground.png');

        this.signUpLabel = new TextLabel(this.size.x / 2 - 278,
            this.size.y / 4,
            "40px 'Press Start 2P'",
            "#272b36");
        
        const buttonWidth = 300;
        const buttonHeight = 50;

        this.buttons = [
            this.usernameButton = new MenuButton(null, buttonWidth, buttonHeight, 0, 0,
                                                    "username", "Usuario", "white", "#c1cad6"),
            this.passwordButton = new MenuButton(null, buttonWidth, buttonHeight, 0, 0,
                                                    "password", "Contraseña", "white", "#c1cad6"),
            this.signUpButton = new MenuButton(null, buttonWidth, buttonHeight, 0, 0,
                                                    "signUp", "Iniciar Sesión", "white", "#c1cad6"),
            this.registerButton = new MenuButton(null, buttonWidth, buttonHeight, 0, 0,
                                                    "register", "Registrarse", "white", "#c1cad6"),
        ];

        this.returnButton  = new MenuButton(null, 200, buttonHeight, 30, canvasHeight - 80,
                                                    "return", "Regresar", "white", "#c1cad6");
    }

    draw(ctx) {
        this.background.draw(ctx, 1); // Draw the background
        // Draw the pause label
        this.signUpLabel.draw(ctx, 'INICIAR SESIÓN');
        this.returnButton.draw(ctx); // Draw the return button

        // Define button positions
        let initialButtonX = this.size.x / 2 - 150;
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
                button.color = "#272b36"; // Reset button color
            }

            // Draw the button
            button.draw(ctx);
        }

        if (this.returnButton.isHovered) {
            this.returnButton.borderColor = "white"; // Change button color on hover
            this.returnButton.textColor = "white"; // Change text color on hover
            
        }
        else {
            this.returnButton.borderColor = "#c1cad6"; // Change button color on hover
            this.returnButton.textColor = "#c1cad6";
            this.returnButton.color = "#272b36"; // Reset button color
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
    
        const isHovered = this.returnButton.isMouseInside( x, y);
        this.returnButton.isHovered = isHovered;
        if (isHovered) {
            hoveredButton = this.returnButton;
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
        const isClicked = this.returnButton.isMouseInside( x, y);
        this.returnButton.isPressed = isClicked;
        if (isClicked) {
            this.buttonClicked(this.returnButton.type);
        }
        // If no button was clicked, return null
        return null;
    }

    // Button click actions
    buttonClicked(buttonType) {
        // Decide what to do based on the button type
        switch (buttonType) {
            case "signUp":
                break;
            case "register":
                break;
            case "return":
                game.state = "mainMenu";
                break;
            default:
                break;
        }
    }
}