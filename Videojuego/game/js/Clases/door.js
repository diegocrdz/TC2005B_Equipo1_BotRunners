class Door extends GameObject {
    constructor(_color, width, height, x, y, _type, direction) {
        super("brown", width, height, x, y, "door");

        this.isOpen = false; // Doors are open by default
        this.direction = direction; // Left or right
        // The savedState is used by the game to keep
        // track of the doors opened/closed when moving
        // between levels
        this.savedState = this.isOpen; 
    }

    close() {
        this.isOpen = false;
        this.savedState = this.isOpen;
        this.setSprite('../../assets/interactable/door_closed.png', new Rect(0, 0, 18, 18));
    }

    open() {
        // If the button hasnt been pressed, dont open
        if (this.direction === "right" // If the door leads to the right
            && rooms.get(game.levelNumber + 1).type === "boss" // If the next room is the boss room
            && !game.isButtonPressed) { // If the button hasnt been pressed
            return;
        }

        this.isOpen = true;
        this.savedState = this.isOpen;
        this.setSprite('../../assets/interactable/door_open.png', new Rect(0, 0, 18, 18));
    }
}