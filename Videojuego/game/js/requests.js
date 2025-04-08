/*
 * Requests to the server
 * After the server is started, the requests are made
 * to the server to get the data from the database.
 *
 * Team BotRunners:
 * - Diego Córdova Rodríguez, A01781166
 * - Lorena Estefanía Chewtat Torres, A01785378
 * - Eder Jezrael Cantero Moreno, A01785888
 *
 * Date: 07/04/2025
*/

// Get a player by username and password
async function getPlayer(username, password) {
    let response = await fetch('/api/jugadores/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre_usuario: username, contrasena: password })
    });

    if (response.ok) {
        let results = await response.json();
        console.log(results);
        return results;
    } else {
        console.error("Error fetching player:", response.status);
        return null;
    }
}

// Register a new player in the database
async function addPlayer(username, password) {
    let response = await fetch('/api/jugadores', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ nombre_usuario: username, contrasena: password })
    });
    
    if (response.ok) {
        let results = await response.json();
        console.log(results);
        return results;
    } else {
        console.error("Error adding player:", response.status);
        return null;
    }
}