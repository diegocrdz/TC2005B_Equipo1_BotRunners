class Weapon {
    constructor(player) {
        this.player = player;
        this.projectileSpeed = 0.05;
    }

    shoot() {
        const direction = this.player.isFacingRight ? 1 : -1;
        const projectile = new Projectile(
            this.player.position.x,
            this.player.position.y,
            direction * this.projectileSpeed
        );
        game.addProjectile(projectile);
    }
}

class Projectile {
    constructor(x, y, speed) {
        this.position = new Vec(x, y);
        this.speed = speed;
        this.sprite = new Image();
        this.sprite.src = '../../assets/objects/xp_orb.png';
        this.damage = 50;
        this.size = new Vec(1, 1); // Adjust size as needed
    }

    update(deltaTime) {
        this.position.x += this.speed * deltaTime;
        this.checkCollision();
    }

    draw(context) {
        context.drawImage(this.sprite, this.position.x, this.position.y);
    }

    checkCollision() {
        game.enemies.forEach(enemy => {
            if (this.position.x < enemy.position.x + enemy.size.x &&
                this.position.x + this.size.x > enemy.position.x &&
                this.position.y < enemy.position.y + enemy.size.y &&
                this.position.y + this.size.y > enemy.position.y) {
                enemy.takeDamage(this.damage);
                game.removeProjectile(this);
            }
        });
    }
}