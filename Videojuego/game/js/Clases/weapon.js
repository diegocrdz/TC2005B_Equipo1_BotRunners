/*
 * Weapons for the game
*/

class Weapon {
    constructor(name, damage, cooldown) {
        this.name = name;
        this.damage = damage;
        this.cooldown = cooldown;

        this.isUnlocked = false;
    }
}

