USE overclocked;

# Mostrar la tabla de jugadores
SELECT * FROM overclocked.jugador;

# Mostrar todas las habilidades
SELECT * FROM overclocked.habilidades;

# Mostrar las habilidades poseídas por los jugadores con id del jugador, su nombre, id de la habilidad y su nombre
SELECT 
    overclocked.jugador.id_jugador,
    overclocked.jugador.nombre_usuario,
    overclocked.habilidades.id_habilidad,
    overclocked.habilidades.nombre
FROM overclocked.jugador
JOIN overclocked.jugadores_habilidades
USING (id_jugador)
JOIN overclocked.habilidades
USING (id_habilidad)
ORDER BY id_jugador;

# Mostrar los jugadores con los mejores 5 tiempos
SELECT
    overclocked.jugador.nombre_usuario,
    overclocked.estadisticas.tiempo_mejor_partida
FROM overclocked.jugador
JOIN overclocked.estadisticas
USING (id_jugador)
ORDER BY tiempo_mejor_partida LIMIT 5;