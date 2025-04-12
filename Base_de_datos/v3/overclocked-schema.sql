-- Esquema de Base de Datos Overclocked
-- Version 3.0
-- Fecha: 11 de abril de 2025
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
  
  -- Atributos
  nivel_xp INT UNSIGNED NOT NULL DEFAULT 0,
  cantidad_xp INT UNSIGNED NOT NULL DEFAULT 0,
  salud INT UNSIGNED NOT NULL DEFAULT 100,
  dano INT UNSIGNED NOT NULL DEFAULT 10,
  resistencia INT UNSIGNED NOT NULL DEFAULT 0,
  
  -- Llave primaria
  PRIMARY KEY (id_jugador),
  
  -- Índice único sobre la columna id_jugador
  -- Evita que haya jugadores con el mismo id
  UNIQUE KEY idx_id_jugador (id_jugador)
  
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Estructura para la tabla cuentas
-- 

CREATE TABLE cuentas (
  id_jugador INT UNSIGNED NOT NULL AUTO_INCREMENT,
  
  nombre_usuario VARCHAR(15) NOT NULL,
  contrasena VARCHAR(45) NOT NULL,
  
  -- Llave primaria
  PRIMARY KEY (id_jugador),
  -- Índice único sobre la columna nombre_usuario
  -- Evita que haya jugadores con el mismo nombre
  UNIQUE KEY idx_nombre_usuario (nombre_usuario),
  
  -- Índices y llaves foránea
  KEY idx_fk_cuenta_jugador (id_jugador),
  CONSTRAINT fk_cuenta_jugador
  FOREIGN KEY (id_jugador) REFERENCES jugadores(id_jugador)
  ON DELETE CASCADE
  ON UPDATE CASCADE
  
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Estructura para la tabla estadisticas
--

CREATE TABLE estadisticas (
  id_estadisticas INT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_jugador INT UNSIGNED NOT NULL,
  
  -- Atributos
  tiempo_mejor_partida TIME DEFAULT "00:00:00",
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
  id_arma VARCHAR(30) NOT NULL,
  
  -- Atributos
  tipo ENUM("cuerpo a cuerpo", "distancia") NOT NULL,
  dano INT UNSIGNED NOT NULL DEFAULT 0,
  velocidad_ataque FLOAT UNSIGNED NOT NULL DEFAULT 0,
  
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
  id_arma_cuerpo VARCHAR(30) DEFAULT "brazo robotico",
  id_arma_distancia VARCHAR(30) DEFAULT NULL,
  
  -- Atributos
  estado_pocion BOOL NOT NULL DEFAULT FALSE,
  
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


CREATE OR REPLACE VIEW estadisticas_globales AS
SELECT
  -- Total de jugadores
  COUNT(A.id_jugador) AS "Jugadores",
  -- Total de jugadores registrados
  COUNT(B.id_jugador) AS "Registrados",
  -- Total de jugadores no registrados
  (COUNT(A.id_jugador) - COUNT(B.id_jugador)) AS "Invitados",
  -- Promedio de los mejores tiempos
  (SELECT SEC_TO_TIME(ROUND(AVG(TIME_TO_SEC(C.tiempo_mejor_partida)))) FROM overclocked.estadisticas AS C) AS "Tiempo Promedio",
  -- Sumatorias
  SUM(C.enemigos_derrotados) AS "Enemigos Derrotados",
  SUM(C.numero_muertes) AS "Muertes",
  SUM(C.dano_recibido) AS "Daño Recibido",
  SUM(C.dano_infligido) AS "Daño Infligido",
  SUM(C.partidas_completadas) AS "Partidas Completadas"
FROM overclocked.jugadores AS A
LEFT JOIN overclocked.cuentas AS B
USING (id_jugador)
JOIN overclocked.estadisticas AS C
USING (id_jugador);

--
-- Estructura para la vista historial_partidas
--

CREATE OR REPLACE VIEW historial_partidas AS
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

CREATE OR REPLACE VIEW top_5_jugadores AS
SELECT
    A.nombre_usuario AS "Usuario", -- El nombre de usuario proviene de la tabla cuentas
    B.tiempo_mejor_partida AS "Tiempo" -- El tiempo de la mejor partida proviene de la tabla estadisticas
FROM overclocked.cuentas AS A
JOIN overclocked.estadisticas AS B
USING (id_jugador)
WHERE B.tiempo_mejor_partida <> "00:00:00" -- Filtra los jugadores que no han jugado
ORDER BY B.tiempo_mejor_partida -- Ordena por el tiempo de la mejor partida
LIMIT 5; -- Muestra los 5 primeros jugadores

--
-- Estructura para la vista de las estadístcas de los usuarios
--

CREATE OR REPLACE VIEW estadisticas_jugadores AS
SELECT
	A.id_jugador,
	B.tiempo_mejor_partida AS "Mejor Tiempo",
    B.numero_muertes AS "Muertes",
    B.enemigos_derrotados AS "Enemigos Derrotados",
    B.dano_infligido AS "Daño Infligido",
    B.dano_recibido AS "Daño Recibido",
    B.partidas_completadas AS "Victorias"
FROM overclocked.jugadores AS A
JOIN overclocked.estadisticas AS B
USING (id_jugador);