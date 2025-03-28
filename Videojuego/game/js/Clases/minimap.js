class MiniMap extends GameObject {
    constructor(_color, width, height, x, y, _type) {
        super(_color, width, height, x, y, "minimap");
    }

    draw(ctx, rooms, currentRoomId) {
        // Draw the background of the minimap
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)"; // Semi-transparent black
        ctx.fillRect(this.position.x, this.position.y, this.size.x, this.size.y);

        // Define the size of the rooms
        const roomWidth = this.size.x / numRooms;
        const roomHeight = this.size.y / 3;
        const spacing = 0; // Espaciado entre salas

        // Draw the rooms
        for (let i = 0; i < numRooms; i++) {

            // Get the current room
            const room = rooms.get(i);
            // Define the position of the room according to the index
            const roomX = this.position.x + i * roomWidth;
            const roomY = this.position.y + this.size.y / 3;

            // Draw the current room
            this.drawRoomRect(ctx, room, roomX, roomY, roomWidth - spacing, roomHeight - spacing);

            // If the player is in the room, draw the player rectangle
            if (room.id === currentRoomId) {
                // Set the room as explored
                room.isExplored = true;
                this.drawPlayerRect(ctx, room, roomX, roomY, roomWidth - spacing, roomHeight - spacing);
            }

            // If the room has branches, draw them
            for (const connectionId of room.connections) {
                // Get the connected room
                const connectedRoom = rooms.get(connectionId);
                // Mantain the same position X
                const branchX = roomX;

                // If the room is above, draw it
                if (connectedRoom.type === "button"
                    || connectedRoom.type === "branch1") {
                    // Move the room up
                    const branchY = roomY - roomHeight - spacing;
                    // Draw the room
                    this.drawRoomRect(ctx, connectedRoom, branchX, branchY, roomWidth - spacing, roomHeight - spacing);
                    // Check if the player is in the room
                    if (connectedRoom.id === currentRoomId) {
                        connectedRoom.isExplored = true;
                        this.drawPlayerRect(ctx, connectedRoom, branchX, branchY, roomWidth - spacing, roomHeight - spacing);
                    }
                // If the room is below, draw it
                } else if (connectedRoom.type === "branch2") {
                    // Move the room down
                    const branchY = roomY + roomHeight + spacing;
                    // Draw the room
                    this.drawRoomRect(ctx, connectedRoom, branchX, branchY, roomWidth - spacing, roomHeight - spacing);
                    // Check if the player is in the room
                    if (connectedRoom.id === currentRoomId) {
                        connectedRoom.isExplored = true;
                        this.drawPlayerRect(ctx, connectedRoom, branchX, branchY, roomWidth - spacing, roomHeight - spacing);
                    }
                }
            }
        }
    }

    // Draw the room rectangle
    drawRoomRect(ctx, room, x, y, width, height, color) {

        // If the color is defined, use it
        if (color !== undefined) {
            ctx.fillStyle = color; // Color de la sala
        }
        // If the room is explored, use the color set
        else if (!room.isExplored) {
            if (room.type === "boss") {
                // If the room has a boss, check if its unlocked
                if (game.isButtonPressed) {
                    ctx.fillStyle = "lightgreen";
                } else {
                    ctx.fillStyle = "darkred";
                }
            // If the room is not explored
            } else {
                ctx.fillStyle = "gray";
            }
        }
        // If the room is not explored, use default colors
        else {
            if (room.type === "button") {
                ctx.fillStyle = "lightblue";
            } else {
                ctx.fillStyle = "white";
            }
        }

        // Fill the room rectangle
        ctx.fillRect(x, y, width, height);
        // Add a border
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, width, height);
    }

    // Draw the player rectangle
    drawPlayerRect(ctx, room, x, y, width, height) {
        const innerRectWidth = width * 0.5; // 50% of the width
        const innerRectHeight = height * 0.5; // 50% of the height
        const innerRectX = x + (width - innerRectWidth) / 2; // Centered
        const innerRectY = y + (height - innerRectHeight) / 2; // Centered
        // Draw a rectangle in the center of the room
        this.drawRoomRect(ctx, room, innerRectX, innerRectY, innerRectWidth, innerRectHeight, "lightgreen");
    }
}