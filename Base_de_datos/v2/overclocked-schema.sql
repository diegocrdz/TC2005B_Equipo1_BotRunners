-- Esquema de Base de Datos Overclocked
-- Version 1.0
-- Fecha: 2 de abril de 2025
-- Desarrollado por: Equipo BotRunners
-- Desripción: Creación de tablas para el videojuego Overclocked
-- Desarrollado como parte del bloque TC2005B - Tecnológico de Monterrey, Campus Santa Fe

SET NAMES utf8mb4;
SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL';

DROP SCHEMA IF EXISTS overclocked;
CREATE SCHEMA overclocked;
USE overclocked;

--
-- Estructura para la tabla jugadores
--

CREATE TABLE jugadores (
  id_jugador INT UNSIGNED NOT NULL AUTO_INCREMENT,
  
  nombre_usuario VARCHAR(15) NOT NULL,
  contrasena VARCHAR(45) DEFAULT NULL,
  -- Por defecto el tipo de cuenta es invitado
  tipo_cuenta ENUM("registrado", "invitado") NOT NULL DEFAULT "invitado",
  nivel_xp INT UNSIGNED NOT NULL DEFAULT 0,
  cantidad_xp INT UNSIGNED NOT NULL DEFAULT 0,
  salud INT UNSIGNED NOT NULL DEFAULT 100,
  dano INT UNSIGNED NOT NULL DEFAULT 10,
  resistencia INT UNSIGNED NOT NULL DEFAULT 0,
  
  PRIMARY KEY (id_jugador),
  -- Índice único sobre la columna nombre_usuario
  -- Evita que haya jugadores con el mismo nombre
  UNIQUE KEY idx_nombre_usuario (nombre_usuario)
  
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Estructura para la tabla estadisticas
--

CREATE TABLE estadisticas (
  id_estadisticas INT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_jugador INT UNSIGNED NOT NULL,
  
  -- Atributos
  tiempo_mejor_partida TIME DEFAULT NULL,
  numero_muertes INT UNSIGNED NOT NULL DEFAULT 0,
  enemigos_derrotados INT UNSIGNED NOT NULL DEFAULT 0,
  dano_infligido INT UNSIGNED NOT NULL DEFAULT 0,
  dano_recibido INT UNSIGNED NOT NULL DEFAULT 0,
  partidas_completadas INT UNSIGNED NOT NULL DEFAULT 0,
  
  -- Llave primaria
  PRIMARY KEY (id_estadisticas),
  
  -- Índices y llaves foránea
  KEY idx_fk_estadisticas_jugador (id_jugador),
  
  CONSTRAINT fk_estadisticas_jugador
  FOREIGN KEY (id_jugador) REFERENCES jugadores(id_jugador)
  ON DELETE CASCADE
  ON UPDATE CASCADE
  
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Estructura para la tabla habilidades
--

CREATE TABLE habilidades (
  id_habilidad INT UNSIGNED NOT NULL AUTO_INCREMENT,
  
  -- Atributos
  tipo ENUM("mejora de estadisticas", "movilidad") NOT NULL,
  nombre ENUM("salud", "dano", "proteccion", "doble salto", "dash") NOT NULL,
  desbloqueado BOOL NOT NULL DEFAULT FALSE,
  velocidad_uso FLOAT UNSIGNED NOT NULL DEFAULT 0,
  
  -- Llave primaria
  PRIMARY KEY (id_habilidad)
  
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Estructura para la tabla armas
--

CREATE TABLE armas (
  id_arma INT UNSIGNED NOT NULL AUTO_INCREMENT,
  
  -- Atributos
  nombre ENUM("brazo robotico", "llave de acero", "pistola laser lenta", "pistola laser rapida") NOT NULL,
  tipo ENUM("cuerpo a cuerpo", "distancia") NOT NULL,
  dano INT UNSIGNED NOT NULL DEFAULT 0,
  velocidad_ataque FLOAT UNSIGNED NOT NULL DEFAULT 0,
  desbloqueo_nivel INT UNSIGNED NOT NULL DEFAULT 0,
  
  -- Llave primaria
  PRIMARY KEY (id_arma)
  
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Estructura para la tabla partidas
--

CREATE TABLE partidas (
  id_partida INT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_jugador INT UNSIGNED NOT NULL,
  
  -- Atributos
  fecha_inicio DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fecha_fin DATETIME DEFAULT NULL,
  tiempo_partida TIME DEFAULT NULL,
  
  -- Llave primaria
  PRIMARY KEY (id_partida),
  
  -- Índices y llaves foráneas
  KEY idx_fk_partidas_jugador (id_jugador),
  
  CONSTRAINT fk_partidas_jugador
  FOREIGN KEY (id_jugador)
  REFERENCES jugadores (id_jugador)
  ON DELETE CASCADE
  ON UPDATE CASCADE
  
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Estructura para la tabla niveles
--

CREATE TABLE niveles (
  id_nivel INT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_partida INT UNSIGNED NOT NULL,
  
  -- Atributos
  num_nivel SMALLINT UNSIGNED NOT NULL,
  tematica ENUM("escuela", "fabrica", "laboratorio") NOT NULL,
  numero_salas SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  
  -- Llave primaria
  PRIMARY KEY (id_nivel),
  
  -- Índices y llaves foráneas
  KEY idx_fk_niveles_partida (id_partida),

  CONSTRAINT fk_niveles_partida
  FOREIGN KEY (id_partida)
  REFERENCES partidas (id_partida)
  ON DELETE CASCADE
  ON UPDATE CASCADE
  
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Estructura para la tabla salas
--

CREATE TABLE salas (
  id_sala INT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_nivel INT UNSIGNED NOT NULL,
  
  -- Atributos
  tipo ENUM("inicio", "sala2", "normal", "escalera1", "escalera2", "boton", "rama1", "rama2", "jefe") NOT NULL,
  explorada BOOL NOT NULL DEFAULT FALSE,
  num_objetos SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  num_enemigos SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  num_orbes_xp SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  
  -- Llave primaria
  PRIMARY KEY (id_sala),
  
  -- Índices y llaves foráneas
  KEY idx_fk_salas_nivel (id_nivel),
  
  CONSTRAINT fk_salas_nivel
  FOREIGN KEY (id_nivel)
  REFERENCES niveles (id_nivel)
  ON DELETE CASCADE
  ON UPDATE CASCADE
  
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Estructura para la tabla enemigos
--

CREATE TABLE enemigos (
  id_enemigo INT UNSIGNED NOT NULL AUTO_INCREMENT,
  
  -- Atributos
  tipo ENUM("normal", "pesado", "volador", "jefe") NOT NULL,
  salud INT UNSIGNED NOT NULL DEFAULT 100,
  dano INT UNSIGNED NOT NULL DEFAULT 0,
  movimiento ENUM("seguir jugador", "ignorar jugador") NOT NULL,
  fase_ataque ENUM("normal", "salto") NOT NULL,
  velocidad_movimiento FLOAT UNSIGNED NOT NULL DEFAULT 0,
  recompensa_xp SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  
  -- Llave primaria
  PRIMARY KEY (id_enemigo)
  
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Estructura para la tabla objetos
--

CREATE TABLE objetos (
  id_objeto INT UNSIGNED NOT NULL AUTO_INCREMENT,
  
  -- Atributos
  nombre ENUM("puerta", "escalera", "caja", "tuberia", "picos", "boton") NOT NULL,
  tipo ENUM("obstaculo", "interactivo") NOT NULL,
  afecta_jugador BOOL DEFAULT FALSE,
  efecto ENUM("daño", "colision", "activar") NOT NULL,
  
  -- Llave primaria
  PRIMARY KEY (id_objeto)
  
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- #########################################################################
-- Tablas intermedias
-- #########################################################################

--
-- Estructura para la tabla jugadores_habilidades
--

CREATE TABLE jugadores_habilidades (
  id_jugador INT UNSIGNED NOT NULL,
  id_habilidad INT UNSIGNED NOT NULL,
  
  -- Llave compuesta
  PRIMARY KEY (id_jugador, id_habilidad),
  
  -- Índices y llaves foráneas
  KEY idx_jugador (id_jugador),
  KEY idx_habilidad (id_habilidad),
  
  CONSTRAINT fk_jh_jugador
  FOREIGN KEY (id_jugador)
  REFERENCES jugadores (id_jugador)
  ON DELETE CASCADE
  ON UPDATE CASCADE,
  
  CONSTRAINT fk_jh_habilidad
  FOREIGN KEY (id_habilidad)
  REFERENCES habilidades (id_habilidad)
  ON DELETE CASCADE
  ON UPDATE CASCADE
  
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Estructura para la tabla inventarios
--

CREATE TABLE inventarios (
  id_jugador INT UNSIGNED NOT NULL,
  id_arma_cuerpo INT UNSIGNED NOT NULL,
  id_arma_distancia INT UNSIGNED NOT NULL,
  
  -- Atributos
  estado_pocion BOOL NOT NULL DEFAULT FALSE,
  curacion_pocion INT UNSIGNED NOT NULL DEFAULT 0,
  
  -- Llave primaria
  PRIMARY KEY (id_jugador),
  
  -- Índices y llaves foráneas
  KEY idx_fk_inv_arma_cuerpo (id_arma_cuerpo),
  KEY idx_fk_inv_arma_distancia (id_arma_distancia),

  CONSTRAINT fk_inv_jugador
  FOREIGN KEY (id_jugador)
  REFERENCES jugadores (id_jugador)
  ON DELETE CASCADE
  ON UPDATE CASCADE,
  
  CONSTRAINT fk_inv_arma_cuerpo
  FOREIGN KEY (id_arma_cuerpo)
  REFERENCES armas (id_arma)
  ON DELETE RESTRICT
  ON UPDATE CASCADE,
  
  CONSTRAINT fk_inv_arma_distancia
  FOREIGN KEY (id_arma_distancia)
  REFERENCES armas (id_arma)
  ON DELETE RESTRICT
  ON UPDATE CASCADE
  
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Estructura para la tabla enemigos_salas
--

CREATE TABLE enemigos_salas (
  id_sala INT UNSIGNED NOT NULL,
  id_enemigo INT UNSIGNED NOT NULL,
  
  -- Llave primaria compuesta
  PRIMARY KEY (id_sala, id_enemigo),
  
  -- Índices y llaves foráneas
  KEY idx_es_sala (id_sala),
  KEY idx_es_enemigo (id_enemigo),

  CONSTRAINT fk_es_sala
  FOREIGN KEY (id_sala)
  REFERENCES salas (id_sala)
  ON DELETE CASCADE
  ON UPDATE CASCADE,

  CONSTRAINT fk_es_enemigo
  FOREIGN KEY (id_enemigo)
  REFERENCES enemigos (id_enemigo)
  ON DELETE CASCADE
  ON UPDATE CASCADE
  
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Estructura para la tabla objetos_salas
--

CREATE TABLE objetos_salas (
  id_sala INT UNSIGNED NOT NULL,
  id_objeto INT UNSIGNED NOT NULL,
  
  -- Clave primaria compuesta
  PRIMARY KEY (id_sala, id_objeto),
  
  -- Índices y llaves foráneas
  KEY idx_os_sala (id_sala),
  KEY idx_os_objeto (id_objeto),
  
  FOREIGN KEY (id_sala)
  REFERENCES salas (id_sala)
  ON DELETE CASCADE
  ON UPDATE CASCADE,
  
  CONSTRAINT fk_os_objeto
  FOREIGN KEY (id_objeto)
  REFERENCES objetos (id_objeto)
  ON DELETE CASCADE
  ON UPDATE CASCADE
  
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- #########################################################################
-- Vistas
-- #########################################################################

--
-- Estructura para la vista estadisticas_globales
--

CREATE VIEW estadisticas_globales AS
SELECT
  -- Total de juagdores
  COUNT(*) AS num_jugadores_total,
  -- Total de jugadores por tipo de cunta
  SUM(tipo_cuenta = "registrado") AS num_jugadores_registrados,
  SUM(tipo_cuenta = "invitado") AS num_jugadores_invitados,
  -- Promedio de los mejores tiempos
  -- 1. Selecciona tiempo_mejor_partida de la tabla estadísticas en segundos (Ej: 00:01:20 -> 80)
  -- 2. Obtiene el promedio de los tiempos (100 + 120 + 130 / 3 = 116)
  -- 3. Convierte los segundos a tiempo (116 -> (00:01:56)
  (SELECT SEC_TO_TIME(ROUND(AVG(TIME_TO_SEC(tiempo_mejor_partida)))) FROM estadisticas) AS tiempo_mejor_partida_promedio,
  -- Sumatorias
  (SELECT SUM(enemigos_derrotados) FROM overclocked.estadisticas) AS enemigos_derrotados,
  (SELECT SUM(numero_muertes) FROM overclocked.estadisticas) AS muertes_jugador,
  (SELECT SUM(dano_recibido) FROM overclocked.estadisticas) AS dano_total_recibido,
  (SELECT SUM(dano_infligido) FROM overclocked.estadisticas) AS dano_total_infligido,
  (SELECT SUM(partidas_completadas) FROM overclocked.estadisticas) AS num_partidas_completadas
FROM jugadores;

--
-- Estructura para la vista historial_partidas
--

CREATE VIEW historial_partidas AS
SELECT
  p.id_partida,
  n.id_nivel,
  s.id_sala
FROM overclocked.partidas AS p -- Asigna la tabla partidas como p
JOIN overclocked.niveles AS n -- Asigna la tabla niveles como n
USING (id_partida)
JOIN overclocked.salas AS s -- Asigna la salas niveles como s
USING (id_nivel);

--
-- Estructura para la vista de mejores 5 jugadores con menor tiempo en las partidas
--

CREATE VIEW top_5_jugadores AS
SELECT
    overclocked.jugadores.nombre_usuario AS Usuario,
    overclocked.estadisticas.tiempo_mejor_partida AS Tiempo
FROM overclocked.jugadores
JOIN overclocked.estadisticas
USING (id_jugador)
ORDER BY tiempo_mejor_partida LIMIT 5;