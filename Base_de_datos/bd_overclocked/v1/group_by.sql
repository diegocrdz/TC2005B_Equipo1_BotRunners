USE sakila;

SELECT A.actor_id,
	   A.first_name,
       A.last_name,
       count(actor_id) AS Numero_Peliculas
FROM sakila.actor AS A
INNER JOIN sakila.film_actor AS B
USING (actor_id)
GROUP BY B.actor_id
ORDER BY Numero_Peliculas DESC
LIMIT 5;

SELECT last_name,
	   COUNT(*) AS "Frequency"
FROM sakila.actor
GROUP BY last_name
ORDER BY Frequency DESC
LIMIT 10;

SELECT A.first_name,
	   A.last_name,
       SUM(B.amount)
FROM staff AS A
INNER JOIN payment AS B
USING (staff_id)
WHERE MONTH(B.payment_date) = 08 AND YEAR(B.payment_date) = 2005
GROUP BY A.staff_id;