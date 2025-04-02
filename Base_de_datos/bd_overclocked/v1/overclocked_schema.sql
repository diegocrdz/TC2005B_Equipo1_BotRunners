-- Esquema de Base de Datos Overclocked
-- Version 1
-- 2 de abril de 2025

SET NAMES utf8mb4;
SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL';

DROP SCHEMA IF EXISTS overclocked;
CREATE SCHEMA overclocked;
USE overclocked;

--
-- Estructura para la tabla jugador
--

CREATE TABLE jugador (
  id_jugador SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
  nombre_usuario VARCHAR(15) NOT NULL,
  clave VARCHAR(45) NOT NULL,
  tipo_cuenta ENUM("registrado", "invitado"),
  nivel_xp SMALLINT UNSIGNED,
  cantidad_xp SMALLINT UNSIGNED,
  salud SMALLINT UNSIGNED,
  dano SMALLINT UNSIGNED,
  resistencia SMALLINT UNSIGNED,
  PRIMARY KEY (id_jugador)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Estructura para la tabla estadisticas
--

CREATE TABLE estadisticas (
  id_estadisticas SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_jugador SMALLINT UNSIGNED NOT NULL,
  tiempo_mejor_partida TIME,
  numero_muertes SMALLINT UNSIGNED,
  enemigos_derrotados SMALLINT UNSIGNED,
  dano_infligido SMALLINT UNSIGNED,
  dano_recibido SMALLINT UNSIGNED,
  partidas_completadas SMALLINT UNSIGNED,
  PRIMARY KEY (id_estadisticas),
  FOREIGN KEY (id_jugador) references jugador(id_jugador)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Estructura para la tabla habilidades
--

CREATE TABLE habilidades (
  id_habilidad SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
  tipo ENUM("mejora de estadisticas", "movilidad"),
  nombre ENUM("salud", "dano", "proteccion", "doble salto", "dash"),
  desbloqueado BOOL,
  velocidad_uso FLOAT,
  PRIMARY KEY (id_habilidad)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Estructura para la tabla armas
--

CREATE TABLE armas (
  id_arma SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
  nombre ENUM("brazo robotico", "llave de acero", "pistola laser lenta", "pistola laser rapida"),
  tipo ENUM("cuerpo a cuerpo", "distancia"),
  dano SMALLINT UNSIGNED,
  velocidad_ataque FLOAT,
  desbloqueo_nivel SMALLINT UNSIGNED,
  PRIMARY KEY (id_arma)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Estructura para la tabla partidas
--

CREATE TABLE partidas (
  id_partida SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
  fecha_inicio DATETIME DEFAULT CURRENT_TIMESTAMP,
  fecha_fin DATETIME,
  id_jugador SMALLINT UNSIGNED,
  PRIMARY KEY (id_partida),
  FOREIGN KEY (id_jugador) REFERENCES jugador(id_jugador)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Estructura para la tabla niveles
--

CREATE TABLE niveles (
  id_nivel SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_partida SMALLINT UNSIGNED NOT NULL,
  nombre_nivel ENUM("nivel 1", "nivel 2", "nivel 3"),
  tematica ENUM("escuela", "fabrica", "laboratorio"),
  numero_salas SMALLINT UNSIGNED,
  PRIMARY KEY (id_nivel),
  FOREIGN KEY (id_partida) references partidas(id_partida)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Estructura para la tabla salas
--

CREATE TABLE salas (
  id_sala SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_nivel SMALLINT UNSIGNED NOT NULL,
  numero_objetos SMALLINT,
  numero_enemigos SMALLINT,
  PRIMARY KEY (id_sala),
  FOREIGN KEY (id_nivel) references niveles(id_nivel)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Estructura para la tabla enemigos
--

CREATE TABLE enemigos (
  id_enemigo SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
  tipo ENUM("normal", "pesado", "volador", "jefe"),
  salud SMALLINT UNSIGNED,
  dano SMALLINT UNSIGNED,
  movimiento ENUM("seguir jugador", "ignorar jugador"),
  fase_ataque ENUM("normal", "salto"),
  velocidad_movimiento FLOAT,
  recompensa_xp SMALLINT UNSIGNED,
  PRIMARY KEY (id_enemigo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Estructura para la tabla objetos
--

CREATE TABLE objetos (
  id_objeto SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
  nombre ENUM("puerta", "escalera", "caja", "tuberia", "picos", "boton"),
  tipo ENUM("obstaculo", "interactivo"),
  afecta_jugador BOOL,
  efecto ENUM("daño", "colision", "activar"),
  PRIMARY KEY (id_objeto)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- #########################################################################
-- Tablas intermedias
-- #########################################################################

--
-- Estructura para la tabla jugadores_habilidades
--

CREATE TABLE jugadores_habilidades (
  id_jugador SMALLINT UNSIGNED NOT NULL,
  id_habilidad SMALLINT UNSIGNED NOT NULL,
  PRIMARY KEY (id_jugador, id_habilidad),
  FOREIGN KEY (id_jugador) REFERENCES jugador(id_jugador),
  FOREIGN KEY (id_habilidad) REFERENCES habilidades(id_habilidad)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Estructura para la tabla inventarios
--

CREATE TABLE inventarios (
  id_jugador SMALLINT UNSIGNED NOT NULL,
  id_arma_cuerpo SMALLINT UNSIGNED NOT NULL,
  id_arma_distancia SMALLINT UNSIGNED NOT NULL,
  estado_pocion BOOL,
  curacion_pocion SMALLINT UNSIGNED NOT NULL,
  PRIMARY KEY (id_jugador),
  FOREIGN KEY (id_jugador) REFERENCES jugador(id_jugador),
  FOREIGN KEY (id_arma_cuerpo) REFERENCES armas(id_arma),
  FOREIGN KEY (id_arma_distancia) REFERENCES armas(id_arma)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Estructura para la tabla enemigos_salas
--

CREATE TABLE enemigos_salas (
  id_sala SMALLINT UNSIGNED NOT NULL,
  id_enemigo SMALLINT UNSIGNED NOT NULL,
  enemigos_derrotados BOOL,
  PRIMARY KEY (id_sala, id_enemigo),
  FOREIGN KEY (id_sala) REFERENCES salas(id_sala),
  FOREIGN KEY (id_enemigo) REFERENCES enemigos(id_enemigo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Estructura para la tabla objetos_salas
--

CREATE TABLE objetos_salas (
  id_sala SMALLINT UNSIGNED NOT NULL,
  id_objeto SMALLINT UNSIGNED NOT NULL,
  desbloquea_sala_final BOOL,
  estado ENUM('NA', 'activado', 'desactivado'),
  PRIMARY KEY (id_sala, id_objeto),  -- Clave primaria compuesta
  FOREIGN KEY (id_sala) REFERENCES salas(id_sala),
  FOREIGN KEY (id_objeto) REFERENCES objetos(id_objeto)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Estructura para la tabla partida_nivel_sala
--

CREATE TABLE partida_nivel_sala (
  id_partida SMALLINT UNSIGNED NOT NULL,
  id_nivel SMALLINT UNSIGNED NOT NULL,
  id_sala SMALLINT UNSIGNED NOT NULL,
  PRIMARY KEY (id_partida, id_nivel, id_sala),  -- Clave primaria compuesta
  FOREIGN KEY (id_partida) REFERENCES partidas(id_partida),
  FOREIGN KEY (id_nivel) REFERENCES niveles(id_nivel),
  FOREIGN KEY (id_sala) REFERENCES salas(id_sala)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;