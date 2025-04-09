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
        let id  = results.id_jugador;
        game.player.id = id; // Set the player ID in the game object
        console.log(results);
        updateStatistics();

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
        addStatistics();
        return results;

    } else {
        console.error("Error adding player:", response.status);
        return null;
    }
}

// Statistics

// Get statistics for a specific player
async function getStatistics(id) {
    let response = await fetch(`/api/stats/${id}`, {
        method: 'GET',
    });
    
    if (response.ok) {
        
        let results = await response.json();
        const container = document.getElementById("statsResults");
        container.innerHTML = ""; // Clear previous results

        if (results.length > 0) {
            const table = document.createElement("table");

            for (const [key, value] of Object.entries(results)) {
                const row = table.insertRow(-1);

                const cellKey = row.insertCell(0);
                cellKey.innerText = key
                
                const cellValue = row.insertCell(1);
                cellValue.innerText = value

            }
            container.appendChild(table);
        } else {
            const message = document.createElement("p");
            message.innerText = "No statistics available for this player.";
            container.appendChild(message);
        }
    } else {
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

        const table = document.createElement("table");

        for (const [key, value] of Object.entries(results)) {
            const row = table.insertRow(-1);

            const cellKey = row.insertCell(0);
            cellKey.innerText = key
            
            const cellValue = row.insertCell(1);
            cellValue.innerText = value

        }
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
            const headers = Object.keys(results[0])
            const values = Object.values(results)
    
            let table = document.createElement("table")
    
            let tr = table.insertRow(-1)                  
    
            for(const header of headers)
            {
                let th = document.createElement("th")     
                th.innerHTML = header
                tr.appendChild(th)
            }

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

async function addStatistics() {
    let response = await fetch('/api/stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            tiempo_mejor_partida: game.player.bestTime,
            numero_muertes: game.player.deaths,
            enemigos_derrotados: game.player.enemiesKilled,
            dano_infligido: game.player.incomingDamage,
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

async function updateStatistics() {
    let response = await fetch(`/api/stats/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            tiempo_mejor_partida: game.player.bestTime,
            numero_muertes: game.player.deaths,
            enemigos_derrotados: game.player.enemiesKilled,
            dano_infligido: game.player.incomingDamage,
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