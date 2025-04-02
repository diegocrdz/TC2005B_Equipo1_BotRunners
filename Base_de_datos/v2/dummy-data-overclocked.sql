USE overclocked;
-- Jugadores
INSERT INTO jugador (nombre_usuario, clave, tipo_cuenta, nivel_xp, cantidad_xp, salud, dano, resistencia)  
VALUES  
('Lorechewtat', 'Lore123', 'registrado', 10, 3500, 120, 20, 3),  
('Diegocrdz', 'Diegooo1', 'registrado', 12, 4200, 130, 22, 4),  
('EderJez', 'Kenzo21', 'registrado', 8, 2800, 110, 18, 2),  
('AnaKnight', 'ana321', 'registrado', 14, 5000, 140, 25, 5),  
('LuisMaster', 'luis654', 'registrado', 9, 3100, 115, 19, 3),  
('MariaNinja', 'maria987', 'registrado', 11, 3900, 125, 21, 4),  
('PedroShadow', 'pedro123', 'registrado', 7, 2500, 105, 17, 2),  
('ElenaStorm', 'elena456', 'registrado', 13, 4700, 135, 24, 5),  
('JavierBlaze', 'javier789', 'registrado', 6, 2000, 95, 15, 1),  
('CarmenDragon', 'carmen321', 'registrado', 15, 5300, 150, 27, 6),  
('InvitadoA', 'guest001', 'invitado', 2, 500, 80, 10, 1),  
('InvitadoB', 'guest002', 'invitado', 3, 700, 85, 12, 2),  
('InvitadoC', 'guest003', 'invitado', 1, 300, 75, 8, 1),  
('InvitadoD', 'guest004', 'invitado', 4, 1000, 90, 14, 3),  
('HugoFury', 'hugo567', 'registrado', 10, 3500, 120, 20, 3),  
('ValeriaStar', 'valeria890', 'registrado', 12, 4200, 130, 22, 4),  
('RodrigoXtreme', 'rodrigo234', 'registrado', 8, 2800, 110, 18, 2),  
('FernandaAce', 'fernanda678', 'registrado', 14, 5000, 140, 25, 5),  
('PabloTitan', 'pablo910', 'registrado', 9, 3100, 115, 19, 3),  
('AndreaCyber', 'andrea112', 'registrado', 11, 3900, 125, 21, 4),  
('SergioVortex', 'sergio314', 'registrado', 7, 2500, 105, 17, 2),  
('MonicaPhantom', 'monica516', 'registrado', 13, 4700, 135, 24, 5),  
('DiegoSpecter', 'diego718', 'registrado', 6, 2000, 95, 15, 1),  
('IsabelStorm', 'isabel920', 'registrado', 15, 5300, 150, 27, 6),  
('JorgeBlitz', 'jorge123', 'registrado', 5, 1500, 90, 13, 2),  
('NataliaSolar', 'natalia456', 'registrado', 16, 5500, 155, 28, 7),  
('RicardoPyro', 'ricardo789', 'registrado', 4, 1300, 85, 12, 2),  
('VictoriaFalcon', 'victoria321', 'registrado', 17, 5800, 160, 30, 8),  
('EmilioDash', 'emilio654', 'registrado', 3, 1000, 80, 11, 1),  
('DianaNova', 'diana987', 'registrado', 18, 6000, 165, 32, 9);  
-- insertar para partidas

INSERT INTO partidas (fecha_inicio, fecha_fin, id_jugador)  
VALUES  
('2025-04-01 12:00:00', '2025-04-01 12:30:00', FLOOR(1 + (RAND() * 30))),  
('2025-04-01 13:00:00', '2025-04-01 13:45:00', FLOOR(1 + (RAND() * 30))),  
('2025-04-01 14:00:00', '2025-04-01 14:30:00', FLOOR(1 + (RAND() * 30))),  
('2025-04-01 15:00:00', '2025-04-01 15:40:00', FLOOR(1 + (RAND() * 30))),  
('2025-04-01 16:00:00', '2025-04-01 16:20:00', FLOOR(1 + (RAND() * 30))),  
('2025-04-01 17:00:00', '2025-04-01 17:50:00', FLOOR(1 + (RAND() * 30))),  
('2025-04-01 18:00:00', '2025-04-01 18:25:00', FLOOR(1 + (RAND() * 30))),  
('2025-04-01 19:00:00', '2025-04-01 19:30:00', FLOOR(1 + (RAND() * 30))),  
('2025-04-01 20:00:00', '2025-04-01 20:45:00', FLOOR(1 + (RAND() * 30))),  
('2025-04-01 21:00:00', '2025-04-01 21:20:00', FLOOR(1 + (RAND() * 30))),  
('2025-04-02 12:00:00', '2025-04-02 12:30:00', FLOOR(1 + (RAND() * 30))),  
('2025-04-02 13:00:00', '2025-04-02 13:50:00', FLOOR(1 + (RAND() * 30))),  
('2025-04-02 14:00:00', '2025-04-02 14:25:00', FLOOR(1 + (RAND() * 30))),  
('2025-04-02 15:00:00', '2025-04-02 15:40:00', FLOOR(1 + (RAND() * 30))),  
('2025-04-02 16:00:00', '2025-04-02 16:20:00', FLOOR(1 + (RAND() * 30))),  
('2025-04-02 17:00:00', '2025-04-02 17:45:00', FLOOR(1 + (RAND() * 30))),  
('2025-04-02 18:00:00', '2025-04-02 18:30:00', FLOOR(1 + (RAND() * 30))),  
('2025-04-02 19:00:00', '2025-04-02 19:50:00', FLOOR(1 + (RAND() * 30))),  
('2025-04-02 20:00:00', '2025-04-02 20:30:00', FLOOR(1 + (RAND() * 30))),  
('2025-04-02 21:00:00', '2025-04-02 21:40:00', FLOOR(1 + (RAND() * 30))),  
('2025-04-03 12:00:00', '2025-04-03 12:30:00', FLOOR(1 + (RAND() * 30))),  
('2025-04-03 13:00:00', '2025-04-03 13:20:00', FLOOR(1 + (RAND() * 30))),  
('2025-04-03 14:00:00', '2025-04-03 14:45:00', FLOOR(1 + (RAND() * 30))),  
('2025-04-03 15:00:00', '2025-04-03 15:30:00', FLOOR(1 + (RAND() * 30))),  
('2025-04-03 16:00:00', '2025-04-03 16:20:00', FLOOR(1 + (RAND() * 30))),  
('2025-04-03 17:00:00', '2025-04-03 17:40:00', FLOOR(1 + (RAND() * 30))),  
('2025-04-03 18:00:00', '2025-04-03 18:30:00', FLOOR(1 + (RAND() * 30))),  
('2025-04-03 19:00:00', '2025-04-03 19:30:00', FLOOR(1 + (RAND() * 30))),  
('2025-04-03 20:00:00', '2025-04-03 20:45:00', FLOOR(1 + (RAND() * 30))),  
('2025-04-03 21:00:00', '2025-04-03 21:25:00', FLOOR(1 + (RAND() * 30)));

-- Para la tabla partidas:
INSERT INTO niveles (id_partida, nombre_nivel, tematica, numero_salas) VALUES
-- Partida 1: Jugador llegó hasta el nivel 2
(1, 'nivel 1', 'escuela', FLOOR(6 + (RAND() * 9))),
(1, 'nivel 2', 'laboratorio', FLOOR(6 + (RAND() * 9))),

-- Partida 2: Jugador completó los 3 niveles
(2, 'nivel 1', 'escuela', FLOOR(6 + (RAND() * 9))),
(2, 'nivel 2', 'laboratorio', FLOOR(6 + (RAND() * 9))),
(2, 'nivel 3', 'fabrica', FLOOR(6 + (RAND() * 9))),

-- Partida 3: Perdió en el primer nivel
(3, 'nivel 1', 'escuela', FLOOR(6 + (RAND() * 9))),

-- Partida 4: Llegó hasta el nivel 2
(4, 'nivel 1', 'escuela', FLOOR(6 + (RAND() * 9))),
(4, 'nivel 2', 'laboratorio', FLOOR(6 + (RAND() * 9))),

-- Partida 5: Completó los 3 niveles
(5, 'nivel 1', 'escuela', FLOOR(6 + (RAND() * 9))),
(5, 'nivel 2', 'laboratorio', FLOOR(6 + (RAND() * 9))),
(5, 'nivel 3', 'fabrica', FLOOR(6 + (RAND() * 9))),

-- Partida 6: Perdió en el primer nivel
(6, 'nivel 1', 'escuela', FLOOR(6 + (RAND() * 9))),

-- Partida 7: Completó los 3 niveles
(7, 'nivel 1', 'escuela', FLOOR(6 + (RAND() * 9))),
(7, 'nivel 2', 'laboratorio', FLOOR(6 + (RAND() * 9))),
(7, 'nivel 3', 'fabrica', FLOOR(6 + (RAND() * 9))),

-- Partida 8: Llegó hasta el nivel 2
(8, 'nivel 1', 'escuela', FLOOR(6 + (RAND() * 9))),
(8, 'nivel 2', 'laboratorio', FLOOR(6 + (RAND() * 9))),

-- Partida 9: Perdió en el primer nivel
(9, 'nivel 1', 'escuela', FLOOR(6 + (RAND() * 9))),

-- Partida 10: Completó los 3 niveles
(10, 'nivel 1', 'escuela', FLOOR(6 + (RAND() * 9))),
(10, 'nivel 2', 'laboratorio', FLOOR(6 + (RAND() * 9))),
(10, 'nivel 3', 'fabrica', FLOOR(6 + (RAND() * 9))),

-- Partida 11: Llegó hasta el nivel 2
(11, 'nivel 1', 'escuela', FLOOR(6 + (RAND() * 9))),
(11, 'nivel 2', 'laboratorio', FLOOR(6 + (RAND() * 9))),

-- Partida 12: Perdió en el primer nivel
(12, 'nivel 1', 'escuela', FLOOR(6 + (RAND() * 9))),

-- Partida 13: Completó los 3 niveles
(13, 'nivel 1', 'escuela', FLOOR(6 + (RAND() * 9))),
(13, 'nivel 2', 'laboratorio', FLOOR(6 + (RAND() * 9))),
(13, 'nivel 3', 'fabrica', FLOOR(6 + (RAND() * 9))),

-- Partida 14: Llegó hasta el nivel 2
(14, 'nivel 1', 'escuela', FLOOR(6 + (RAND() * 9))),
(14, 'nivel 2', 'laboratorio', FLOOR(6 + (RAND() * 9))),

-- Partida 15: Perdió en el primer nivel
(15, 'nivel 1', 'escuela', FLOOR(6 + (RAND() * 9))),

-- Partida 16: Completó los 3 niveles
(16, 'nivel 1', 'escuela', FLOOR(6 + (RAND() * 9))),
(16, 'nivel 2', 'laboratorio', FLOOR(6 + (RAND() * 9))),
(16, 'nivel 3', 'fabrica', FLOOR(6 + (RAND() * 9))),

-- Partida 17: Llegó hasta el nivel 2
(17, 'nivel 1', 'escuela', FLOOR(6 + (RAND() * 9))),
(17, 'nivel 2', 'laboratorio', FLOOR(6 + (RAND() * 9))),

-- Partida 18: Perdió en el primer nivel
(18, 'nivel 1', 'escuela', FLOOR(6 + (RAND() * 9))),

-- Partida 19: Completó los 3 niveles
(19, 'nivel 1', 'escuela', FLOOR(6 + (RAND() * 9))),
(19, 'nivel 2', 'laboratorio', FLOOR(6 + (RAND() * 9))),
(19, 'nivel 3', 'fabrica', FLOOR(6 + (RAND() * 9))),

-- Partida 20: Llegó hasta el nivel 2
(20, 'nivel 1', 'escuela', FLOOR(6 + (RAND() * 9))),
(20, 'nivel 2', 'laboratorio', FLOOR(6 + (RAND() * 9))),

-- Partida 21: Perdió en el primer nivel
(21, 'nivel 1', 'escuela', FLOOR(6 + (RAND() * 9))),

-- Partida 22: Completó los 3 niveles
(22, 'nivel 1', 'escuela', FLOOR(6 + (RAND() * 9))),
(22, 'nivel 2', 'laboratorio', FLOOR(6 + (RAND() * 9))),
(22, 'nivel 3', 'fabrica', FLOOR(6 + (RAND() * 9))),

-- Partida 23: Llegó hasta el nivel 2
(23, 'nivel 1', 'escuela', FLOOR(6 + (RAND() * 9))),
(23, 'nivel 2', 'laboratorio', FLOOR(6 + (RAND() * 9))),

-- Partida 24: Perdió en el primer nivel
(24, 'nivel 1', 'escuela', FLOOR(6 + (RAND() * 9))),

-- Partida 25: Completó los 3 niveles
(25, 'nivel 1', 'escuela', FLOOR(6 + (RAND() * 9))),
(25, 'nivel 2', 'laboratorio', FLOOR(6 + (RAND() * 9))),
(25, 'nivel 3', 'fabrica', FLOOR(6 + (RAND() * 9))),

-- Partida 26: Llegó hasta el nivel 2
(26, 'nivel 1', 'escuela', FLOOR(6 + (RAND() * 9))),
(26, 'nivel 2', 'laboratorio', FLOOR(6 + (RAND() * 9))),

-- Partida 27: Perdió en el primer nivel
(27, 'nivel 1', 'escuela', FLOOR(6 + (RAND() * 9))),

-- Partida 28: Completó los 3 niveles
(28, 'nivel 1', 'escuela', FLOOR(6 + (RAND() * 9))),
(28, 'nivel 2', 'laboratorio', FLOOR(6 + (RAND() * 9))),
(28, 'nivel 3', 'fabrica', FLOOR(6 + (RAND() * 9))),

-- Partida 29: Perdió en el primer nivel
(29, 'nivel 1', 'escuela', FLOOR(6 + (RAND() * 9))),

-- Partida 30: Llegó hasta el nivel 2
(30, 'nivel 1', 'escuela', FLOOR(6 + (RAND() * 9))),
(30, 'nivel 2', 'laboratorio', FLOOR(6 + (RAND() * 9)));

-- PARA SALAS
INSERT INTO salas (id_nivel, numero_objetos, numero_enemigos) VALUES
-- Salas para Nivel 1 de la Partida 1
(1, 3, 2),
(1, 5, 4),
(1, 2, 1),
(1, 4, 3),
(1, 6, 5),
(1, 3, 2),
(1, 5, 4),
(1, 2, 1),

-- Salas para Nivel 2 de la Partida 1
(2, 6, 5),
(2, 3, 2),
(2, 4, 3),
(2, 5, 4),
(2, 7, 6),
(2, 3, 2),
(2, 6, 5),

-- Salas para Nivel 3 de la Partida 1
(3, 4, 3),
(3, 6, 5),
(3, 5, 4),
(3, 7, 6),
(3, 2, 1),
(3, 3, 2),
(3, 4, 3),
(3, 5, 4),
(3, 6, 5),

-- Salas para Nivel 1 de la Partida 2
(4, 3, 2),
(4, 6, 5),
(4, 2, 1),
(4, 4, 3),
(4, 5, 4),
(4, 7, 6),

-- Salas para Nivel 2 de la Partida 2
(5, 6, 5),
(5, 3, 2),
(5, 4, 3),
(5, 5, 4),
(5, 7, 6),
(5, 3, 2),
(5, 6, 5),
(5, 2, 1),

-- Salas para Nivel 3 de la Partida 2
(6, 4, 3),
(6, 6, 5),
(6, 5, 4),
(6, 7, 6),
(6, 2, 1),
(6, 3, 2),
(6, 4, 3),

-- Salas para Nivel 1 de la Partida 3
(7, 3, 2),
(7, 6, 5),
(7, 2, 1),
(7, 4, 3),
(7, 5, 4),
(7, 7, 6),
(7, 3, 2),

-- Salas para Nivel 2 de la Partida 3
(8, 6, 5),
(8, 3, 2),
(8, 4, 3),
(8, 5, 4),
(8, 7, 6),
(8, 3, 2),
(8, 6, 5),
(8, 2, 1),

-- Salas para Nivel 3 de la Partida 3
(9, 4, 3),
(9, 6, 5),
(9, 5, 4),
(9, 7, 6),
(9, 2, 1),
(9, 3, 2),
(9, 4, 3),
(9, 5, 4);


-- TABLA INTERMEDIA ENEMIGOS SALAS:

-- Sala 2 del Nivel 1 (solo un enemigo normal)
INSERT INTO enemigos_salas (id_sala, id_enemigo, enemigos_derrotados) VALUES 
(2, 1, TRUE);  -- Solo un enemigo normal en la sala 2 del nivel 1

-- Sala 6 de cada nivel (solo un jefe)
INSERT INTO enemigos_salas (id_sala, id_enemigo, enemigos_derrotados) VALUES 
(6, 8, TRUE),  -- Jefe del nivel 1
(12, 9, TRUE), -- Jefe del nivel 2
(18, 10, FALSE); -- Jefe del nivel 3

-- Otras salas (máximo 3 enemigos por sala)
INSERT INTO enemigos_salas (id_sala, id_enemigo, enemigos_derrotados) VALUES 
(3, 2, TRUE), (3, 4, TRUE), -- Sala 3 (nivel 1)
(4, 1, TRUE), (4, 3, TRUE), (4, 5, TRUE), -- Sala 4 (nivel 1)
(5, 6, TRUE), (5, 7, TRUE), -- Sala 5 (nivel 1)
(7, 2, TRUE), (7, 5, TRUE), -- Sala 7 (nivel 2)
(8, 1, TRUE), (8, 4, TRUE), (8, 7, TRUE), -- Sala 8 (nivel 2)
(9, 3, TRUE), (9, 6, TRUE), -- Sala 9 (nivel 2)
(10, 5, TRUE), (10, 2, TRUE), -- Sala 10 (nivel 2)
(11, 4, TRUE), (11, 6, TRUE), -- Sala 11 (nivel 2)
(13, 2, TRUE), (13, 5, TRUE), (13, 7, TRUE), -- Sala 13 (nivel 3)
(14, 3, TRUE), (14, 6, TRUE), -- Sala 14 (nivel 3)
(15, 1, TRUE), (15, 4, TRUE), (15, 7, FALSE); -- Sala 15 (nivel 3)

-- TABLA ENEMIGOS (se toma en cuenta que solo las sextas salas tienen jefes, la sexta sala del nivel 3 genera al jefe final en estado de ataque normal)
INSERT INTO enemigos (tipo, salud, dano, movimiento, fase_ataque, velocidad_movimiento, recompensa_xp) VALUES
-- Enemigos normales
('normal', 100, 10, 'seguir jugador', NULL, 1.2, 50),
('normal', 120, 12, 'seguir jugador', NULL, 1.0, 60),
('normal', 80, 8, 'ignorar jugador', NULL, 1.5, 40),

-- Enemigos pesados
('pesado', 200, 20, 'seguir jugador', NULL, 0.8, 100),
('pesado', 220, 25, 'seguir jugador', NULL, 0.7, 120),

-- Enemigos voladores
('volador', 90, 15, 'seguir jugador', NULL, 1.8, 70),
('volador', 100, 18, 'seguir jugador', NULL, 1.6, 80),

-- Jefes (uno por nivel)
('jefe', 500, 50, 'seguir jugador', NULL, 1.0, 500), -- Nivel 1
('jefe', 600, 60, 'seguir jugador', NULL, 0.9, 600), -- Nivel 2
('jefe', 700, 70, 'seguir jugador', 'normal', 0.8, 700); -- Jefe del nivel 3, fase de ataque "normal"

-- Tabla objetos:
INSERT INTO objetos (nombre, tipo, afecta_jugador, efecto) VALUES
('puerta', 'interactivo', FALSE, 'colision'),
('caja', 'obstaculo', TRUE, 'colision'),
('tuberia', 'obstaculo', TRUE, 'colision'),
('picos', 'obstaculo', TRUE, 'daño'),
('escalera', 'interactivo', FALSE, 'colision'),
('boton', 'interactivo', FALSE, 'activar');

-- OBJETOS SALAS:
-- Suponiendo que tenemos salas con id_sala 1 a 10. Solo son dummies 
INSERT INTO objetos_salas (id_sala, id_objeto, desbloquea_sala_final, estado) VALUES
(1, 1, FALSE, 'desactivado'),  -- Puerta en la sala 1
(1, 2, FALSE, 'NA'),  -- Caja en la sala 1
(2, 3, FALSE, 'NA'),  -- Tubería en la sala 2
(3, 4, FALSE, 'NA'),  -- Picos en la sala 3
(4, 5, FALSE, 'NA'),  -- Escalera en la sala 4
(5, 6, TRUE, 'activado'),  -- Botón en la sala 5
(6, 1, FALSE, 'activado'),  -- Puerta en la sala 6
(7, 2, FALSE, 'NA'),  -- Caja en la sala 7
(8, 3, FALSE, 'NA'),  -- Tubería en la sala 8
(9, 4, FALSE, 'NA');  -- Picos en la sala 9

-- Estadísticas 
INSERT INTO estadisticas (id_jugador, tiempo_mejor_partida, numero_muertes, enemigos_derrotados, dano_infligido, dano_recibido, partidas_completadas)  
VALUES  
(1, '00:15:30', 3, 25, 1200, 900, 5),  
(2, '00:10:45', 1, 18, 900, 750, 4),  
(3, '00:20:10', 5, 32, 1500, 1100, 6),  
(4, '00:12:00', 2, 22, 1100, 850, 5),  
(5, '00:18:45', 4, 30, 1400, 1000, 7),  
(6, '00:09:50', 1, 15, 800, 650, 3),  
(7, '00:22:30', 6, 35, 1700, 1200, 8),  
(8, '00:17:20', 3, 28, 1300, 950, 6),  
(9, '00:14:40', 2, 20, 1050, 820, 4),  
(10, '00:16:55', 3, 24, 1150, 870, 5),  
(11, '00:19:10', 4, 29, 1350, 970, 6),  
(12, '00:08:30', 1, 12, 700, 600, 2),  
(13, '00:23:15', 7, 38, 1800, 1250, 9),  
(14, '00:11:20', 2, 19, 920, 780, 4),  
(15, '00:21:05', 5, 34, 1650, 1180, 7),  
(16, '00:13:45', 2, 21, 1080, 830, 4),  
(17, '00:24:00', 8, 40, 1900, 1300, 10),  
(18, '00:10:15', 1, 17, 870, 730, 3),  
(19, '00:18:00', 4, 27, 1250, 910, 6),  
(20, '00:15:10', 3, 23, 1120, 860, 5),  
(21, '00:20:50', 5, 31, 1450, 1020, 7),  
(22, '00:09:40', 1, 14, 780, 640, 3),  
(23, '00:22:10', 6, 36, 1750, 1230, 8),  
(24, '00:17:50', 3, 26, 1280, 940, 6),  
(25, '00:14:20', 2, 18, 990, 800, 4),  
(26, '00:16:30', 3, 25, 1180, 880, 5),  
(27, '00:19:40', 4, 28, 1330, 960, 6),  
(28, '00:08:45', 1, 13, 720, 610, 2),  
(29, '00:23:50', 7, 39, 1850, 1270, 9),  
(30, '00:12:25', 2, 20, 1020, 810, 4);  

-- PARA HABILIDADES:
INSERT INTO habilidades (tipo, nombre, desbloqueado, velocidad_uso)  
VALUES  
("mejora de estadisticas", "salud", TRUE, 0.0),  
("mejora de estadisticas", "dano", TRUE, 0.0),  
("mejora de estadisticas", "proteccion", FALSE, 0.0),  
("movilidad", "doble salto", TRUE, 1.5),  
("movilidad", "dash", TRUE, 0.8);  

-- Tabla intermedia jugador_habilidades:
INSERT INTO jugadores_habilidades (id_jugador, id_habilidad)  
VALUES  
(1, 1), (1, 4),  
(2, 2), (2, 5),  
(3, 3),  
(4, 1),  
(5, 2), (5, 3),  
(6, 4),  
(7, 5),  
(8, 1), (8, 2),  
(9, 3),  
(10, 4),  
(11, 5),  
(12, 1),  
(13, 2), (13, 3),  
(14, 4),  
(15, 5),  
(16, 1),  
(17, 2),  
(18, 3),  
(19, 4), (19, 5),  
(20, 1),  
(21, 2), (21, 3),  
(22, 4),  
(23, 5),  
(24, 1),  
(25, 2), (25, 3),  
(26, 4),  
(27, 5),  
(28, 1),  
(29, 2),  
(30, 3), (30, 4);  

-- ARMAS
INSERT INTO armas (nombre, tipo, dano, velocidad_ataque, desbloqueo_nivel) VALUES
("brazo robotico", "cuerpo a cuerpo", 20, 1.2, 1),
("llave de acero", "cuerpo a cuerpo", 40, 1.2, 2),
("pistola laser lenta", "distancia", 20, 1, 3),
("pistola laser rapida", "distancia", 15, 0.5, 4);

-- Inventario:
INSERT INTO inventarios (id_jugador, id_arma_cuerpo, id_arma_distancia, estado_pocion, curacion_pocion) VALUES
(1, 1, 3, TRUE, 50),
(2, 2, 4, FALSE, 0),
(3, 1, 3, TRUE, 40),
(4, 2, 4, TRUE, 60),
(5, 1, 4, FALSE, 0),
(6, 2, 3, TRUE, 70),
(7, 1, 4, TRUE, 30),
(8, 2, 3, FALSE, 0),
(9, 1, 4, TRUE, 20),
(10, 2, 3, TRUE, 80),
(11, 1, 3, FALSE, 0),
(12, 2, 4, TRUE, 50),
(13, 1, 3, TRUE, 60),
(14, 2, 4, FALSE, 0),
(15, 1, 3, TRUE, 40),
(16, 2, 3, TRUE, 30),
(17, 1, 4, FALSE, 0),
(18, 2, 3, TRUE, 70),
(19, 1, 3, TRUE, 50),
(20, 2, 4, FALSE, 0),
(21, 1, 3, TRUE, 40),
(22, 2, 4, TRUE, 60),
(23, 1, 4, FALSE, 0),
(24, 2, 3, TRUE, 80),
(25, 1, 3, TRUE, 30),
(26, 2, 4, FALSE, 0),
(27, 1, 3, TRUE, 70),
(28, 2, 4, TRUE, 50),
(29, 1, 3, FALSE, 0),
(30, 2, 4, TRUE, 60);

-- TABLA INTERMEDIA PARTIDA_NIVEL_SALA:

INSERT INTO partida_nivel_sala (id_partida, id_nivel, id_sala) VALUES

-- Partida 1
-- Nivel 1
(1, 1, 1),
(1, 1, 2),
(1, 1, 3),
(1, 1, 4),
(1, 1, 5),
(1, 1, 6),
(1, 1, 7),
(1, 1, 8),
-- Nivel 2
(1, 2, 9),
(1, 2, 10),
(1, 2, 11),
(1, 2, 12),
(1, 2, 13),
(1, 2, 14),
(1, 2, 15),
-- Nivel 3
(1, 3, 16),
(1, 3, 17),
(1, 3, 18),
(1, 3, 19),
(1, 3, 20),
(1, 3, 21),
(1, 3, 22),
(1, 3, 23),
(1, 3, 24),

-- Partida 2
-- Nivel 1
(2, 4, 25),
(2, 4, 26), 
(2, 4, 27),
(2, 4, 28),
(2, 4, 29),
(2, 4, 30),
-- Nivel 2
(2, 5, 31),
(2, 5, 32),
(2, 5, 33),
(2, 5, 34),
(2, 5, 35),
(2, 5, 36),
(2, 5, 37),
(2, 5, 38),
-- Nivel 3
(2, 6, 39),
(2, 6, 40),
(2, 6, 41),
(2, 6, 42),
(2, 6, 43),
(2, 6, 44),
(2, 6, 45),

-- Partida 3
-- Nivel 1
(3, 7, 46),
(3, 7, 47),
(3, 7, 48),
(3, 7, 49),
(3, 7, 50),
(3, 7, 51),
(3, 7, 52);
