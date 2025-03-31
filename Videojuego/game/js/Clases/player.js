/*
 * Implementation of the player of the game
*/

// The project works only with very small values for velocities and acceleration
const walkSpeed = 0.01;
const initialJumpSpeed = -0.03;
const gravity = 0.0000981;

class Player extends AnimatedObject {
    constructor(_color, width, height, x, y, _type) {
        super("green", width, height, x, y, "player");
        this.velocity = new Vec(0.0, 0.0);

        this.njumps = 0; //counter for double jumping

        // Player state variables
        this.isFacingRight = true;
        this.isJumping = false;
        this.isCrouching = false;
        this.isAttacking = false;
        this.isShooting = false;
        this.isHit = false;

        // Double jump
        this.canDoubleJump = false;
        this.isDoubleJumping = false;

        // Dash
        this.canDash = false;
        this.isDashing =  false;

        // Player selection
        // By default, the player has the first weapon selected
        this.selectedWeapon = 1; // 1: sword, 2: gun
        this.hasUsedPotion = false;
        this.isPressingUp = false;
        this.isPressingDown = false;

        // Player properties
        this.health = 100;
        this.maxHealth = 100;
        this.damage = 20;
        this.resistance = 0;
        this.xp = 0;
        this.xpToNextLevel = 100;
        this.level = 0;
        this.attackCooldown = 400;
        this.shootCooldown = 400;

        // Movement variables to define directions and animations
        this.movement = {
            right:  { status: false,
                      axis: "x",
                      sign: 1,
                      repeat: true,
                      duration: 100,
                      moveFrames: [2, 3],
                      idleFrames: [0, 1] },
            left:   { status: false,
                      axis: "x",
                      sign: -1,
                      repeat: true,
                      duration: 100,
                      moveFrames: [13, 14],
                      idleFrames: [11, 12] },
            jump:   { status: false,
                      repeat: true,
                      duration: 100,
                      right: [4, 5],
                      left: [15, 16] },
            crouch: { status: false,
                      repeat: true,
                      duration: 100,
                      right: [6, 7],
                      left: [17, 18],
                      upRight: [0, 1],
                      upLeft: [11, 12] },
            attack: { status: false,
                        repeat: false,
                        duration: 20,
                        right: [0, 1],
                        left: [2, 3] },
            hit:    { status: false,
                        repeat: false,
                        duration: 50,
                        right: [10, 10],
                        left: [21, 21] }
        };

        // Hitbox properties
        this.offsetX = 0.5;
        this.offsetY = 1;
        this.hWidth = this.size.x + 1;
        this.hHeight = this.size.y + 1;
    }

    update(level, deltaTime) {
        // Update the hitbox
        this.setHitbox(this.offsetX, this.offsetY, this.hWidth, this.hHeight);

        // Make the character fall constantly because of gravity
        this.velocity.y = this.velocity.y + gravity * deltaTime;

        // New variables for the velocity of the player
        let velX = this.velocity.x;
        let velY = this.velocity.y;

        // Find out where the player should end if it moves
        let newXPosition = this.position.plus(new Vec(velX * deltaTime, 0)); // d = v * t
        // Move only if the player does not move inside a wall
        if (!level.contact(newXPosition, this.size, 'wall')
            && (!level.contact(newXPosition, this.size, 'box'))) {
            this.position = newXPosition;
        }

        // Find out where the player should end if it moves
        let newYPosition = this.position.plus(new Vec(0, velY * deltaTime)); // d = v * t
        // Move only if the player does not move inside a wall
        if (!level.contact(newYPosition, this.size, 'wall')
            && (!level.contact(newYPosition, this.size, 'box'))) {
            this.position = newYPosition;
        } else {
            this.land(); 
        }

        this.updateFrame(deltaTime);
    }

    draw(ctx, scale) {
        super.draw(ctx, scale);
        this.drawHitbox(ctx, scale);
    }

    // Start moving the player in a certain direction
    startMovement(direction) {
        const dirData = this.movement[direction];
        this.isFacingRight = direction == "right"; // Check if the direction is right

        if (!dirData.status) { // If the player is not already moving
            dirData.status = true;
            this.velocity[dirData.axis] = dirData.sign * walkSpeed; // Set the velocity

            if (this.isHit) { // If the player is hit, keep the hit animation
                this.hit();
            }
            else if (this.isCrouching) { // If the player is crouching, keep crouching
                this.crouch();
            }
            else {
                this.setAnimation(...dirData.moveFrames, dirData.repeat, dirData.duration);
            }
        }
    }

    stopMovement(direction) {
        const dirData = this.movement[direction];
        dirData.status = false;
        this.velocity[dirData.axis] = 0;
        this.setAnimation(...dirData.idleFrames, dirData.repeat, 100);
    }

    crouch() {
        this.isCrouching = true;
        const crouchData = this.movement.crouch;
        if (this.isFacingRight) {
            this.setAnimation(...crouchData.right, crouchData.repeat, crouchData.duration);
        } else {
            this.setAnimation(...crouchData.left, crouchData.repeat, crouchData.duration);
        }
    }

    standUp () {
        this.isCrouching = false;
        const crouchData = this.movement.crouch;
        if (this.isFacingRight) {
            this.setAnimation(...crouchData.upRight, crouchData.repeat, crouchData.duration);
        } else {
            this.setAnimation(...crouchData.upLeft, crouchData.repeat, crouchData.duration);
        }
    }

    jump() {
        if (!this.isJumping) {
            // Give a velocity so that the player starts moving up
            this.velocity.y = initialJumpSpeed;
            this.isJumping = true;
            const jumpData = this.movement.jump;
            if (this.isFacingRight) {
                this.setAnimation(...jumpData.right, jumpData.repeat, jumpData.duration);
            } else {
                this.setAnimation(...jumpData.left, jumpData.repeat, jumpData.duration);
            }
        }
    }

    doubleJump(){
        if(this.njumps < 1 && this.canDoubleJump){ //Lets the player only jump two times
            this.isJumping = false;
            this.jump;
            this.njumps++;
        }    
    }

    land() {
        // If the character is touching the ground,
        // there is no vertical velocity
        this.velocity.y = 0;
        // Force the player to move down to touch the floor
        this.position.y = Math.ceil(this.position.y);
        if (this.isJumping) {
            // Reset the jump variable
            this.isJumping = false;
            this.njumps = 0;
            const leftData = this.movement["left"];
            const rightData = this.movement["right"];
            // Continue the running animation if the player is moving
            if (leftData.status) {
                this.setAnimation(...leftData.moveFrames, leftData.repeat, leftData.duration);
            } else if (rightData.status) {
                this.setAnimation(...rightData.moveFrames, rightData.repeat, rightData.duration);
            // Otherwise switch to the idle animation
            } else {
                if (this.isFacingRight) {
                    this.setAnimation(...rightData.idleFrames, rightData.repeat, rightData.duration);
                } else {
                    this.setAnimation(...leftData.idleFrames, leftData.repeat, leftData.duration);
                }
            }
        }
    }

    dash(level) {
        if(this.canDash){
            if (!this.isDashing) {
                this.isDashing = true;
                this.canDash = false;
                
                let dashDistance = 5; // Total dash distance
                let direction = this.isFacingRight ? 1 : -1; //Defines the direction of the dash
                let step = 0.2; // Number of pixels that move in each frame
                let moved = 0; // Tracks how many pixels the player has moved
        
                let dashMove = () => {
                    if (moved < dashDistance) {
                        let newXPosition = this.position.plus(new Vec(direction * step, 0)); //Calculates new position
        
                        // If there's a collision, the dash stops
                        if (level.contact(newXPosition, this.size, 'wall')
                            || (level.contact(newXPosition, this.size, 'box'))) {
                            this.isDashing = false;
                            return;
                        }
        
                        this.position = newXPosition;
                        moved += step;
        
                        requestAnimationFrame(dashMove); //Continues the dash "animation" in the next frame
                    }
                };
        
                dashMove(); //initiates animated dash
                
                setTimeout(() => {
                    this.isDashing = false;
                    this.canDash = true;
                }, 5000); // 5 second cooldown
            }
        }
    }

    attack() {
        if (this.isAttacking) return;

        this.isAttacking = true;
        const attackData = this.movement.attack;
        let originalSize = this.size.x;

        // Change to the attack sprite and rect
        this.setSprite('../../assets/characters/skippy/skippy_attack_1.png', new Rect(0, 0, 32, 24));
        this.size.x = 4; // Adjust the size to match the new sprite

        // Save the original hitbox size and position
        let originalHWidth = this.hWidth;
        let originalOffsetX = this.offsetX;

        // Change hitbox size
        this.hWidth += 2;

        if (this.isFacingRight) {
            this.setAnimation(...attackData.right, attackData.repeat, attackData.duration);
        } else {
            this.setAnimation(...attackData.left, attackData.repeat, attackData.duration);
            // Move the hitbox to the left
            this.offsetX -= 1;
        }

        setTimeout(() => {
            this.isAttacking = false;
            this.size.x = originalSize; // Adjust the size to match the new sprite
            // Restore the original sprite and rect
            this.setSprite('../../assets/characters/skippy/skippy_1.png', new Rect(0, 0, 24, 24));
            // Restore hitbox size and position
            this.hWidth = originalHWidth;
            this.offsetX = originalOffsetX;
            // Restore the animation to idle
            const leftData = this.movement["left"];
            const rightData = this.movement["right"];
            if (this.isFacingRight) {
                this.setAnimation(...rightData.idleFrames, rightData.repeat, rightData.duration);
            } else {
                this.setAnimation(...leftData.idleFrames, leftData.repeat, leftData.duration);
            }
        }, this.attackCooldown);
    }

    shoot() {
        if (this.selectedWeapon !== 2 || this.isShooting) return;

        this.isShooting = true;
        let attackData = this.movement.attack;

        // Adjust the attack animation data for the projectile
        attackData.right = [8, 9];
        attackData.left = [19, 20];

        // Crear el proyectil
        let projectile = new Projectile("blue", 1, 1,
                                        this.position.x + 1.5,
                                        this.position.y + 1.8,
                                        "projectile",
                                        this.isFacingRight ? "right" : "left");

        game.addProjectile(projectile);

        if (this.isFacingRight) {
            this.setAnimation(...attackData.right, attackData.repeat, attackData.duration);
        }
        else {
            this.setAnimation(...attackData.left, attackData.repeat, attackData.duration);
        }

        // Cooldown for the animation
        setTimeout(() => {
            // Restore the original attack data
            attackData.right = [0, 1];
            attackData.left = [2, 3];
            // Restore the animation to idle
            const leftData = this.movement["left"];
            const rightData = this.movement["right"];
            if (this.isFacingRight) {
                this.setAnimation(...rightData.idleFrames, rightData.repeat, rightData.duration);
            } else {
                this.setAnimation(...leftData.idleFrames, leftData.repeat, leftData.duration);
            }
        }, attackData.duration);

        // Cooldown for shooting
        setTimeout(() => {
            this.isShooting = false;
        }, this.shootCooldown);
    }

    takeDamage(amount) {
        if (this.isInvulnerable) return; // Dashing makes you invulnerable

        // If the player is dashing, cancel the dash and activate invulnerability for 1 second
        if (this.isDashing) {
            this.isDashing = false;
            this.isInvulnerable = true;
            setTimeout(() => {
                this.isInvulnerable = false;
            }, 1000); // Cooldown period of 1 second
            return; // Prevent taking damage after dashing
        }

        this.health -= amount + this.resistance; // Reduce health by the damage amount
        this.hit();

        if (this.health <= 0) {
            this.die();
        } else {
            this.isInvulnerable = true;
            setTimeout(() => {
                this.isInvulnerable = false;
            }, 1000); // Cooldown period of 1 second
        }
    }

    gainXp(amount) {
        this.xp += amount;
        if (this.xp >= this.xpToNextLevel) {
            this.level++;
            this.xp = 0;
            this.xpToNextLevel += 15;
            
            game.abilities.activate();
            game.state = "abilities";
        }
    }

    die() {
        console.log("Player died");
        restartRooms(true, 0, 6);
    }

    hit() {
        if (this.isHit) return; // Prevent re-triggering the hit animation if already playing
    
        this.isHit = true;
        const hitData = this.movement.hit;
    
        if (this.isFacingRight) {
            this.setAnimation(...hitData.right, hitData.repeat, hitData.duration);
        } else {
            this.setAnimation(...hitData.left, hitData.repeat, hitData.duration);
        }
    
        // Reset the isHit flag after the animation duration
        setTimeout(() => {
            this.isHit = false;
        }, hitData.duration);
    }

    selectWeapon(number) {
        let lastWeapon = this.selectedWeapon;
        if (number === 1) {
            this.selectedWeapon = 1;
            this.setSprite('../../assets/characters/skippy/skippy_1.png', new Rect(0, 0, 24, 24));
        } else if (number === 2) {
            this.selectedWeapon = 2;
            this.setSprite('../../assets/characters/skippy/skippy_3.png', new Rect(0, 0, 24, 24));
        } else if (number === 3) {
            this.selectedWeapon = 3;
            setTimeout(() => {
                this.selectWeapon(lastWeapon);
            }, 250);
        }
    }

    useHealthPotion() {
        if (!this.hasUsedPotion && this.health < 100) {

            let increase = (this.maxHealth * 50) / 100; // Calculate 50% of the max health

            this.health += increase; // Increase health
            if (this.health > this.maxHealth) {
                this.health = this.maxHealth; // Cap health at the max value
            }
            this.hasUsedPotion = true; // Mark the potion as used
            game.potionImage.setSprite('../../assets/objects/battery_empty.png');
        }
    }
}