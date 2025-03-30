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
            this.continueButton = new MenuButton("white", buttonWidth, buttonHeight, 0, 0, "continueButton", "Continuar"),
            this.restartButton = new MenuButton("white", buttonWidth, buttonHeight, 0, 0, "restartButton", "Reiniciar"),
            this.menuButton = new MenuButton("white", buttonWidth, buttonHeight, 0, 0, "menuButton", "Menú"),
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

            // Draw the button
            button.draw(ctx);
        }
    }
}