"use strict";

const SCALE = 29; // Escala de los sprites

class Room {
    constructor(id, type = "normal") {
        this.id = id;
        this.type = type;  // "start", "normal", "boss", "button"
        this.connections = new Set(); // Conexiones a otras salas
    }

    connect(room) {
        if (!this.connections.has(room.id)) {
            this.connections.add(room.id);
            room.connections.add(this.id);
        }
    }
}

class LevelGenerator {
    constructor(numRooms) {
        this.numRooms = numRooms;
        this.rooms = new Map();
    }

    generate() {
        // Crear las salas
        for (let i = 0; i < this.numRooms; i++) {
            this.rooms.set(i, new Room(i));
        }

        // Definir tipos de salas iniciales y finales
        this.rooms.get(0).type = "start";
        this.rooms.get(this.numRooms - 1).type = "boss";

        // Conectar las salas de forma lineal
        for (let i = 0; i < this.numRooms - 1; i++) {
            this.rooms.get(i).connect(this.rooms.get(i + 1));
        }

        // Agregar bifurcaciones aleatorias
        this.addBranchingPaths();

        return this.rooms;
    }

    addBranchingPaths() {
        let buttonRoom = null;

        for (let i = 1; i < this.numRooms - 1; i++) {
            if (Math.random() < 0.3) { // 30% de probabilidad de una bifurcación
                let branchId1 = `branch${i}_1`;
                let branchRoom1 = new Room(branchId1);
                this.rooms.set(branchId1, branchRoom1);
                this.rooms.get(i).connect(branchRoom1);
                
                // Segunda bifurcación con 50% de probabilidad si ya hay una
                let branchId2 = `branch${i}_2`;
                if (Math.random() < 0.5) {
                    let branchRoom2 = new Room(branchId2);
                    this.rooms.set(branchId2, branchRoom2);
                    this.rooms.get(i).connect(branchRoom2);
                }

                // Asignar una de las bifurcaciones como la sala del botón si aún no se ha asignado
                if (!buttonRoom) {
                    buttonRoom = branchRoom1;
                    buttonRoom.type = "button";
                }
            }
        }
    }

    printGraph() {
        for (let room of this.rooms.values()) {
            console.log(`${room.id} (${room.type}): ${Array.from(room.connections).join(', ')}`);
        }
    }
}

function generateRandomEnemies(minEnemies, maxEnemies) {
    let numEnemies = Math.floor(Math.random() * (maxEnemies - minEnemies + 1)) + minEnemies;
    let enemies = [];
    let probabilities = {N: 0.5, H: 0.3, F: 0.2};

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

    console.log(enemies);
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
*/

function generateRandomLevel(width, height, numObstacles, numRewards, minEnemies, maxEnemies, roomType) {
    let level = Array.from({ length: height }, () => Array(width).fill('.'));
    
    // Bordes del nivel

    if (roomType == "start") {
        for (let x = 0; x < width; x++) { 
            level[0][x] = '#'; 
            level[height - 1][x] = '#'; 
        }
        for (let y = 0; y < height; y++) {
            if (y < height - 4 || y === height - 1) {
                level[y][0] = '#'; 
                level[y][width - 1] = '#'; 
            }
            else {
                level[y][0] = '#'; 
                level[y][width - 1] = 'D'; 
            }
        }
    }
    else if (roomType == "boss") {
        for (let x = 0; x < width; x++) { 
            level[0][x] = '#'; 
            level[height - 1][x] = '#'; 
        }
        for (let y = 0; y < height; y++) {
            if (y < height - 4 || y === height - 1) {
                level[y][0] = '#'; 
                level[y][width - 1] = '#'; 
            }
            else {
                level[y][0] = 'D'; 
                level[y][width - 1] = '#'; 
            }
        }
    }
    else {
        for (let x = 0; x < width; x++) { 
            level[0][x] = '#'; 
            level[height - 1][x] = '#'; 
        }
        for (let y = 0; y < height; y++) {
            if (y < height - 4 || y === height - 1) {
                level[y][0] = '#'; 
                level[y][width - 1] = '#'; 
            }
            else {
                level[y][0] = 'D'; 
                level[y][width - 1] = 'D'; 
            }
        }
    }
    
    
    function placeRandomly(char, count, minY=1, maxY=height-2, minX=1, maxX=width-2) {
        let placed = 0;
        while (placed < count) {
            let x = Math.floor(Math.random() * (maxX - minX + 1)) + minX;
            let y = Math.floor(Math.random() * (maxY - minY + 1)) + minY;
            if (level[y][x] === '.') {
                level[y][x] = char;
                placed++;
            }
        }
    }
    
    // Colocar obstáculos y recompensas
    placeRandomly('$', numRewards, 1, height - 2); // En cualquier lugar

    // Generar enemigos aleatorios
    let enemies = generateRandomEnemies(minEnemies, maxEnemies);

    // Colocar enemigos normales (N), pesados (H) y voladores (F)
    // Solo se colocan enemigos entre 1/3 y 2/3 del nivel, en el suelo o en la parte superior
    for (let i = 0; i < enemies.length; i++) {
        
        if (enemies[i] === 'N') {
            placeRandomly('N', 1, height - 2, height - 2, Math.floor(width / 3), Math.floor(width / 3) * 2);
        }
        else if (enemies[i] === 'H') {
            placeRandomly('H', 1, height - 2, height - 2, Math.floor(width / 3), Math.floor(width / 3) * 2);
        }
        else {
            placeRandomly('F', 1, Math.floor(height / 3), Math.floor(height / 3) * 2, Math.floor(width / 2), Math.floor(width / 2));
        }
    }

    // Colocar un solo obstáculo en el suelo entre 1/3 y 2/3 del nivel
    placeRandomly('#', 1, height - 2, height - 2, Math.floor(width / 3), Math.floor(width / 3) * 2);
    
    // Colocar jugador al inicio del nivel
    level[height - 2][2] = '@';
    
    return level.map(row => row.join('')).join('\n');
}

// Generar un nivel aleatorio

let numRooms = 6;
let levelGenerator = new LevelGenerator(numRooms);
let rooms = levelGenerator.generate();
console.log(rooms);

/*
let GAME_LEVELS = [
    // width, height, numObstacles, numRewards, minEnemies, maxEnemies
    generateRandomLevel(levelWidth, 16, 10, 1, 1, 3)
];
*/

let GAME_LEVELS = [];

for (let i = 0; i < numRooms; i++) {
    let level = generateRandomLevel(levelWidth, 16, 10, 1, 1, 3, rooms.get(i).type);
    GAME_LEVELS.push(level);
}

for (let i = 0; i < GAME_LEVELS.length; i++) {
    console.log(GAME_LEVELS[i]);
}