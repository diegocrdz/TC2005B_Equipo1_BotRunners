// Minimap Generator
function createMinimap(rooms) {
    // SVG preparation
    const svgWidth = 200;
    const svgHeight = 200;
    const centerX = svgWidth / 2;
    const centerY = svgHeight / 2;
    const roomRadius = 20;
    const connectionLength = 50;

    // Color mapping for room types
    const roomTypeColors = {
        "start": "#4CAF50",      // Green for start room
        "boss": "#F44336",        // Red for boss room
        "normal": "#2196F3",      // Blue for normal rooms
        "button": "#FF9800",      // Orange for button rooms
        "branch1": "#9C27B0",     // Purple for branch rooms
        "branch2": "#9C27B0",     // Purple for branch rooms
        "ladder1": "#795548",     // Brown for ladder rooms
        "ladder2": "#795548"      // Brown for ladder rooms
    };

    // Create SVG element
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", svgWidth);
    svg.setAttribute("height", svgHeight);
    svg.setAttribute("style", "position: absolute; top: 10px; right: 10px; background: rgba(240,240,240,0.8);");

    // Background rect
    const bgRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    bgRect.setAttribute("width", "100%");
    bgRect.setAttribute("height", "100%");
    bgRect.setAttribute("fill", "#F0F0F0");
    bgRect.setAttribute("opacity", "0.8");
    svg.appendChild(bgRect);

    // Title
    const title = document.createElementNS("http://www.w3.org/2000/svg", "text");
    title.setAttribute("x", "10");
    title.setAttribute("y", "20");
    title.setAttribute("font-family", "Arial");
    title.setAttribute("font-size", "12");
    title.setAttribute("fill", "black");
    title.textContent = "Minimap";
    svg.appendChild(title);

    // Calculate room positions in a circular layout
    const roomCount = rooms.size;
    const angleStep = (2 * Math.PI) / roomCount;

    rooms.forEach((room, index) => {
        const angle = index * angleStep;
        const x = centerX + Math.cos(angle) * connectionLength;
        const y = centerY + Math.sin(angle) * connectionLength;

        // Room circle
        const roomCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        roomCircle.setAttribute("cx", x);
        roomCircle.setAttribute("cy", y);
        roomCircle.setAttribute("r", roomRadius);
        roomCircle.setAttribute("fill", roomTypeColors[room.type] || '#607D8B');
        roomCircle.setAttribute("stroke", "black");
        roomCircle.setAttribute("stroke-width", "2");
        svg.appendChild(roomCircle);

        // Room type label
        const roomLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
        roomLabel.setAttribute("x", x);
        roomLabel.setAttribute("y", y);
        roomLabel.setAttribute("text-anchor", "middle");
        roomLabel.setAttribute("alignment-baseline", "middle");
        roomLabel.setAttribute("font-family", "Arial");
        roomLabel.setAttribute("font-size", "10");
        roomLabel.setAttribute("fill", "white");
        roomLabel.textContent = index;
        svg.appendChild(roomLabel);

        // Draw connections
        room.connections.forEach(connectionId => {
            if (connectionId > index) {  // Avoid drawing duplicate connections
                const connectedRoom = rooms.get(connectionId);
                const connAngle = connectionId * angleStep;
                const connX = centerX + Math.cos(connAngle) * connectionLength;
                const connY = centerY + Math.sin(connAngle) * connectionLength;

                const connection = document.createElementNS("http://www.w3.org/2000/svg", "line");
                connection.setAttribute("x1", x);
                connection.setAttribute("y1", y);
                connection.setAttribute("x2", connX);
                connection.setAttribute("y2", connY);
                connection.setAttribute("stroke", "#616161");
                connection.setAttribute("stroke-width", "2");
                connection.setAttribute("stroke-dasharray", "5,5");
                svg.appendChild(connection);
            }
        });
    });

    return svg;
}

// Function to add minimap to the game
function addMinimapToGame(rooms) {
    const minimap = createMinimap(rooms);
    document.body.appendChild(minimap);
}

// You can call this after generating levels
// addMinimapToGame(rooms);