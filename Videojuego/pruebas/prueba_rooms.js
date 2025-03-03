document.addEventListener("DOMContentLoaded", () => {
    // Definir las clases necesarias

    class Vec {
        constructor(x, y) {
            this.x = x;
            this.y = y;
        }

        plus(other) {
            return new Vec(this.x + other.x, this.y + other.y);
        }

        minus(other) {
            return new Vec(this.x - other.x, this.y - other.y);
        }

        times(scalar) {
            return new Vec(this.x * scalar, this.y * scalar);
        }

        magnitude() {
            return Math.sqrt(this.x ** 2 + this.y ** 2);
        }
    }

    // Clase base para objetos del juego
    class GameObject {
        constructor(position, width, height, color, type) {
            this.position = position;
            this.width = width;
            this.height = height;
            this.color = color;
            this.type = type;
        }

        draw(ctx) {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
        }

        update() {
            // Método vacío por ahora, se puede sobrescribir en subclases
        }
    }

    // Clase específica para representar salas en el nivel
    class RoomObject extends GameObject {
        constructor(id, position, type) {
            let color;
            switch (type) {
                case "start": color = "green"; break;
                case "boss": color = "red"; break;
                case "button": color = "blue"; break;
                default: color = "gray"; break;
            }

            super(position, 50, 50, color, type);
            this.id = id;
            this.connections = [];
        }

        draw(ctx) {
            super.draw(ctx); // Dibuja el rectángulo de la sala

            // Dibujar ID de la sala
            ctx.fillStyle = "white";
            ctx.font = "14px Arial";
            ctx.fillText(this.id, this.position.x + 10, this.position.y + 30);
        }

        connect(room) {
            this.connections.push(room);
        }
    }

    // Clase para generar niveles de manera procedural
    class LevelGenerator {
        constructor(numRooms = 10) {
            this.numRooms = numRooms;
            this.rooms = new Map();
        }

        generate() {
            let x = 100, y = 250; // Posición inicial
            let spacing = 120; // Espaciado entre salas

            for (let i = 0; i < this.numRooms; i++) {
                let type = "normal";
                if (i === 0) type = "start";
                if (i === this.numRooms - 1) type = "boss";

                let room = new RoomObject(i, new Vec(x, y), type);
                this.rooms.set(i, room);

                x += spacing; // Moverse a la derecha
            }

            // Conectar habitaciones de forma lineal
            for (let i = 0; i < this.numRooms - 1; i++) {
                this.rooms.get(i).connect(this.rooms.get(i + 1));
                this.rooms.get(i + 1).connect(this.rooms.get(i));
            }

            // Agregar bifurcaciones
            this.addBranchingPaths();
        }

        addBranchingPaths() {
            let buttonRoom = null;

            for (let i = 1; i < this.numRooms - 1; i++) {
                if (Math.random() < 0.3) { // 30% probabilidad de bifurcación
                    let branchId = `B${i}`;
                    let branchRoom = new RoomObject(branchId, new Vec(
                        this.rooms.get(i).position.x, 
                        this.rooms.get(i).position.y + (Math.random() < 0.5 ? -80 : 80)
                    ), "normal");

                    this.rooms.set(branchId, branchRoom);
                    this.rooms.get(i).connect(branchRoom);
                    branchRoom.connect(this.rooms.get(i));

                    // Si no hay una sala "button", asignarla aquí
                    if (!buttonRoom) {
                        buttonRoom = branchRoom;
                        buttonRoom.type = "button";
                        buttonRoom.color = "blue";
                    }
                }
            }
        }

        draw(ctx) {
            this.rooms.forEach(room => {
                room.draw(ctx);

                // Dibujar conexiones entre salas
                room.connections.forEach(connectedRoom => {
                    ctx.beginPath();
                    ctx.moveTo(room.position.x + 25, room.position.y + 25);
                    ctx.lineTo(connectedRoom.position.x + 25, connectedRoom.position.y + 25);
                    ctx.strokeStyle = "white";
                    ctx.stroke();
                });
            });
        }
    }

    // Obtener el canvas y el contexto de dibujo
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    // Ajustar el tamaño del canvas
    canvas.width = 800;
    canvas.height = 600;

    // Crear el generador de niveles y generar el nivel
    const generator = new LevelGenerator(10); // Puedes cambiar el número de salas aquí
    generator.generate();

    // Función para dibujar el nivel
    function drawLevel() {
        // Limpiar el canvas antes de dibujar el siguiente cuadro
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Dibujar el nivel
        generator.draw(ctx);
    }

    // Llamar a la función de dibujo en cada frame
    function gameLoop() {
        drawLevel();
        requestAnimationFrame(gameLoop); // Llamar de nuevo para el siguiente cuadro
    }

    // Comenzar el bucle de juego
    gameLoop();
});
