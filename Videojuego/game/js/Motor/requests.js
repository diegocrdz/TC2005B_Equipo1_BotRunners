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
 * Date: 24/04/2025
*/

"use strict";

// Get a player by username and password
async function getPlayer(username, password) {
    let response = await fetch('/api/jugadores/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre_usuario: username, contrasena: password })
    });

    if (response.ok) {
        let results = await response.json();

        // Get the player elements from the response
        game.player.id = results.id_jugador;

        console.log(results);

        // Get the statistics for the player to update his data
        setPlayerStats(game.player.id);
        // Get the inventory for the player to update his data
        setPlayerInventory(game.player.id);

        return results;

    } else {
        console.error("Error fetching player:", response.status);
        return null;
    }
}

// Register a new player in the database
async function addPlayer() {
    let response = await fetch('/api/jugadores', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({})
    });
    
    if (response.ok) {
        let results = await response.json();
        console.log(results);
        // Get the player stats from the response
        return results;

    } else {
        console.error("Error adding player:", response.status);
        return null;
    }
}

// Add a new account to the table cuentas
async function addAccount(id, username, password) {
    let response = await fetch('/api/cuentas', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            id_jugador: id,
            nombre_usuario: username,
            contrasena: password
        })
    });
    
    if (response.ok) {
        let results = await response.json();
        console.log(results);
        // Get the player stats from the response
        return results;

    } else {
        console.error("Error adding player:", response.status);
        return null;
    }
}

// Check if a username already exists in the cuentas table
async function checkUsername(username) {
    let response = await fetch(`/api/cuentas/${username}`, {
        method: 'GET',
    });

    if (response.ok) {
        let results = await response.json();
        // Check if the username already exists
        if (results) {
            return true;
        } else {
            return false;
        }
    // If the status is 404, it means the username does not exist
    // So we return false
    } else if (response.status === 404) {
        // If the username does not exist, return false
        console.log("El nombre está disponible");
        return false;
    } else {
        console.error("Error checking username:", response.status);
        return null;
    }
}

async function registerPlayer(username, password) {
    // Check if the username already exists
    let usernameExists = await checkUsername(username);
    if (usernameExists) {
        console.error("El nombre de usuario ya existe");
        return null;
    } else {
        // Create a new player in the database
        const result = await addPlayer();
        // Set the player id
        game.player.id = result.id;
        // Create a new account in the database
        const accountResult = await addAccount(game.player.id, username, password);
        console.log("Jugador registrado");
        return accountResult;
    }
}

// Statistics

// Set the statistics of a player after logging in
async function setPlayerStats(id) {
    let response = await fetch(`/api/stats/${id}`, {
        method: 'GET',
    });
    
    if (response.ok) {
        let results = await response.json();
        console.log("Se recuperaron los datos", results);

        // Check if the results are not empty
        if (results) { 
            // Set the player statistics
            game.player.bestTime = results.tiempo_mejor_partida;
            game.player.deaths = results.numero_muertes;
            game.player.enemiesKilled = results.enemigos_derrotados;
            game.player.outgoingDamage = results.dano_infligido;
            game.player.receivedDamage = results.dano_recibido;
            game.player.completedGames = results.partidas_completadas;
            game.player.meleeCont = results.ataques_cuerpo;
            game.player.gunCont = results.ataques_distancia;
            if (results.partidas_completadas > 0) {
                game.player.firstTimePlaying = false;
            }
        } else {
            console.warn("No statistics found for the player.");
        }
    } else {
        console.error("Error fetching statistics:", response.status);
        return null;
    }
}

// Set the inventory of a player after logging in
async function setPlayerInventory(id) {
    let response = await fetch(`/api/inventory/${id}`, {
        method: 'GET',
    });

    if (response.ok) {
        let results = await response.json();
        console.log("Se recuperó el inventario:", results);

        if (results) {
            // Set the melee weapon
            if (results[0].id_arma_cuerpo === "brazo robotico") {
                game.player.meleeWeapon = weapons.arm;
            } else if (results[0].id_arma_cuerpo === "llave de acero") {
                game.player.meleeWeapon = weapons.roboticArm;
            }
            // Set the gun weapon
            if (results[0].id_arma_distancia === "pistola laser lenta") {
                game.player.gunWeapon = weapons.slow_gun;
            } else if (results[0].id_arma_distancia === "pistola laser rapida") {
                game.player.gunWeapon = weapons.fast_gun;
            } else {
                game.player.gunWeapon = null;
            }
            console.log(game.player.meleeWeapon);
            console.log(game.player.gunWeapon);
        }
        return results;
    } else {
        console.error("Error fetching inventory:", response.status);
        return null;
    }
}

// Update the statistics of a player
// This function is called when:
// - The player wins the game
// - The player pauses the game
// - The player dies
// - The player completes a level
async function updatePlayerStats(id) {
    let response = await fetch(`/api/stats/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            tiempo_mejor_partida: game.player.bestTime,
            numero_muertes: game.player.deaths,
            enemigos_derrotados: game.player.enemiesKilled,
            dano_infligido: game.player.outgoingDamage,
            dano_recibido: game.player.receivedDamage,
            partidas_completadas: game.player.completedGames,
            ataques_cuerpo: game.player.meleeCont,
            ataques_distancia: game.player.gunCont
        })
    });
    if (response.ok) {
        let results = await response.json();
        console.log("Statistics updated successfully:", results);
        // Update the inventory of the player
        updatePlayerInventory(id);
        return results;
    } else {
        console.error("Error updating statistics:", response.status);
        return null;
    }
}

// Update the inventory of a player
async function updatePlayerInventory(id) {
    // Check player weapons
    let meleeWeapon = "";
    let gunWeapon = "";
    if (game.player.meleeWeapon === weapons.arm) {
        meleeWeapon = "brazo robotico";
    } else if (game.player.meleeWeapon === weapons.roboticArm) {
        meleeWeapon = "llave de acero";
    }
    if (game.player.gunWeapon === weapons.slow_gun) {
        gunWeapon = "pistola laser lenta";
    } else if (game.player.gunWeapon === weapons.fast_gun) {
        gunWeapon = "pistola laser rapida";
    } else {
        gunWeapon = null;
    }
    console.log(game.player);

    let response = await fetch(`/api/inventory/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            id_arma_cuerpo: meleeWeapon,
            id_arma_distancia: gunWeapon
        })
    });
    if (response.ok) {
        let results = await response.json();
        console.log("Inventory updated successfully:", results);
        return results;
    } else {
        console.error("Error updating inventory:", response.status);
        return null;
    }
}

// Get statistics for a specific player
async function getStatistics(id) {
    let response = await fetch(`/api/stats/view/${id}`, {
        method: 'GET',
    });

    const container = document.getElementById("statsResults");
    container.innerHTML = ""; // Clear previous results
    
    if (response.ok && id !== null) {
        
        let results = await response.json();

        // Eliminate the id field from the results
        delete results.id_jugador;

        // Create a table to display the statistics
        const table = document.createElement("table");
        
        // Get an array of the key value pairs
        // Example: If the results are {a: 1}
        // The array will be ["a", 1]
        for (const [key, value] of Object.entries(results)) {
            // Create a new row
            const row = table.insertRow(-1);
            // In the first cell, insert the key
            const cellKey = row.insertCell(0);
            cellKey.innerText = key
            // In the second cell, insert the value
            const cellValue = row.insertCell(1);
            cellValue.innerText = value
        }
        // Append the table to the container
        container.appendChild(table);
        
    } else {
        let errorMessage = document.createElement("p");
        errorMessage.innerText = "Inicia sesión para ver tus estadísticas";
        container.appendChild(errorMessage);
        console.error("Error fetching statistics:", response.status);
        return null;
    }
}

// Get global statistics view
async function getGlobalStatistics() {
    let response = await fetch(`/api/stats/`, {
        method: 'GET',
    });
    
    if (response.ok) {
        let results = await response.json();
        const container = document.getElementById("statsResults");
        container.innerHTML = ""; // Clear previous results

        // Create a table to display the statistics
        const table = document.createElement("table");
        
        // Get an array of the key value pairs
        // Example: If the results are {a: 1}
        // The array will be ["a", 1]
        for (const [key, value] of Object.entries(results)) {
            // Create a new row
            const row = table.insertRow(-1);
            // In the first cell, insert the key
            const cellKey = row.insertCell(0);
            cellKey.innerText = key
            // In the second cell, insert the value
            const cellValue = row.insertCell(1);
            cellValue.innerText = value
        }
        // Append the table to the container
        container.appendChild(table);
        
    } else {
        console.error("Error fetching statistics:", response.status);
        return null;
    }
}

// Get the top statistics view
async function getTopStatistics() {
    let response = await fetch(`/api/top`, {
        method: 'GET',
    });
    
    if (response.ok) {
        let results = await response.json();
        const container = document.getElementById("statsResults");
        container.innerHTML = ""; // Clear previous results

        if(results.length > 0) {
            // Get the keys of the first object to use as headers
            const headers = Object.keys(results[0])
            // Get all the values of the objects
            const values = Object.values(results)
            
            // Create a table to display the statistics
            let table = document.createElement("table")
    
            // Create the header row
            let tr = table.insertRow(-1)                  
            
            // Create the header cells
            for(const header of headers)
            {
                let th = document.createElement("th")     
                th.innerHTML = header
                tr.appendChild(th)
            }

            // Create the body rows
            for(const row of values)
            {
                let tr = table.insertRow(-1)

                for(const key of Object.keys(row))
                {
                    let tabCell = tr.insertCell(-1)
                    tabCell.innerHTML = row[key]
                }
            }
            container.appendChild(table);
        }
    } else {
        console.error("Error fetching statistics:", response.status);
        return null;
    }
}

// Add statistics to the database
async function addStatistics() {
    let response = await fetch('/api/stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            tiempo_mejor_partida: game.player.bestTime,
            numero_muertes: game.player.deaths,
            enemigos_derrotados: game.player.enemiesKilled,
            dano_infligido: game.player.outgoingDamage,
            dano_recibido: game.player.receivedDamage,
            partidas_completadas: game.player.completedGames
        })
    });

    if (response.ok) {
        let results = await response.json();
        console.log("Statistics added successfully:", results);
        return results;
    } else {
        console.error("Error adding statistics:", response.status);
        return null;
    }
}

// Update statistics in the database
async function updateStatistics() {
    let response = await fetch(`/api/stats/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            tiempo_mejor_partida: game.player.bestTime,
            numero_muertes: game.player.deaths,
            enemigos_derrotados: game.player.enemiesKilled,
            dano_infligido: game.player.outgoingDamage,
            dano_recibido: game.player.receivedDamage,
            partidas_completadas: game.player.completedGames
        })
    });

    if (response.ok) {
        let results = await response.json();
        console.log("Statistics updated successfully:", results);
        return results;
    } else {
        console.error("Error updating statistics:", response.status);
        return null;
    }
}