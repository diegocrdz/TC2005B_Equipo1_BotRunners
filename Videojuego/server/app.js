/*
 * Endpoints to communicate with the database.
 *
 * Team BotRunners:
 * - Diego Córdova Rodríguez, A01781166
 * - Lorena Estefanía Chewtat Torres, A01785378
 * - Eder Jezrael Cantero Moreno, A01785888
 *
 * Date: 07/04/2025
*/

"use strict"

// Importing modules
import express from 'express'

// The mysql2/promise module is used to connect to the MySQL database.
// The promise version of the module is used to avoid the use of callbacks and instead use the async/await syntax.
import mysql from 'mysql2/promise'
import fs from 'fs'

// Start the express server on the port
const app = express()
const port = 3000

app.use(express.json())
// Add the direcories where the static files of the game are located
app.use(express.static('../game'))
app.use('/Videojuego', express.static('../../Videojuego'))
app.use('/assets', express.static('../assets'))
app.use('/docs', express.static('../docs'))

// Function to connect to the MySQL database
async function connectToDB()
{
    return await mysql.createConnection({
        host:'localhost',
        user:'oc_user',
        password:'skippylover26',
        database:'overclocked'
    })
}

// Routes definition and handling
app.get('/', (request,response)=>{
    fs.readFile('../game/html/game.html', 'utf8', (err, html)=>{
        if(err) response.status(500).send('There was an error: ' + err)
        console.log('Loading page...')
        response.send(html)
    })
})

// ############# players #############

// Get all users from the database and return them as a JSON object
app.get('/api/jugadores', async (request, response) => {
    let connection = null

    try {
        connection = await connectToDB()
        const [results, fields] = await connection.execute('SELECT * FROM jugadores')

        console.log(`${results.length} rows returned`)
        console.log(results)
        response.json(results)
    }
    catch(error) {
        response.status(500)
        response.json(error)
        console.log(error)
    }
    finally {
        if(connection!==null) 
        {
            connection.end()
            console.log("Connection closed succesfully!")
        }
    }
})

// Get a specific user from the database and return it as a JSON object
app.get('/api/jugadores/:id', async (request, response) => {
    let connection = null

    try {
        connection = await connectToDB()

        const [results_user, _] = await connection.query(
            'SELECT * FROM jugadores WHERE id_jugador= ?',
            [request.params.id]
        )
        
        console.log(`${results_user.length} rows returned`)
        response.json(results_user)
    }
    catch(error) {
        response.status(500)
        response.json(error)
        console.log(error)
    }
    finally {
        if(connection!==null) {
            connection.end()
            console.log("Connection closed succesfully!")
        }
    }
})

// Authenticate a user by checking if the username and password match in the database
// Return the user object if the credentials are valid
app.post('/api/jugadores/auth', async (request, response) => {
    let connection = null;

    try {
        const { nombre_usuario, contrasena } = request.body;

        if (!nombre_usuario || !contrasena) {
            return response.status(400).json({ error: "Missing username or password" });
        }

        connection = await connectToDB();

        // Query to find the player by username and password
        const [results_user] = await connection.query(
            'SELECT * FROM jugadores WHERE nombre_usuario = ? AND contrasena = ?',
            [nombre_usuario, contrasena]
        );

        if (results_user.length === 0) {
            return response.status(401).json({ error: "Invalid credentials" });
        }

        console.log(`${results_user.length} rows returned`);
        response.json(results_user[0]); // Return the authenticated user
    } catch (error) {
        response.status(500).json({ error: "Internal server error" });
        console.log(error);
    } finally {
        if (connection !== null) {
            connection.end();
            console.log("Connection closed successfully!");
        }
    }
});

// Insert a new user into the database and return a JSON object with the id of the new user
app.post('/api/jugadores', async (request, response)=>{

    let connection = null

    try
    {    
        connection = await connectToDB()

        const [results, fields] = await connection.query(
            'INSERT INTO jugadores SET ?',
            request.body
        )
        
        console.log(`${results.affectedRows} row inserted`)
        response.status(201).json({'message': "Data inserted correctly.", "id": results.insertId})
    }
    catch(error)
    {
        response.status(500)
        response.json(error)
        console.log(error)
    }
    finally
    {
        if(connection!==null) 
        {
            connection.end()
            console.log("Connection closed succesfully!")
        }
    }
})

// Update a user in the database and return a JSON object with the number of rows updated
app.put('/api/jugadores', async (request, response) => {

    let connection = null

    try {
        connection = await connectToDB()

        const [results, fields] = await connection.query(
            'UPDATE jugadores SET nombre_usuario = ?, contrasena = ? WHERE id_jugador= ?',
            [request.body['nombre_usuario'], request.body['contrasena'], request.body['id_jugador']]
        )
        
        console.log(`${results.affectedRows} rows updated`)
        response.json({'message': `Data updated correctly: ${results.affectedRows} rows updated.`})
    }
    catch(error) {
        response.status(500)
        response.json(error)
        console.log(error)
    }
    finally {
        if(connection!==null) {
            connection.end()
            console.log("Connection closed succesfully!")
        }
    }
})

// Delete a user from the database and return a JSON object with the number of rows deleted
app.delete('/api/jugadores/:id', async (request, response)=>{

    let connection = null

    try {
        connection = await connectToDB()

        const [results, fields] = await connection.query(
            'DELETE FROM jugadores WHERE id_jugador = ?',
            [request.params.id])
        
        console.log(`${results.affectedRows} row deleted`)
        response.json({'message': `Data deleted correctly: ${results.affectedRows} rows deleted.`})
    }
    catch(error) {
        response.status(500)
        response.json(error)
        console.log(error)
    }
    finally {
        if(connection!==null) {
            connection.end()
            console.log("Connection closed succesfully!")
        }
    }
})

// ############# stats #############

// Get the statistics of a specific user from the db
app.get('/api/stats/:id', async (request, response) => {
    let connection = null

    try {
        connection = await connectToDB()
        const [results] = await connection.query(
            'SELECT * FROM estadisticas where id_jugador= ?',
            [request.params.id])
        
        console.log(`${results.affectedRows} rows returned`)
        response.json(results[0])
    }
    catch (error) {
        response.status(500).json(error)
        console.log(error)
    }
    finally {
        if(connection!==null) {
            connection.end()
            console.log("Connection closed succesfully!")
        }
    }
})

// Get the global statistics view from the db
app.get('/api/stats', async (request, response) => {
    let connection = null

    try {
        connection = await connectToDB()
        const [results] = await connection.query('SELECT * FROM estadisticas_globales')
        
        console.log(`${results.affectedRows} rows returned`)
        response.json(results[0])
    }
    catch (error) {
        response.status(500).json(error)
        console.log(error)
    }
    finally {
        if(connection!==null) {
            connection.end()
            console.log("Connection closed succesfully!")
        }
    }
})

// Get the top 5 players from the db
app.get('/api/top', async (request, response) => {
    let connection = null

    try {
        connection = await connectToDB()
        const [results] = await connection.query('SELECT * FROM top_5_jugadores')
        
        console.log(`${results.affectedRows} rows returned`)
        response.json(results)
    }
    catch (error) {
        response.status(500).json(error)
        console.log(error)
    }
    finally {
        if(connection!==null) {
            connection.end()
            console.log("Connection closed succesfully!")
        }
    }
})

// Update the statistics of a specific user in the db
app.put('/api/stats/:id', async (request, response) => {
    let connection = null

    try {
        connection = await connectToDB()

        const [results, fields] = await connection.query(
            'UPDATE estadisticas SET ? WHERE id_jugador= ?',
            [request.body, request.params.id]
        )
        
        console.log(`${results.affectedRows} rows updated`)
        response.json({'message': `Data updated correctly: ${results.affectedRows} rows updated.`})
    }
    catch(error) {
        response.status(500)
        response.json(error)
        console.log(error)
    }
    finally {
        if(connection!==null) {
            connection.end()
            console.log("Connection closed succesfully!")
        }
    }
})

// Print the port where the server is listening
app.listen(port, ()=> {
    console.log(`App listening at http://localhost:${port}`)
})