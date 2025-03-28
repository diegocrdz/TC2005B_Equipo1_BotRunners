class Ability{
    constructor(name, title, description, image){
        this.name = name;
        this.title = title;
        this.description = description;
        this.image = image;
        
        this.isUnlocked = false;
    }

    effect(){
        if (this.name == "damage")
            {
                game.player.damage += 10;
                console.log("Damage increased to " + game.player.damage);
            }
            else if(this.name == "health")
            {
                game.player.maxHealth += 10;
                console.log("Max health increased to " + game.player.maxHealth);
            }
            else if(this.name == "resistance")
            {
                game.player.resistance += 10;
                console.log("Resistance increased to " + game.player.resistance);
            }
            else if(this.name == "doubleJump" && !this.isUnlocked)
            {
                game.player.canDoubleJump = true;
                this.isUnlocked = true;

                let index = abilitiesList.indexOf(this);
                abilitiesList.splice(index, 1);
                console.log("Double jump ability gained");
            }
            else if(this.name == "dash" && !this.isUnlocked)
            {
                game.player.canDash = true;
                this.isUnlocked = true;

                let index = abilitiesList.indexOf(this);
                abilitiesList.splice(index, 1);

                console.log("Dash ability gained");
            }
    }
}

let abilitiesList = [
    new Ability('health', 
                'Vida máxima', 
                'Aumenta tu vida máxima 10 puntos', 
                '../../../Videojuego/assets/objects/health.png'),

    new Ability('damage',
                'Daño',
                'Aumenta tu daño en 10 puntos',
                '../../../Videojuego/assets/objects/ui_damage.png'),

    new Ability('resistance',
                'Resistencia',
                'Aumenta tu resistencia en 10 puntos',
                '../../../Videojuego/assets/objects/ui_resistance.png'),

    new Ability('doubleJump',
                'Doble Salto',
                'Al presionar dos veces W, podrás realizar un segundo salto en el aire!',
                '../../../Videojuego/assets/objects/ui_doublejump.png'),

    new Ability('dash',
                'Dash',
                'Al presionar shift, podrás desplazarte rápidamente',
                '../../../Videojuego/assets/objects/ui_dash.png')
    ]

let colorList = [
    '../../../Videojuego/assets/objects/redcard.png',
    '../../../Videojuego/assets/objects/orangecard.png',
    '../../../Videojuego/assets/objects/yellowcard.png',
    '../../../Videojuego/assets/objects/greencard.png',
    '../../../Videojuego/assets/objects/bluecard.png',
    '../../../Videojuego/assets/objects/purplecard.png'
]


class AbilityCard{
    constructor({position, urlSprite, image, title, description, ability}){
        this.position = position;
        this.urlSprite = urlSprite;
        this.image = image;
        this.title = title;
        this.description = description;
        this.ability = ability; //reference to the ability object
    }

    draw(){
        let card1 = new GameObject(null, 
            canvasWidth - 610, //width
            320,  //height
             this.position.x + 10,  //x
             this.position.y, //y
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

        let card1Description = new cardTextLabel(this.position.x + 40, this.position.y + 180,
                                    "11px monospace", "white", 120);
        card1Description.draw(ctx, this.description);

    }

}

class popUpAbility{
    constructor(){

        this.canBeShown = true;
        this.isGenerated = false;

        this.isSelected = false; //checks if an ability has been selected

        this.backgroundImage = new GameObject(null, canvasWidth - 120, 415, 
                                            (canvasWidth / 2) - 340, (canvasHeight / 4) - 100, 'background');
        this.backgroundImage.setSprite('../../../Videojuego/assets/objects/cardbackground.png');

        this.randomAbilities = [];  //array of random abilities
        this.randomColors = []; //array of random colors
        this.abilityCards = []; //array of ability cards
        
    }

    generateAbilities(){ //generates a random set of abilities
        if(this.isGenerated){
            return; //if it's already generated, do nothing
        }

        this.randomAbilities = []; //resets the random abilities
        this.randomColors = []; //resets the random colors
        this.abilityCards = []; //resets the ability cards
        let i = 0; //index 

        while(this.randomAbilities.length < 3){
            let randomA =  Math.floor(Math.random() * abilitiesList.length); //random number between 0 and the length of the abilities list
            let randomC; //random number between 0 and the length of the colors list
        
            //do while loop to ensure the color is unique in each iteration, 
            //also, since each ability needs a color inmediately and we can't skip it like we can do with the abilities
            do { 
                randomC = Math.floor(Math.random() * colorList.length);
            } while (this.randomColors.includes(colorList[randomC]));
            
            this.randomColors.push(colorList[randomC]);

            if(!this.randomAbilities.includes(abilitiesList[randomA])){
                this.randomAbilities.push(abilitiesList[randomA]);
                
                //creates the ability card using the attributes of the ability
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
            
        this.isGenerated = true; //sets the isGenerated to true so it doesn't generate again
    }


    //with, height, x,y 
    show(){
        if(this.canBeShown){
            if (this.isGenerated) {
                this.backgroundImage.draw(ctx, 1);
    
                for(let i = 0; i < this.abilityCards.length; i++){
                    this.abilityCards[i].draw();
                }
            }
        }
    }


    hide(){
        this.canBeShown = false;
        this.isSelected = false;
    }   

    activate(){
        if(!this.canBeShown){
            this.canBeShown = true;
        }
        
        this.isGenerated = false; // allows to generate a new set of abilities

        this.generateAbilities();
    }
}

