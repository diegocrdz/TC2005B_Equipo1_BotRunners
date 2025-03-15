const SCALE = 29; // Escala de los sprites

function generateRandomLevel(width, height, numObstacles, numRewards, numEnemies, numHeavyEnemies, numFlyingEnemies) {
    let level = Array.from({ length: height }, () => Array(width).fill('.'));
    
    // Bordes del nivel
    for (let x = 0; x < width; x++) { 
        level[0][x] = '#'; 
        level[height - 1][x] = '#'; 
    }
    for (let y = 0; y < height; y++) {
        level[y][0] = '#'; 
        level[y][width - 1] = '#'; 
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
    
    // Colocar enemigos normales (N), pesados (H) y voladores (F)
    // Solo se colocan enemigos entre 1/3 y 2/3 del nivel, en el suelo o en la parte superior
    placeRandomly('N', numEnemies, height - 2, height - 2, Math.floor(width / 3), Math.floor(width / 3) * 2); // En el suelo
    placeRandomly('H', numHeavyEnemies, height - 2, height - 2, Math.floor(width / 3), Math.floor(width / 3) * 2); // En la parte superior
    placeRandomly('F', numFlyingEnemies, Math.floor(height / 3), Math.floor(height / 3) * 2, Math.floor(width / 2), Math.floor(width / 2)); // En la parte superior

    // Colocar un solo obstáculo en el suelo entre 1/3 y 2/3 del nivel
    placeRandomly('#', 1, height - 2, height - 2, Math.floor(width / 3), Math.floor(width / 3) * 2);
    
    // Colocar jugador al inicio del nivel
    level[height - 2][2] = '@';
    
    return level.map(row => row.join('')).join('\n');
}

let GAME_LEVELS = [
    // width, height, numObstacles, numRewards, numEnemies, numHeavyEnemies, numFlyingEnemies
    generateRandomLevel(levelWidth, 16, 10, 1, 1, 1, 1)
];

console.log(GAME_LEVELS[0]);
console.log(GAME_LEVELS[1]);