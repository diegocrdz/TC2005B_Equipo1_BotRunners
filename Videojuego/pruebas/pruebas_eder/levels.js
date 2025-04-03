"use strict";

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

// Uso del generador
const generator = new LevelGenerator(6);
generator.generate();
generator.printGraph();

console.log(generator.rooms);