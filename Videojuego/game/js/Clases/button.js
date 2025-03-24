class Button extends GameObject {
    constructor(_color, width, height, x, y, _type) {
        super("blue", width, height, x, y, "button");

        this.setSprite('../../assets/interactable/button_off.png',
                        new Rect(0, 0, 18, 18));
        this.isPressed = false;
    }  

    press() {
        this.isPressed = true;
        this.setSprite('../../assets/interactable/button_on.png',
                        new Rect(0, 0, 18, 18));
        // Update the game state to reflect the button being pressed
        // this is used to determine if the door that leads to
        // the boss room should be opened
        game.isButtonPressed = true;
    }
}