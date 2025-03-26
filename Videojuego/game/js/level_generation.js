"use strict";

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
    }

    connect(room) {
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
            if (Math.random() < 0.3) { // 30% of probability to create a branch

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

    checkLadder() {

        // If the room has a connection to a bifurcation, change the type to "ladder1" or "ladder2"
        for (let room of this.rooms.values()) {
            if (room.connections.size === 3) { // If the room has a connection to one bifurcation
                room.type = "ladder1";
            }
            else if (room.connections.size === 4) { // If the room has a connection to two bifurcations
                room.type = "ladder2";
            }
        }
    }

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
T - Tutorial sign (no interactuable)
X - Boss
*/

// Generate the rooms layout
function generateRandomLevel(width, height, numObstacles, numRewards, minEnemies, maxEnemies, roomType) {
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
        if (y < height - 4 || y === height - 1) { // Fill the first and last columns with walls
            level[y][0] = '#'; 
            level[y][width - 1] = '#';
            // Place a big door at the right side of the level
            if (y > 0 && y < height - 1 && roomType == "boss") {
                level[y][width - 1] = 'D'; 
            }
        }
        else if (roomType == "start") { // Fill the last blocks of the first column with doors
            level[y][0] = '#'; 
            level[y][width - 1] = 'D'; 
        }
        else if (roomType == "boss") { // Fill the last blocks of the last column with doors
            level[y][0] = 'D'; 
            level[y][width - 1] = 'D'; 
        }
        else if (roomType == "button"
                || roomType == "branch1"
                || roomType == "branch2") { // Fill the last blocks of the first and last columns with walls
            level[y][0] = '#';
            level[y][width - 1] = '#';
        }
        else { // Fill the last blocks of the first and last columns with doors
            level[y][0] = 'D'; 
            level[y][width - 1] = 'D'; 
        }
    }
    
    // Function to place elements in the level
    function placeRandomly(char, count, minY=1, maxY=height-2, minX=1, maxX=width-2) {
        let placed = 0;
        let attempts = 0;
        const maxAttempts = 1000; // Limit the number of attempts to prevent infinite loops
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
        let numPipes = Math.floor(Math.random() * 2) + 1; // 1 o 2 tuberías
        let minX = Math.floor(width / 3);
        let maxX = Math.floor(2 * width / 3);
        let usedPositions = new Set(); // Guardará las posiciones de tuberías ya usadas
    
        if (roomType === "ladder1"
            || roomType === "ladder2") {
            return; // No colocar tuberías en habitaciones con escaleras.
        }
    
        for (let i = 0; i < numPipes; i++) {
            let attempts = 10; // Intentos para encontrar una posición válida
            let pipeX;
    
            do {
                pipeX = Math.floor(Math.random() * (maxX - minX + 1)) + minX;
                attempts--;
            } while (
                (usedPositions.has(pipeX)
                || usedPositions.has(pipeX - 1) || usedPositions.has(pipeX + 1) 
                || usedPositions.has(pipeX - 2) || usedPositions.has(pipeX + 2) 
                || usedPositions.has(pipeX - 3) || usedPositions.has(pipeX + 3)) 
                && attempts > 0
            );
    
            if (attempts === 0) {
                continue; // Si después de varios intentos no se encuentra una posición válida, saltar esta tubería.
            }
    
            let pipeLength = Math.floor(Math.random() * 5) + 3; // Longitud entre 3 y 7
    
            // **Asegurar que la posición inicial esté vacía**
            if (level[1][pipeX] !== '.') {
                continue;
            }
    
            level[1][pipeX] = 'S'; // **Colocar la cabeza de la tubería en el techo**
            usedPositions.add(pipeX); // **Guardar la posición de la tubería**
    
            // **Dibujar el cuerpo de la tubería**
            for (let j = 2; j < Math.min(1 + pipeLength, height - 1); j++) {
                if (level[j][pipeX] !== '.') {
                    break; // **Si choca con algo, detener la tubería**
                }
                level[j][pipeX] = 'S'; 
            }
    
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
        // Place the player at the bottom of the level
        level[height - 2][2] = '@';
        return level.map(row => row.join('')).join('\n');
    }

    // If the room is the second
    // Only place a normal enemy
    if (roomType == "second") {
        placeRandomly('N', 1, height - 2, height - 2, width - 4, width - 4);
        return level.map(row => row.join('')).join('\n');
    }

    // If roomType is "boss"
    // Only place a heavy enemy
    if (roomType == "boss") {
        placeRandomly('X', 1, height - 2, height - 2, width - 6, width - 6);
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
                            Math.floor(2 * width / 3), width - 4);
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
    
    // Place the player at the bottom of the level
    level[height - 2][2] = '@';
    
    return level.map(row => row.join('')).join('\n');
}

// List of generated levels
let GAME_LEVELS = [];

let numRooms = 6;
let levelGenerator = new LevelGenerator(numRooms);
let rooms = levelGenerator.generate();
console.log(rooms);

// Fill the list of levels with the generated rooms
for (let i = 0; i < rooms.size; i++) {
    let level = generateRandomLevel(levelWidth, 16, 10, 1, 1, 3, rooms.get(i).type);
    GAME_LEVELS.push(level);
}

// Print the generated levels to the console
for (let i = 0; i < GAME_LEVELS.length; i++) {
    console.log(GAME_LEVELS[i]);
}