/*
 * Level generation script for the game
 * Used to generate all the rooms and levels of the game
 * Including the content of the rooms
 *
 * Team BotRunners:
 * - Diego Córdova Rodríguez, A01781166
 * - Lorena Estefanía Chewtat Torres, A01785378
 * - Eder Jezrael Cantero Moreno, A01785888
 *
 * Date: 04/04/2025
*/

"use strict";

// Global variables for level generation
// List of generated levels
let GAME_LEVELS = [];
// Rooms to be generated
let rooms;
// Level of rooms in all levels
let numRooms = 6;

// Room class to generate a graph of rooms with connections
class Room {
    constructor(id, type = "normal") {
        this.id = id;
        // Room types:
        // "start", "room2", "normal", "boss",
        // "button1", "button2", "branch",
        // "ladder1", "ladder2"
        this.type = type;
        this.connections = new Set(); // Rooms connected to this room
        // Check if the room has been explored
        // Used to update the minimap
        this.isExplored = false;

        // Get a random background for the room
        this.background = new GameObject(null,
                                        canvasWidth, canvasHeight - 88,
                                        0, 0, "background");
        this.background.setSprite(getRandomBackground(level));
    }

    // Connect this room to another room
    connect(room) {
        // Check if the room is already connected to this room
        if (!this.connections.has(room.id)) {
            this.connections.add(room.id);
            room.connections.add(this.id);
        }
    }
}

// Generate a graph of rooms with connections
class LevelGenerator {
    constructor(numRooms) {
        this.numRooms = numRooms;
        this.rooms = new Map();
    }

    // Generate a graph of rooms with connections
    generate() {
        // Create rooms
        for (let i = 0; i < this.numRooms; i++) {
            this.rooms.set(i, new Room(i));
        }

        // Assign the start and boss rooms
        this.rooms.get(0).type = "start";
        this.rooms.get(1).type = "second";
        this.rooms.get(this.numRooms - 1).type = "boss";

        // Connect rooms in a linear way
        for (let i = 0; i < this.numRooms - 1; i++) {
            this.rooms.get(i).connect(this.rooms.get(i + 1));
        }

        // Add branching paths
        this.addBranchingPaths();

        // Check if the room has a ladder to connect to 1 or 2 bifurcations
        this.checkLadder();

        return this.rooms;
    }

    // Add branching paths to the graph of rooms
    addBranchingPaths() {
        let buttonRoom = null;

        // Add the button branch before generating the other branches
        // between room 2 and rooms length - 1
        let random = Math.floor(Math.random() * (this.numRooms - 3)) + 2;
        console.log("Button room: " + random);

        for (let i = 2; i < this.numRooms - 1; i++) {
            // Create a branch with a button
            if (i == random) {
                let branchId = this.rooms.size;
                let branchRoom = new Room(branchId);
                branchRoom.type = "button";
                this.rooms.set(branchId, branchRoom);
                this.rooms.get(i).connect(branchRoom);
                buttonRoom = branchRoom;
            }

            // 30% of probability to create a branch
            if (Math.random() < 0.3) {

                // If the room already has a button branch, create a normal branch
                if (i == random) {
                    let branchId1 = this.rooms.size;
                    let branchRoom1 = new Room(branchId1);
                    branchRoom1.type = "branch2";
                    this.rooms.set(branchId1, branchRoom1);
                    this.rooms.get(i).connect(branchRoom1);
                    break;
                }

                // Create a normal branch
                let branchId1 = this.rooms.size;
                let branchRoom1 = new Room(branchId1);
                branchRoom1.type = "branch1";
                this.rooms.set(branchId1, branchRoom1);
                this.rooms.get(i).connect(branchRoom1);
                
                // 50% of probability to create a second branch
                let branchId2 = this.rooms.size;
                if (Math.random() < 0.5) {
                    let branchRoom2 = new Room(branchId2);
                    branchRoom2.type = "branch2";
                    this.rooms.set(branchId2, branchRoom2);
                    this.rooms.get(i).connect(branchRoom2);
                }
            }
        }
    }

    // Check if the number of connection of the rooms to assign the type of ladder
    checkLadder() {

        // If the room has a connection to a bifurcation, change the type to "ladder1" or "ladder2"
        for (let room of this.rooms.values()) {
            // If the room has a connection to one bifurcation
            if (room.connections.size === 3) {
                room.type = "ladder1";
            // If the room has a connection to two bifurcations
            } else if (room.connections.size === 4) {
                room.type = "ladder2";
            }
        }
    }

    // Print the graph of rooms with connections
    // Used for debugging purposes
    printGraph() {
        for (let room of this.rooms.values()) {
            console.log(`${room.id} (${room.type}): ${Array.from(room.connections).join(', ')}`);
        }
    }
}

// Generate a list of enemies for each room
function generateRandomEnemies(minEnemies, maxEnemies) {
    // Generate a random number of enemies between minEnemies and maxEnemies
    let numEnemies = Math.floor(Math.random() * (maxEnemies - minEnemies + 1)) + minEnemies;
    // Generate a list of enemies with probabilities of spawning
    let enemies = [];
    let probabilities = {N: 0.5, H: 0.3, F: 0.2};

    // Generate the enemies
    for (let i = 0; i < numEnemies; i++) {

        let random = Math.random();
        let type;
        
        if (random < probabilities.N) {
            type = 'N';
        }
        else if (random < probabilities.N + probabilities.H) {
            type = 'H';
        }
        else {
            type = 'F';
        }
        enemies.push(type);
    }

    return enemies;
}

/*
Level symbols:
# - Wall
. - Floor
@ - Player
$ - Reward
N - Normal enemy
H - Heavy enemy
F - Flying enemy
D - Door
U - Door up
V - Door down
B - Box
E - Pipe end
S - Pipe start
L - Ladder
0 - Button
P - Spike
O - Turtle Boss
X - Final Boss
*/

// Generate the rooms layout
function generateRandomLevel(width, height, numObstacles, numRewards, minEnemies, maxEnemies, roomType, levelNumber) {
    let level = Array.from({ length: height }, () => Array(width).fill('.'));
    
    // Level borders
    // Top and bottom walls
    for (let x = 0; x < width; x++) {  // Fill the first and last rows with walls
        if (roomType == "button" || roomType == "branch1") { // Place doors at the bottom
            level[0][x] = '#'; 
            level[height - 1][x] = 'V'; 
        } else if (roomType == "branch2") { // Place doors at the top
            level[0][x] = 'U'; 
            level[height - 1][x] = '#'; 
        } else {
            level[0][x] = '#'; 
            level[height - 1][x] = '#'; 
        }
    }

    // Side walls
    for (let y = 0; y < height; y++) {
        // Fill the first and last columns with walls
        if (y < height - 4 || y === height - 1) {
            level[y][0] = '#'; 
            level[y][width - 1] = '#';
            // Place a big door at the right side of the level
            if (y > 0 && y < height - 1 && roomType == "boss") {
                level[y][width - 1] = 'D'; 
            }
        }
        // Fill the last blocks of the first column with doors
        else if (roomType == "start") {
            level[y][0] = '#'; 
            level[y][width - 1] = 'D'; 
        }
        // Fill the last blocks of the last column with doors
        else if (roomType == "boss") {
            level[y][0] = 'D'; 
            level[y][width - 1] = 'D'; 
        }
        // Fill the last blocks of the first and last columns with walls
        else if (roomType == "button"
                || roomType == "branch1"
                || roomType == "branch2") {
            level[y][0] = '#';
            level[y][width - 1] = '#';
        }
        // Fill the last blocks of the first and last columns with doors
        else {
            level[y][0] = 'D'; 
            level[y][width - 1] = 'D'; 
        }
    }

    // Place the player at the bottom of the level
    level[height - 2][2] = '@';
    
    // Function to place elements in the level
    function placeRandomly(char, count, minY=1, maxY=height-2, minX=1, maxX=width-2) {
        let placed = 0;
        let attempts = 0;
        // Limit the number of attempts to prevent infinite loops
        const maxAttempts = 1000;
        while (placed < count && attempts < maxAttempts) {
            let x = Math.floor(Math.random() * (maxX - minX + 1)) + minX;
            let y = Math.floor(Math.random() * (maxY - minY + 1)) + minY;
            if (level[y][x] === '.') {
                level[y][x] = char;
                placed++;
            }
            attempts++;
        }
        // If the number of attempts is greater than the maximum, print a warning
        if (attempts >= maxAttempts) {
            console.warn(`Could not place all '${char}' items after ${maxAttempts} attempts.`);
        }
    }

    function placePipes() {
        let numPipes = Math.floor(Math.random() * 2) + 1; // 1 or 2 pipes
        let minX = Math.floor(width / 3);
        let maxX = Math.floor(2 * width / 3);
        // Save the posititons of the pipes that are already placed
        let usedPositions = new Set();
        
        // Dont place pipes in the ladder rooms
        if (roomType === "ladder1"
            || roomType === "ladder2") {
            return;
        }
    
        for (let i = 0; i < numPipes; i++) {
            // Define attempts to find a valid position for the pipe
            let attempts = 10;
            let pipeX; // Position of the pipe
            
            // Do-while to find a valid position for the pipe
            do {
                pipeX = Math.floor(Math.random() * (maxX - minX + 1)) + minX;
                attempts--;
            // While the position is already used or the pipe is too close to another pipe
            } while (
                (usedPositions.has(pipeX)
                || usedPositions.has(pipeX - 1) || usedPositions.has(pipeX + 1) 
                || usedPositions.has(pipeX - 2) || usedPositions.has(pipeX + 2) 
                || usedPositions.has(pipeX - 3) || usedPositions.has(pipeX + 3)) 
                && attempts > 0
            );
            
            // If the attempts are 0, continue to the next pipe
            // This means that there is no valid position for the pipe
            if (attempts === 0) {
                continue;
            }
    
            let pipeLength = Math.floor(Math.random() * 5) + 3; // 3 to 7 blocks long
    
            // Check if the pipe will be placed in a valid position
            if (level[1][pipeX] !== '.') {
                continue;
            }
            
            // Place the head of the pipe in the ceiling
            level[1][pipeX] = 'S';
            // Save the position of the pipe
            usedPositions.add(pipeX);
    
            // Draw the rest of the pipe
            for (let j = 2; j < Math.min(1 + pipeLength, height - 1); j++) {
                // If the pipe encounters anything, break the loop
                if (level[j][pipeX] !== '.') {
                    break;
                }
                level[j][pipeX] = 'S'; 
            }
            // Place the end of the pipe
            level[Math.min(1 + pipeLength, height - 2)][pipeX] = 'E'; 
        }
    }

    // Place ladders in the level if the room has bifurcations
    // If roomType is "ladder1"
    // place a door at the top of the level
    // place a ladder from the bottom to the top
    if (roomType == "ladder1") {
        for (let x = 1; x < width - 1; x++) {
            level[0][x] = 'U'; 
        }
        for (let y = 0; y < height - 1; y++) {
            level[y][Math.ceil(width / 2)] = 'L';
        }
    }
    // If roomType is "ladder2"
    // place a door at the top and bottom of the level
    // place a ladder from the top to the bottom
    if (roomType == "ladder2") {
        for (let x = 1; x < width - 1; x++) {
            level[0][x] = 'U';
            level[height - 1][x] = 'V'; 
        }
        for (let y = 0; y < height - 1; y++) {
            level[y][Math.ceil(width / 2)] = 'L';
        }
    }

    // Place ladders in the branches
    // Place a ladder from the bottom to the top
    if (roomType == "button" || roomType == "branch1") {
        for (let y = height - 3; y < height; y++) {
            level[y][Math.ceil(width / 2)] = 'L';
        }
    // Place a ladder from the top to the bottom
    } else if (roomType == "branch2") { 
        for (let y = 0; y < height - 2; y++) {
            level[y][Math.ceil(width / 2)] = 'L';
        }
    }

    // Place xp rewards for all rooms
    placeRandomly('$', 2, 7, height - 2);


    // If roomType is "button"
    // place a button on the floor
    // place enemies at the sides
    if (roomType == "button") {
        // Place a button in a determined position
        level[height - 2][width - 5] = '0';
        // Place enemies at the sides
        let enemies = generateRandomEnemies(minEnemies, maxEnemies);
        for (let i = 0; i < enemies.length; i++) {
            if (enemies[i] === 'N') {
                placeRandomly('N', 1,
                    height - 2, height - 2,
                    2, Math.floor(width / 3));
            }
            else if (enemies[i] === 'H') {
                placeRandomly('H', 1,
                    height - 2, height - 2,
                    width - 4, width - 4);
            }
            else {
                placeRandomly('F', 1,
                    Math.floor(height / 3) * 2, Math.floor(height / 3) * 2,
                    Math.floor(width / 3), Math.floor(width / 3) * 2);
            }
        }
        return level.map(row => row.join('')).join('\n');
    }
    // If roomType is "branch1" or "branch2", dont place enemies
    else if (roomType == "branch1" || roomType == "branch2") {
        let enemies = generateRandomEnemies(minEnemies, maxEnemies);
        for (let i = 0; i < enemies.length; i++) {
            if (enemies[i] === 'N') {
                placeRandomly('N', 1,
                    height - 2, height - 2,
                    width - 4, width - 4);
            }
            else if (enemies[i] === 'H') {
                placeRandomly('H', 1,
                    height - 2, height - 2,
                    width - 4, width - 4);
            }
            else {
                placeRandomly('F', 1,
                    Math.floor(height / 3) * 2, Math.floor(height / 3) * 2,
                    Math.floor(2 * width / 3), width - 4);
            }
        }
        return level.map(row => row.join('')).join('\n');
    }

    // If roomType is "start"
    // Only place a box and the player
    if (roomType == "start") {
        // Place a box in the level
        placeRandomly('B', 1, height - 2, height - 2, Math.floor(width / 3), Math.floor(width / 3) * 2);
        placeRandomly('P', 1, height - 2, height - 2, Math.floor(width / 3), Math.floor(width / 3) * 2);
        //level[height - 2][width - 6] = 'O' // Debug turtle boss
        // Place the player at the bottom of the level
        level[height - 2][2] = '@';
        return level.map(row => row.join('')).join('\n');
    }

    // If the room is the second
    // Only place a normal enemy
    if (roomType == "second") {
        // Place a normal enemy
        placeRandomly('N', 1, height - 2, height - 2, width - 4, width - 4);
        return level.map(row => row.join('')).join('\n');
    }

    // If roomType is "boss"
    // Only place a heavy enemy
    if (roomType == "boss") {
        // Choose the boss depending on the level number
        let bossChar;
        if (levelNumber == 0) {
            bossChar = 'O'; // Turtle Boss
        } else if (levelNumber == 1) {
            bossChar = 'X'; // Fast Boss
        } else {
            bossChar = 'X'; // Final Boss
        }
        // Place the boss
        level[height - 2][width - 6] = bossChar;
        return level.map(row => row.join('')).join('\n');
    }
    
    // Generate random enemies
    let enemies = generateRandomEnemies(minEnemies, maxEnemies);

    // Place enemies
    for (let i = 0; i < enemies.length; i++) {
        
        if (enemies[i] === 'N') {
            placeRandomly('N', 1,
                            height - 2, height - 2,
                            Math.floor(width / 3), Math.floor(width / 3) * 2);
        }
        else if (enemies[i] === 'H') {
            placeRandomly('H', 1,
                            height - 2, height - 2,
                            Math.floor(width / 3), Math.floor(width / 3) * 2);
        }
        else {
            placeRandomly('F', 1,
                            Math.floor(height / 3) * 2, Math.floor(height / 3) * 2,
                            Math.floor(2 * width / 3 + 1), width - 4);
        }
    }

    // If the room has a ladder, dont place boxes
    // it can obstruct the path to the ladder
    if (roomType == "ladder1" || roomType == "ladder2") {
        return level.map(row => row.join('')).join('\n');
    }

    // Place a box in the level
    // Get a random number of boxes between 0 and 1
    let numBoxes = Math.floor(Math.random() * 2);
    let numSpikes = Math.floor(Math.random() * 2);
  
    placeRandomly('B', numBoxes, height - 2, height - 2, Math.floor(width / 3), Math.floor(width / 3) * 2);
    placePipes();
    placeRandomly('P', 1, height - 2, height - 2, Math.floor(width / 3), Math.floor(width / 3) * 2);
    
    return level.map(row => row.join('')).join('\n');
}

// Function to generate the levels and fill the GAME_LEVELS array
function generateLevel(numRooms) {
    GAME_LEVELS = []; // Reset the levels array
    let levelGenerator = new LevelGenerator(numRooms);
    rooms = levelGenerator.generate();
    console.log(rooms);

    // Fill the list of levels with the generated rooms
    for (let i = 0; i < rooms.size; i++) {
        let randomLevel = generateRandomLevel(levelWidth, 16, 10, 1, 1, 3, rooms.get(i).type, level);
        GAME_LEVELS.push(randomLevel);
    }

    // Print the generated levels to the console
    for (let i = 0; i < GAME_LEVELS.length; i++) {
        console.log(GAME_LEVELS[i]);
    }
}