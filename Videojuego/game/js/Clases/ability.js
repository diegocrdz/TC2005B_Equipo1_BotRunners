/*
 * Abilities for the game
 *
 * Team BotRunners:
 * - Diego Córdova Rodríguez, A01781166
 * - Lorena Estefanía Chewtat Torres, A01785378
 * - Eder Jezrael Cantero Moreno, A01785888
 *
 * Date: 25/04/2025
*/

"use strict";

// Abilities that can be used by the player
class Ability{
    constructor(name, title, description, image){
        this.name = name;
        this.title = title;
        this.description = description;
        this.image = image;
        
        this.isUnlocked = false;
    }

    // Effect of the ability
    effect() {
        if (this.name == "damage") {
            game.player.baseDamage += 5;
            game.player.damage += 5;
        } else if (this.name == "health") {
            let increase = 20;
            let newHealth = game.player.health + increase;
            if (newHealth < game.player.maxHealth) {
                game.player.health += 20;
            } else {
                game.player.health = game.player.maxHealth;
            }
        }
        else if (this.name == "resistance") {
            game.player.resistance += 10;
        }
        else if (this.name == "xp") {
            xpMultiplier += 0.5;
        }
        else if (this.name == "cooldown") {
            game.player.attackCooldown -= 100;
            game.player.shootCooldown -= 100;
        }
        else if (this.name == "doubleJump" && !this.isUnlocked) {
            game.player.canDoubleJump = true;
            this.isUnlocked = true;

            let index = abilitiesList.indexOf(this);
            abilitiesList.splice(index, 1);
        }
        else if (this.name == "dash" && !this.isUnlocked) {
            game.player.canDash = true;
            this.isUnlocked = true;

            let index = abilitiesList.indexOf(this);
            abilitiesList.splice(index, 1);
        }
    }
}

// Global list of abilities
// This list is used to generate the random abilities in the popUpAbility class
let abilitiesList = []

// Function to initialize the abilities list
function initAbilitiesList() {
    // Empty the abilities list
    abilitiesList = [];
    
    // Create abilities
    let ability1 = new Ability(
        'health', 
        'Vida +20', 
        'Recupera 20 puntos de vida', 
        '../../../Videojuego/assets/objects/health.png');

    let ability2 = new Ability(
        'damage',
        'Daño +5',
        'Aumenta tu daño en 5 puntos',
        '../../../Videojuego/assets/objects/ui_damage.png');

    let ability3 = new Ability(
        'resistance',
        'Resistencia +10',
        'Aumenta tu resistencia en 10 puntos',
        '../../../Videojuego/assets/objects/ui_resistance.png');
    
    let ability4 = new Ability(
        'xp',
        'XP+',
        'Los orbes dan más experiencia',
        '../../../Videojuego/assets/objects/xp_orb.png');

    let ability5 = new Ability(
        'cooldown',
        'Recarga',
        'Aumenta la velocidad de ataque de tus armas durante este nivel',
        '../../../Videojuego/assets/objects/melee_1.png');

    let ability6 = new Ability(
        'doubleJump',
        'Doble Salto',
        'Al presionar dos veces W, podrás realizar un segundo salto en el aire!',
        '../../../Videojuego/assets/objects/ui_doublejump.png');

    let ability7 = new Ability(
        'dash',
        'Dash',
        'Al presionar SHIFT o E, podrás desplazarte rápidamente',
        '../../../Videojuego/assets/objects/ui_dash.png');
    
    // Add abilities to the list
    abilitiesList.push(ability1);
    abilitiesList.push(ability2);
    abilitiesList.push(ability3);
    abilitiesList.push(ability4);
    abilitiesList.push(ability5);
    abilitiesList.push(ability6);
    abilitiesList.push(ability7);
}

// Global list of colors
// This list is used to generate the random colors in the popUpAbility class
let colorList = [
    '../../../Videojuego/assets/objects/redcard.png',
    '../../../Videojuego/assets/objects/orangecard.png',
    '../../../Videojuego/assets/objects/yellowcard.png',
    '../../../Videojuego/assets/objects/greencard.png',
    '../../../Videojuego/assets/objects/bluecard.png',
    '../../../Videojuego/assets/objects/purplecard.png'
]

// Define the ability cards for the pop-up menu
class AbilityCard{
    constructor({position, urlSprite, image, title, description, ability}) {
        this.position = position;
        this.urlSprite = urlSprite;
        this.border = '../../../Videojuego/assets/objects/cardborder1.png';
        this.image = image;
        this.title = title;
        this.description = description;
        this.ability = ability; // Reference to the ability object

        this.width = canvasWidth - 610;
        this.height = 320;

        this.isHovered = false;
    }

    // Draw the card with the image and text
    draw() {
        let card1 = new GameObject(null, 
            this.width, // width
            this.height,  // height
             this.position.x + 10, // x
             this.position.y, // y
            'background');
        card1.setSprite(this.urlSprite);
        card1.draw(ctx, 1);


        let card1Image = new GameObject(null, 90, 90, 
            this.position.x + 60, this.position.y + 50, 'background');

        card1Image.setSprite(this.image); 
        card1Image.draw(ctx, 1); 

        let card1Title = new cardTextLabel(this.position.x + 50, this.position.y + 160,
        "17px monospace", "white", 120);
        card1Title.draw(ctx, this.title);

        let card1Description = new cardTextLabel(this.position.x + 40, this.position.y + 200,
                                    "11px monospace", "white", 120);
        card1Description.draw(ctx, this.description);

        
        this.drawBorder();
    }

    // Draw the border of the card if hovered
    drawBorder() {
        let card1Border = new GameObject(null, this.width, this.height,
            this.position.x + 10, this.position.y, 'background');

        card1Border.setSprite(this.border);
        if (this.isHovered) {
            card1Border.draw(ctx, 1);
        } else {
            return;
        }
    }

    // Check if the mouse is inside the card
    isMouseInside(x, y) {
        return x > this.position.x && x < this.position.x + this.width &&
               y > this.position.y && y < this.position.y + this.height;
    }
}

// Class to show the pop-up menu with the abilities
class popUpAbility {
    constructor() {
        this.canBeShown = true;
        this.isGenerated = false;

        this.isSelected = false; // Checks if an ability has been selected

        this.backgroundImage = new GameObject(null, canvasWidth - 120, 415, 
                                            (canvasWidth / 2) - 340, (canvasHeight / 4) - 100, 'background');
        this.backgroundImage.setSprite('../../../Videojuego/assets/objects/cardbackground.png');

        this.randomAbilities = [];  // Array of random abilities
        this.randomColors = []; // Array of random colors
        this.abilityCards = []; // Array of ability cards
        
    }

    generateAbilities() { // Generates a random set of abilities
        if (this.isGenerated) {
            return; // If it's already generated, do nothing
        }

        this.randomAbilities = []; // Resets the random abilities
        this.randomColors = []; // Resets the random colors
        this.abilityCards = []; // Resets the ability cards
        let i = 0; // Index 

        // Loop to generate 3 random abilities and colors
        while (this.randomAbilities.length < 3) {
            // Random number between 0 and the length of the abilities list
            let randomA =  Math.floor(Math.random() * abilitiesList.length);
            // Random number between 0 and the length of the colors list
            let randomC;
        
            // Do-while loop to ensure the color is unique in each iteration, 
            // Also, since each ability needs a color inmediately and we can't
            // skip it like we can do with the abilities
            do { 
                randomC = Math.floor(Math.random() * colorList.length);
            //wWhile the color is already in the array and the array is less than 3
            } while (this.randomColors.includes(colorList[randomC]) && this.randomColors.length < 3);
            
            this.randomColors.push(colorList[randomC]);

            if(!this.randomAbilities.includes(abilitiesList[randomA])){
                this.randomAbilities.push(abilitiesList[randomA]);
                
                // Create the ability card using the attributes of the ability
                this.abilityCards.push(new AbilityCard({position : {x: 95 + 200 * i, y: 100}, 
                    urlSprite: this.randomColors[i], 
                    image: this.randomAbilities[i].image, 
                    title: this.randomAbilities[i].title, 
                    description: this.randomAbilities[i].description,
                    ability : this.randomAbilities[i]
                }));
                i++;
            }
        }
        // Sets the isGenerated to true so it doesn't generate again
        this.isGenerated = true;
    }

    // Show the pop-up menu
    show(){
        if(this.canBeShown){
            if (this.isGenerated) {
                // Draw the background of the pause menu
                ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
                // Fill the entire canvas
                ctx.fillRect(0, 0, canvasWidth, canvasHeight);
                
                this.backgroundImage.draw(ctx, 1);
    
                for(let i = 0; i < this.abilityCards.length; i++){
                    this.abilityCards[i].draw();
                }
            }
        }
    }

    // Hide the pop-up menu
    hide(){
        this.canBeShown = false;
        this.isSelected = false;
    }   

    // Activate the pop-up menu
    activate(){
        if (!this.canBeShown) {
            this.canBeShown = true;
        }
        
        this.isGenerated = false; // allows to generate a new set of abilities

        this.generateAbilities();
    }

    
    // Check if the mouse is clicked on any button
    checkClick(x, y) {
        for (const AbilityCard of this.abilityCards) {
            // Check if the mouse is inside the button
            const isClicked = AbilityCard.isMouseInside(x, y);
            if (isClicked) {
                sfx.click.play(); // Play the click sound
                // Call the button action
                AbilityCard.ability.effect(); // Call the effect of the ability
                // Return the clicked button if needed
            }
        }
    }

    // Check if the mouse is clicked on any button
    checkHover(x, y) {
        for (const AbilityCard of this.abilityCards) {
            // Check if the mouse is inside the button
            const isHovered = AbilityCard.isMouseInside(x, y);
            if (isHovered) {
                AbilityCard.isHovered = true; // Set the hovered state to true
            } else {
                AbilityCard.isHovered = false; // Set the hovered state to false
            }
        }
    }
}