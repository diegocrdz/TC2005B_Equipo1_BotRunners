class Door extends GameObject {
    constructor(_color, width, height, x, y, _type) {
        super("brown", width, height, x, y, "door");

        this.isOpen = true; // Doors are open by default
    }

    close() {
        this.isOpen = false;
        this.setSprite('../../assets/interactable/door_closed.png', new Rect(0, 0, 18, 18));
    }

    open() {
        this.isOpen = true;
        this.setSprite('../../assets/interactable/door_open.png', new Rect(0, 0, 18, 18));
    }
}