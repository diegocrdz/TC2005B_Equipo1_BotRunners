class PauseMenu extends GameObject {
    constructor(_color, width, height, x, y, _type) {
        super(_color, width, height, x, y, "minimap");

        this.pauseLabel = new TextLabel(this.size.x / 2 - 60, this.size.y / 4, "40px monospace", "white");
    }

    draw(ctx) {
        // Draw the background of the pause menu
        ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
        // Fill the entire canvas
        ctx.fillRect(this.position.x, this.position.y, this.size.x, this.size.y);

        // Draw the pause label
        this.pauseLabel.draw(ctx, "PAUSED");
    }
}