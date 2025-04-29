/*
 * Implementation of the player of the game
 *
 * Team BotRunners:
 * - Diego Córdova Rodríguez, A01781166
 * - Lorena Estefanía Chewtat Torres, A01785378
 * - Eder Jezrael Cantero Moreno, A01785888
 *
 * Date: 24/04/2025
*/

"use strict";

// Global variables that affect the player movement
// The project works only with very small values for velocities and acceleration
const walkSpeed = 0.01;
const initialJumpSpeed = -0.03;
const gravity = 0.0000981;

// Class that defines the player of the game
class Player extends AnimatedObject {
    constructor(_color, width, height, x, y, _type) {
        super("green", width, height, x, y, "player");
        this.velocity = new Vec(0.0, 0.0);

        // Database elements
        this.id = null;
        this.bestTime = "00:00:00"; // HH:MM:SS SQL TIME format
        this.deaths = 0;
        this.enemiesKilled = 0;
        this.outgoingDamage = 0;
        this.receivedDamage = 0;
        this.completedGames = 0;
        this.meleeCont = 0;
        this.gunCont = 0;

        // Buffs
        this.buffsApplied = 0;
        
        this.njumps = 0; //counter for double jumping

        // Player state variables
        this.isFacingRight = true;
        this.isJumping = false;
        this.isCrouching = false;
        this.isAttacking = false;
        this.isShooting = false;
        this.isHit = false;
        this.firstTimePlaying = true;
        this.isDoubleJumping = false;
        this.isDashing =  false;

        // Player selection
        // By default, the player has the first weapon selected
        this.selectedWeapon = 1; // 1: sword, 2: gun
        this.hasUsedPotion = false;
        this.isPressingUp = false;
        this.isPressingDown = false;

        // Weapon properties
        this.meleeWeapon = weapons.arm,
        this.gunWeapon = null,
        // Check if the weapons should be updated
        this.updateWeapons();

        // Sprite images for the player
        this.meleeSprite = null;
        this.gunSprite = null;
        this.attackSprite = null;
        // Set the sprite for the player
        this.updateSprites();

        // Player properties
        this.health = 100;
        this.maxHealth = 100;
        this.resistance = 0;
        this.xp = 0;
        this.xpToNextLevel = 100;
        this.level = 0;
        this.canDoubleJump = false;
        this.canDash = true;
        this.damage = 20;
        this.baseDamage = 20;

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
        this.offsetY = 0.9;
        this.hWidth = this.size.x + 0.6;
        this.hHeight = this.size.y + 1;
    }

    update(level, deltaTime) {
        // Update the hitbox
        if (!this.isAttacking) {
            if (this.isFacingRight) {
                this.offsetX = 0.5;
    
            } else {
                this.offsetX = 0.9;
            }
        }
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
            // If the player collides with the ground, stop moving down
            if (this.velocity.y > 0) {
                this.land(); 
            } else {
                // If the player collides with the ceiling, stop moving up
                this.velocity.y = 0;
            }
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

            // If the player is attacking, the sprite sheet changes to the attack sprite
            // To prevent the player switching to an invalid animation
            // The player animation doesnt change while attacking
            if (this.isAttacking) {
                return;
            }
            else if (this.isHit) { // If the player is hit, keep the hit animation
                this.hit();
            }
            else if (this.isCrouching) { // If the player is crouching, keep crouching
                this.crouch();
            }
            else {
                if (!this.isHit) {
                    this.setAnimation(...dirData.moveFrames, dirData.repeat, dirData.duration);
                }
            }
        }
    }

    // Stop moving the player
    stopMovement(direction) {
        const dirData = this.movement[direction];
        dirData.status = false;
        this.velocity[dirData.axis] = 0;
        // Avoid switching animations while attacking
        if (this.isAttacking) {
            return;
        } else {
            if (!this.isHit) {
                this.setAnimation(...dirData.idleFrames, dirData.repeat, 100);
            }
        }
    }

    // Make the player crouch
    crouch() {
        this.isCrouching = true;
        const crouchData = this.movement.crouch;
        // Avoid switching animations while attacking
        if (this.isAttacking) {
            return;
        } else if (this.isFacingRight) {
            this.setAnimation(...crouchData.right, crouchData.repeat, crouchData.duration);
        } else {
            if (!this.isHit) {
                this.setAnimation(...crouchData.left, crouchData.repeat, crouchData.duration);
            }
        }
    }

    // Make the player stand up after crouching
    standUp () {
        this.isCrouching = false;
        const crouchData = this.movement.crouch;
        if (this.isFacingRight) {
            this.setAnimation(...crouchData.upRight, crouchData.repeat, crouchData.duration);
        } else {
            if (!this.isHit) {
                this.setAnimation(...crouchData.upLeft, crouchData.repeat, crouchData.duration);
            }
        }
    }

    // Make the player jump one time
    jump() {
        if (!this.isJumping) {
            // Give a velocity so that the player starts moving up
            this.velocity.y = initialJumpSpeed;
            this.isJumping = true;
            const jumpData = this.movement.jump;
            sfx.jump.play(); // Play the jump sound
            if (this.isAttacking || this.isHit) {
                return;
            } else if (this.isFacingRight) {
                this.setAnimation(...jumpData.right, jumpData.repeat, jumpData.duration);
            } else {
                this.setAnimation(...jumpData.left, jumpData.repeat, jumpData.duration);
            }
        }
    }

    // Make the player jump a second time
    doubleJump(){
        if(this.njumps < 1 && this.canDoubleJump){ //Lets the player only jump two times
            this.isJumping = false;
            this.jump;
            this.njumps++;
        }    
    }

    // Make the player land on the ground after jumping
    land() {
        // If the character is touching the ground,
        // there is no vertical velocity
        this.velocity.y = 0;
        // Force the player to move down to touch the floor
        this.position.y = Math.ceil(this.position.y);
        // If the player is hit, keep the hit animation
        if (this.isHit) return;

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

    // Make the player dash in a certain direction
    dash(level, deltaTime) {
        if(this.canDash && !this.isDashing){
            // The player cant dash while already dashing
            this.isDashing = true;
            this.canDash = false;
            
            // Total dash distance
            let dashDistance = 5
            // Define the direction of the dash
            let direction = this.isFacingRight ? 1 : -1;
            // Speed of the dash
            let dashSpeed = 0.05;
            // Tracks how much the player has moved
            let moved = 0;
            // Calculates the step size based on the speed and delta time
            let step = dashSpeed * deltaTime;

            // Function to move the player during the dash
            let dashMove = () => {
                
                // If the player has moved less than the dash distance
                if (moved < dashDistance) {
                    //Calculates new position
                    let newXPosition = this.position.plus(new Vec(direction * step, 0));
    
                    // If there's a collision, the dash stops
                    if (level.contact(newXPosition, this.size, 'wall')
                        || (level.contact(newXPosition, this.size, 'box'))) {
                        this.isDashing = false;
                        return;
                    }
                    
                    // Move the player
                    this.position = newXPosition;
                    moved += step;
                    
                    // Continues the dash "animation" in the next frame
                    requestAnimationFrame(dashMove);
                }
            };
    
            dashMove(); // Initiates animated dash
            sfx.dash.play(); // Play the dash sound

            // Create particles for the dash effect
            new Particle(
                "gray", 10, 10,
                this.position.x,
                this.position.y,
                "particle");
            
            // Set a timeout to reset the dash state
            setTimeout(() => {
                this.isDashing = false;
                this.canDash = true;
            }, 2000);
        }
    }
    
    // Make the player attack with the melee weapon
    attack() {
        if (this.isAttacking) return;

        this.isAttacking = true;
        const attackData = this.movement.attack;

        // Change to the attack sprite and rect
        this.setSprite(this.attackSprite, new Rect(0, 0, 32, 24));
        this.size.x = 4; // Adjust the size to match the new sprite

        // Change hitbox size
        let hitboxWidth = 2.4;
        this.hWidth += hitboxWidth;

        if (this.isFacingRight) {
            this.setAnimation(...attackData.right, attackData.repeat, attackData.duration);
            // Move the hitbox to the right
            this.offsetX = 0.5;
        } else {
            this.setAnimation(...attackData.left, attackData.repeat, attackData.duration);
            // Move the hitbox to the left
            this.offsetX = -0.4;
        }

        // Update hit counter
        this.meleeCont++;

        setTimeout(() => {
            this.isAttacking = false;
            this.size.x = 3; // Adjust the size to match the new sprite
            // Restore the original sprite and rect
            this.setSprite(this.meleeSprite, new Rect(0, 0, 24, 24));
            // Restore hitbox size and position
            this.hWidth -= hitboxWidth;
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

    // Make the player shoot with the gun
    shoot() {
        if (this.selectedWeapon !== 2 || this.isShooting) return;

        this.isShooting = true;
        let attackData = this.movement.attack;
        sfx.shoot.play(); // Play the shoot sound

        // Adjust the attack animation data for the projectile
        attackData.right = [8, 9];
        attackData.left = [19, 20];

        // Crear el proyectil
        let projectile = new Projectile("blue", 1, 1,
                                        this.position.x + 1.5,
                                        this.position.y + 1.65,
                                        "projectile",
                                        this.isFacingRight ? "right" : "left");

        projectile.type = "player"; // Set the type of the projectile

        game.addProjectile(projectile);

        if (this.isFacingRight) {
            this.setAnimation(...attackData.right, attackData.repeat, attackData.duration);
        }
        else {
            this.setAnimation(...attackData.left, attackData.repeat, attackData.duration);
        }

        // Update hit counter
        this.gunCont++;

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

    // Make the player take damage from enemies or spikes
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
        sfx.getHit.play(); // Play the hit sound
        this.hit();

        if (this.health <= 0) {
            this.die();
        } else {
            this.isInvulnerable = true;
            setTimeout(() => {
                this.isInvulnerable = false;
            }, 1000); // Cooldown period of 1 second
        }

        // Update the player statistics
        this.receivedDamage += amount;
    }

    // Make the player gain experience points
    gainXp(amount) {
        // Increase the xp
        this.xp += amount;
        sfx.collect.play();
    
        // While the player has enough xp to level up
        while (this.xp >= this.xpToNextLevel) {
            // Reduce the xp by the amount needed to level up
            this.xp -= this.xpToNextLevel;
            this.level++;
            this.xpToNextLevel += 15;
    
            sfx.levelUp.play();

            game.abilities.activate();
            game.state = "abilities";

            // Show the event message
            game.eventLabel.show("¡Subiste de nivel! Usa el ratón para elegir una habilidad.");
        }
    }

    // Make the player die and reset the game
    die() {
        // Reset the health to 0
        this.health = 0;
        game.playerHealthBar.currentValue = 0;
        // Play the game over sound
        sfx.gameOver.play();
        // Update the player statistics
        this.deaths++;
        // Update the database
        if (this.id) {
            updatePlayerStats(this.id);
        }
        game.state = "gameover";
        // Play the game over music
        selectMusicMenus('gameover');
    }

    // Make the player play the hit animation
    hit() {
        if (this.isHit) return; // Prevent re-triggering the hit animation if already playing
        
        this.isAttacking = false;
        this.isCrouching = false;
        this.isShooting = false;
        this.isDashing = false;
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

            // Restore the original animation to idle
            const leftData = this.movement["left"];
            const rightData = this.movement["right"];
            if (this.isFacingRight) {
                this.setAnimation(...rightData.idleFrames, rightData.repeat, rightData.duration);
            } else {
                this.setAnimation(...leftData.idleFrames, leftData.repeat, leftData.duration);
            }
        }, 200);
    }

    // Update the weapons based on the level
    updateWeapons() {
        // If the player is not logged in
        if (this.id === null) {
            // If the player is not playing for the first time
            // Set the weapons to the better ones
            if (!this.firstTimePlaying) {
                this.meleeWeapon = weapons.roboticArm;
                this.gunWeapon = weapons.fast_gun;
            // If the player is playing for the first time,
            // Set the weapons based on the level
            } else if (this.firstTimePlaying) {
                if (level === 0) {
                    this.meleeWeapon = weapons.arm;
                    this.gunWeapon = null;
                } else if (level === 1) {
                    this.meleeWeapon = weapons.arm;
                    this.gunWeapon = weapons.slow_gun;
                } else {
                    this.meleeWeapon = weapons.roboticArm;
                    this.gunWeapon = weapons.fast_gun;
                }
            }
        }
        
        // If the player is logged in
        if (this.id !== null) {
            // If the player is not playing for the first time
            // Set his weapons from the database
            if (!this.firstTimePlaying) {
                this.attackCooldown = this.meleeWeapon.cooldown;
                this.shootCooldown = this.gunWeapon.cooldown;
                return;
            // If the player is playing for the first time
            // Set the weapons based on the level
            } else if (this.firstTimePlaying) {
                if (level === 0) {
                    this.meleeWeapon = weapons.arm;
                    this.gunWeapon = null;
                } else if (level === 1) {
                    this.meleeWeapon = weapons.arm;
                    this.gunWeapon = weapons.slow_gun;
                } else {
                    this.meleeWeapon = weapons.roboticArm;
                    this.gunWeapon = weapons.fast_gun;
                }
            }
        }
        // Set the cooldowns for the weapons
        this.attackCooldown = this.meleeWeapon.cooldown;
        this.shootCooldown = this.gunWeapon ? this.gunWeapon.cooldown : weapons.slow_gun.cooldown;
    }

    // Update the sprites based on the level and first time playing
    updateSprites() {
        // If the player is not logged in
        if (this.id === null) {
            // If the player is not playing for the first time
            // Set the sprites to the better ones
            if (!this.firstTimePlaying) {
                this.meleeSprite = '../../assets/characters/skippy/skippy_2.png';
                this.gunSprite = '../../assets/characters/skippy/skippy_4.png';
                this.attackSprite = '../../assets/characters/skippy/skippy_attack_2.png';
            // If the player is playing for the first time,
            // Update the sprites based on the level
            } else {
                if (level === 0 || level === 1) {
                    this.meleeSprite = '../../assets/characters/skippy/skippy_1.png';
                    this.gunSprite = '../../assets/characters/skippy/skippy_3.png';
                    this.attackSprite = '../../assets/characters/skippy/skippy_attack_1.png';
                } else {
                    this.meleeSprite = '../../assets/characters/skippy/skippy_2.png';
                    this.gunSprite = '../../assets/characters/skippy/skippy_4.png';
                    this.attackSprite = '../../assets/characters/skippy/skippy_attack_2.png';
                }
            }
        }
        
        // If the player is logged in
        if (this.id !== null) {
            // If the player is not playing for the first time
            // Set the sprites to the weapons he has from the database
            if (!this.firstTimePlaying) {
                // Melee weapon
                if (this.meleeWeapon === weapons.arm) {
                    this.meleeSprite = '../../assets/characters/skippy/skippy_1.png';
                    this.attackSprite = '../../assets/characters/skippy/skippy_attack_1.png';
                } else {
                    this.meleeSprite = '../../assets/characters/skippy/skippy_2.png';
                    this.attackSprite = '../../assets/characters/skippy/skippy_attack_2.png';
                }
                // Gun weapon
                if (this.gunWeapon === weapons.slow_gun || this.gunWeapon === null) {
                    this.gunSprite = '../../assets/characters/skippy/skippy_3.png';
                } else {
                    this.gunSprite = '../../assets/characters/skippy/skippy_4.png';
                }
            // If the player is playing for the first time
            // Set the based on the level
            } else {
                if (level === 0 || level === 1) {
                    this.meleeSprite = '../../assets/characters/skippy/skippy_1.png';
                    this.gunSprite = '../../assets/characters/skippy/skippy_3.png';
                    this.attackSprite = '../../assets/characters/skippy/skippy_attack_1.png';
                } else {
                    this.meleeSprite = '../../assets/characters/skippy/skippy_2.png';
                    this.gunSprite = '../../assets/characters/skippy/skippy_4.png';
                    this.attackSprite = '../../assets/characters/skippy/skippy_attack_2.png';
                }
            }
        }
    }

    // Select the weapon to use
    selectWeapon(number) {
        let lastWeapon = this.selectedWeapon;
        // Set the damage to the original value
        let initDamage = 20;

        if (number === 1) {
            this.selectedWeapon = 1;
            this.setSprite(this.meleeSprite, new Rect(0, 0, 24, 24));
            // Set damage
            this.damage = this.baseDamage + this.meleeWeapon.damage;
        } else if (number === 2) {
            // The player cant select the gun in the first level
            // if the player is not playing for the first time
            if (level === 0 && this.firstTimePlaying) {
                game.eventLabel.show("No has desbloqueado la pistola");
                return;
            }
            this.selectedWeapon = 2;
            this.setSprite(this.gunSprite, new Rect(0, 0, 24, 24));
            // Set damage
            this.damage = this.baseDamage + this.gunWeapon.damage;
        } else if (number === 3) {
            this.selectedWeapon = 3;
            setTimeout(() => {
                this.selectWeapon(lastWeapon);
            }, 250);
        }
    }

    // Use the health potion to heal the player
    useHealthPotion() {
        if (!this.hasUsedPotion && this.health < this.maxHealth) {

            let increase = (this.maxHealth * 50) / 100; // Calculate 50% of the max health

            this.health += increase; // Increase health
            if (this.health > this.maxHealth) {
                this.health = this.maxHealth; // Cap health at the max value
            }
            this.hasUsedPotion = true; // Mark the potion as used
            game.potionImage.setSprite('../../assets/objects/battery_empty.png');

            sfx.heal.play();
            game.eventLabel.show("Vida restaurada");
        }
    }

    // Apply a buff to the player after defeating a certain number of enemies
    applyBuff() {
        // Parameters fot the buff
        const killsForBuff = 5;
        const maxBuffs = 10;
        const extraHealthPerBuff = 5;

        // Calculate the number of buffs earned based on the number of enemies killed
        // If the player has exceeded the maximum number of buffs, set it to the maximum
        // Otherwise, calculate the number of buffs earned based on the kills
        const buffsEarned = Math.min(Math.floor(this.enemiesKilled / killsForBuff), maxBuffs);

        // Check if there are buffs to apply
        if (buffsEarned > this.buffsApplied) {
            // Calculate the extra health to add based on the number of buffs earned
            const newBuffs = buffsEarned - this.buffsApplied;
            const healthToAdd = newBuffs * extraHealthPerBuff;
            
            // Increase the player health and max health
            this.health += healthToAdd;
            this.maxHealth += healthToAdd;
            this.buffsApplied = buffsEarned;
            
            // Show the event message
            game.eventLabel.show(`¡Has derrotado a ${this.enemiesKilled} enemigos! Tienes +${healthToAdd} de vida`);
        }
    }
}