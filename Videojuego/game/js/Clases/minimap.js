class MiniMap extends GameObject {
    constructor(_color, width, height, x, y, _type) {
        super(_color, width, height, x, y, "minimap");

        this.isDrawn = false;
    }

    draw(ctx, rooms, currentRoomId) {
        // Dibuja el fondo del minimapa
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)"; // Fondo semitransparente
        ctx.fillRect(this.position.x, this.position.y, this.size.x, this.size.y);

        // Tamaño de las salas
        const roomWidth = this.size.x / numRooms;
        const roomHeight = this.size.y / 3;
        const spacing = 0; // Espaciado entre salas

        // Dibuja las salas principales y sus ramas
        for (let i = 0; i < numRooms; i++) {
            const room = rooms.get(i);
            const roomX = this.position.x + i * roomWidth;
            const roomY = this.position.y + this.size.y / 3;

            // Dibuja la sala principal
            this.drawRoomRect(ctx, room, roomX, roomY, roomWidth - spacing, roomHeight - spacing);

            // Si es la sala actual, dibuja un rectángulo más pequeño dentro
            if (room.id === currentRoomId) {
                room.isExplored = true; // Marca la sala como explorada
                this.drawPlayerRect(ctx, room, roomX, roomY, roomWidth - spacing, roomHeight - spacing);
            }

            // Dibuja las ramas conectadas
            for (const connectionId of room.connections) {
                const connectedRoom = rooms.get(connectionId);
                const branchX = roomX; // Mantiene la misma posición X

                if (connectedRoom.type === "button"
                    || connectedRoom.type === "branch1") {
                    // Dibuja la rama arriba
                    const branchY = roomY - roomHeight - spacing; // Se mueve hacia arriba
                    this.drawRoomRect(ctx, connectedRoom, branchX, branchY, roomWidth - spacing, roomHeight - spacing);
                    if (connectedRoom.id === currentRoomId) {
                        connectedRoom.isExplored = true; // Marca la sala como explorada
                        this.drawPlayerRect(ctx, connectedRoom, branchX, branchY, roomWidth - spacing, roomHeight - spacing);
                    }
                } else if (connectedRoom.type === "branch2") {
                    // Dibuja la rama abajo
                    const branchY = roomY + roomHeight + spacing;
                    this.drawRoomRect(ctx, connectedRoom, branchX, branchY, roomWidth - spacing, roomHeight - spacing);
                    if (connectedRoom.id === currentRoomId) {
                        connectedRoom.isExplored = true; // Marca la sala como explorada
                        this.drawPlayerRect(ctx, connectedRoom, branchX, branchY, roomWidth - spacing, roomHeight - spacing);
                    }
                }
            }
        }
    }

    drawRoomRect(ctx, room, x, y, width, height, color) {

        if (color !== undefined) {
            ctx.fillStyle = color; // Color de la sala
        }
        else if (!room.isExplored) {
            if (room.type === "boss") {
                if (game.isButtonPressed) {
                    ctx.fillStyle = "lightgreen"; // Color de la sala de jefe
                } else {
                    ctx.fillStyle = "darkred"; // Color de la sala de jefe
                }
            } else {
                ctx.fillStyle = "gray"; // Color de la sala no explorada
            }
        }
        else {
            if (room.type === "button") {
                ctx.fillStyle = "lightblue"; // Color de la sala de botón
            } else {
                ctx.fillStyle = "white"; // Color de la sala normal
            }
        }

        ctx.fillRect(x, y, width, height); // Dibuja la sala
        ctx.strokeStyle = "black"; // Color del borde
        ctx.lineWidth = 2; // Grosor del borde
        ctx.strokeRect(x, y, width, height); // Dibuja el borde
    }

    drawPlayerRect(ctx, room, x, y, width, height) {
        const innerRectWidth = width * 0.5; // 50% del ancho
        const innerRectHeight = height * 0.5; // 50% del alto
        const innerRectX = x + (width - innerRectWidth) / 2; // Centrado
        const innerRectY = y + (height - innerRectHeight) / 2; // Centrado
        this.drawRoomRect(ctx, room, innerRectX, innerRectY, innerRectWidth, innerRectHeight, "lightgreen");
    }
}