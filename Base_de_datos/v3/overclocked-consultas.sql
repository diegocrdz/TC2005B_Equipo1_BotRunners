-- Consltas de Base de Datos Overclocked
-- Version 3.0
-- Fecha: 11 de abril de 2025
-- Desarrollado por: Equipo BotRunners
-- Desripción: Consultas de prueba para la base de datos de Overclocked
-- Desarrollado como parte del bloque TC2005B - Tecnológico de Monterrey, Campus Santa Fe

USE overclocked;

--
-- Mostrar tablas normales una a una
--

SELECT * FROM jugadores;
SELECT * FROM cuentas;
SELECT * FROM estadisticas;
SELECT * FROM habilidades;
SELECT * FROM armas;
SELECT * FROM partidas;
SELECT * FROM niveles;
SELECT * FROM salas;
SELECT * FROM enemigos;
SELECT * FROM objetos;

--
-- Mostrar tablas intermedias una a una
--

SELECT * FROM jugadores_habilidades;
SELECT * FROM inventarios;
SELECT * FROM enemigos_salas;
SELECT * FROM objetos_salas;

--
-- Mostrar vistas
--

SELECT * FROM estadisticas_globales;
SELECT * FROM historial_partidas;
SELECT * FROM top_5_jugadores;
SELECT * FROM estadisticas_jugadores;

--
-- Consultas de prueba
--

# Mostrar las habilidades poseídas por los jugadores con id del jugador, su nombre, id de la habilidad y su nombre
SELECT 
    overclocked.jugadores.id_jugador,
    overclocked.jugadores.nombre_usuario,
    overclocked.habilidades.id_habilidad,
    overclocked.habilidades.nombre
FROM overclocked.jugadores
JOIN overclocked.jugadores_habilidades
USING (id_jugador)
JOIN overclocked.habilidades
USING (id_habilidad)
ORDER BY id_jugador;