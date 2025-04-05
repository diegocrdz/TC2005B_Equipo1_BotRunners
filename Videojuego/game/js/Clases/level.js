/*
 * Actors of each level of the game
 *
 * Team BotRunners:
 * - Diego Córdova Rodríguez, A01781166
 * - Lorena Estefanía Chewtat Torres, A01785378
 * - Eder Jezrael Cantero Moreno, A01785888
 *
 * Date: 04/04/2025
*/

// Class to initialize all the actors in the game
class Level {
    constructor(plan) {
        // Split the plan string into a matrix of strings
        let rows = plan.trim().split('\n').map(l => [...l]);
        this.height = rows.length;
        this.width = rows[0].length;
        this.actors = [];
        this.doors = [];

        // Variable to randomize environments
        let rnd = Math.random();

        // Fill the rows array with a label for the type of element in the cell
        // Most cells are 'empty', except for the 'wall'
        this.rows = rows.map((row, y) => {
            return row.map((ch, x) => {
                let item = levelChars[ch];
                let objClass = item.objClass;
                let cellType = item.label;
                // Create a new instance of the type specified
                let actor = new objClass(this.getBackgroundForLevel(), 1, 1, x, y, item.label);
                // Configurations for each type of cell
                // TODO: Simplify this code, sinde most of it is repeated
                if (actor.type == "player") {
                    // Also instantiate a floor tile below the player
                    this.addBackgroundFloor(x, y);

                    // Make the player larger
                    actor.position = actor.position.plus(new Vec(0, -3));
                    actor.size = new Vec(3, 3);

                    actor.setSprite(item.sprite, item.rect);
                    actor.sheetCols = item.sheetCols;

                    const dirData = actor.movement["right"];
                    actor.setAnimation(...dirData.idleFrames, dirData.repeat, dirData.duration);

                    this.player = actor;
                    cellType = "empty";

                } else if (actor.type == "coin") {
                    // Also instantiate a floor tile below the player
                    this.addBackgroundFloor(x, y);

                    actor.setSprite(item.sprite, item.rect);
                    this.actors.push(actor);
                    cellType = "empty";

                } else if (actor.type == "enemy") {
                    // Make the enemy larger
                    this.addBackgroundFloor(x, y);
                    actor.position = actor.position.plus(new Vec(0, -3));
                    actor.size = new Vec(3, 3);

                    actor.setSprite(item.sprite, item.rect);
                    actor.sheetCols = item.sheetCols;

                    const dirData = actor.movement["left"];
                    actor.setAnimation(...dirData.moveFrames, dirData.repeat, dirData.duration);

                    this.actors.push(actor);
                    cellType = "empty";
                
                } else if (actor.type == "boss") {
                    // Make the enemy larger
                    this.addBackgroundFloor(x, y);
                    actor.position = actor.position.plus(new Vec(0, -5));
                    actor.size = new Vec(5, 5);

                    actor.setSprite(item.sprite, item.rect);
                    actor.sheetCols = item.sheetCols;

                    const dirData = actor.movement["left"];
                    actor.setAnimation(...dirData.moveFrames, dirData.repeat, dirData.duration);

                    this.actors.push(actor);
                    cellType = "empty";

                } else if (actor.type == "wall") {
                    // Randomize sprites for each wall tile
                    // item.rect = this.randomEvironment(rnd);
                    item.sprite = this.getWallForLevel();
                    actor.setSprite(item.sprite, item.rect);
                    this.actors.push(actor);
                    cellType = "wall";

                } else if (actor.type == "floor") {
                    //actor.setSprite(item.sprite, item.rect);
                    this.actors.push(actor);
                    cellType = "floor";

                } else if (actor.type == "door") {
                    this.addBackgroundFloor(x, y);
                    actor.setSprite(item.sprite, item.rect);
                    this.actors.push(actor);
                    this.doors.push(actor);
                    cellType = "door";

                } else if (actor.type == "door_down" || actor.type == "door_up") {
                    this.addBackgroundFloor(x, y);
                    item.sprite = this.getPlatformForLevel();
                    actor.setSprite(item.sprite, item.rect);
                    this.actors.push(actor);
                    cellType = "wall";

                } else if (actor.type == "box") {
                    this.addBackgroundFloor(x, y);
                    item.sprite = this.getBoxForLevel();
                    actor.setSprite(item.sprite, item.rect);
                    this.actors.push(actor);
                    cellType = "box";
                    
                } else if(actor.type == "end_pipe") {
                    this.addBackgroundFloor(x, y);
                    actor.setSprite(item.sprite, item.rect);
                    this.actors.push(actor);
                    cellType = "wall";

                }   else if(actor.type == "start_pipe"){
                    this.addBackgroundFloor(x, y);
                    actor.setSprite(item.sprite, item.rect);    
                    this.actors.push(actor);
                    cellType = "wall";

                }else if(actor.type == "spikes"){
                    this.addBackgroundFloor(x, y);
                    actor.setSprite(item.sprite, item.rect);
                    this.actors.push(actor);
                    cellType = "spikes";

                }else if (actor.type == "ladder") {
                    this.addBackgroundFloor(x, y);
                    item.sprite = this.getLadderForLevel();
                    actor.setSprite(item.sprite, item.rect);
                    this.actors.push(actor);
                    cellType = "empty";

                } else if (actor.type == "button") {
                    this.addBackgroundFloor(x, y);
                    actor.setSprite(item.sprite, item.rect);
                    this.actors.push(actor);
                    cellType = "empty";
                }
                return cellType;
            });
        });

        // Define directions for the doors relative to the players position
        if (this.player) { // If the player exists
            this.doors.forEach(door => { // For each door, set the direction
                // If the door is to the left of the player, set the direction to left
                // otherwise, set it to right
                door.direction = door.position.x < this.player.position.x ? "left" : "right";
            });
        }
    }

    // Define the colors and sprites for each level

    getBackgroundForLevel() {
        const backgrounds = {
            0: "#d9b399", // yellow
            1: "#DCE1E7", // light grey
            2: "#b3bbc4", // dark grey
        }
        // Default to the first background
        return backgrounds[level] || backgrounds[0];
    }

    getWallForLevel() {
        const walls = {
            0: '../../assets/blocks/sand_packed.png', // yellow
            1: '../../assets/blocks/marble_packed.png', // white
            2: '../../assets/blocks/rock_packed.png', // dark grey
        }
        // Default to the first wall
        return walls[level] || walls[0];
    }

    getBoxForLevel() {
        const boxes = {
            0: '../../assets/obstacles/box_1.png',
            1: '../../assets/obstacles/box_2.png',
            2: '../../assets/obstacles/box_3.png'
        }
        // Default to the first box
        return boxes[level] || boxes[0];
    }

    getLadderForLevel() {
        const ladders = {
            0: '../../assets/interactable/ladder_1.png',
            1: '../../assets/interactable/ladder_2.png',
            2: '../../assets/interactable/ladder_3.png'
        }
        // Default to the first ladder
        return ladders[level] || ladders[0];
    }

    getPlatformForLevel() {
        const platforms = {
            0: '../../assets/interactable/platform_1.png',
            1: '../../assets/interactable/platform_2.png',
            2: '../../assets/interactable/platform_2.png'
        }
        // Default to the first platform
        return platforms[level] || platforms[0];
    }

    // Add a floor tile to the background of the level
    addBackgroundFloor(x, y) {
        let floor = levelChars['.'];
        let floorActor = new GameObject(this.getBackgroundForLevel(level), 1, 1, x, y, floor.label);
        //floorActor.setSprite(floor.sprite, floor.rect);
        this.actors.push(floorActor);
    }

    // Randomize sprites for each wall tile
    randomTile(xStart, xRange, y) {
        let tile = Math.floor(Math.random() * xRange + xStart);
        return new Rect(tile, y, 32, 32);
    }

    // Randomize the environment for each level
    // This function is currently not used, but it is here for future use
    randomEvironment(rnd) {
        let rect;
        if (rnd < 0.33) {
            rect = this.randomTile(1, 10, 6);    // yellow marble
        } else if (rnd < 0.66) {
            rect = this.randomTile(1, 12, 16);     // green marble with carvings
        } else {
            rect = this.randomTile(21, 12, 16);  // brown and yellow pebbles
        }
        return rect;
    }

    // Detect when the player touches a wall
    contact(playerPos, playerSize, type) {
        // Determine which cells the player is occupying
        let xStart = Math.floor(playerPos.x);
        let xEnd = Math.ceil(playerPos.x + playerSize.x);
        let yStart = Math.floor(playerPos.y);
        let yEnd = Math.ceil(playerPos.y + playerSize.y);

        // Check each of those cells
        for (let y=yStart; y<yEnd; y++) {
            for (let x=xStart; x<xEnd; x++) {
                // Anything outside of the bounds of the canvas is considered
                // to be a wall, so it blocks the player's movement
                let isOutside = x < 0 || x >= this.width ||
                                y < 0 || y >= this.height;
                let here = isOutside ? 'wall' : this.rows[y][x];
                // Detect if an object of type specified is being touched
                if (here == type) {
                    return true;
                }
            }
        }
        return false;
    }
}