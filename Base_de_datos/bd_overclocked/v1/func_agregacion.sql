USE sakila;

# Muestra el número de actores
SELECT COUNT(*) FROM sakila.actor;

# Muestra el número de actores, sin repetidos
SELECT COUNT(DISTINCT actor_id) FROM sakila.actor;

# Muestra el número de apellidos distintos
SELECT COUNT(DISTINCT last_name) FROM sakila.actor;

# Muestra el número de nombres distintos en una columna llamada Nombres_Distintos
# Sirve para que la tabla que se genere tenga nombre
SELECT COUNT(DISTINCT first_name) AS Nombres_Distintos
FROM sakila.actor;

# Obten el total de los pagos (ganancias para el negocio)
SELECT SUM(amount) as Ganancia FROM sakila.payment;
# Así es mejor optimizado
SELECT SUM(sakila.payment.amount) AS Ganancia FROM sakila.payment;

# Obtener el promedio de las rentas y redondea a 2 decimales
SELECT ROUND(AVG(amount),2) AS Promedio_Renta
FROM sakila.payment;

# Obtener el pago mínimo y máximo
SELECT MIN(amount) AS Pago_Minimo,
	   MAX(amount) AS Pago_Maximo
FROM sakila.payment;

# Resumir la información de las películas en una vista
CREATE VIEW prueba AS
SELECT COUNT(C.film_id) AS Numero_Peliculas,
		SUM(C.rental_rate) AS Ganancia_Renta_Peliculas,
        ROUND(AVG(C.length),2) AS Duracion_Promedio_Peliculas,
        MIN(C.release_year) AS Pelicula_Mas_Antigua,
        MAX(C.release_year) AS Pelicula_Mas_Nieva
FROM sakila.actor AS A
INNER JOIN sakila.film_actor AS B USING (actor_id)
INNER JOIN sakila.film AS C USING (film_id);

SELECT * FROM sakila.prueba;

