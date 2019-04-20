-- SQL Homework --
-- UCIRV201902DATA3 --
-- K. HARRISON --
-- 23 APR 2019 --

USE sakila;

-- 1a. Display the first and last names of all actors from the table actor. 
SELECT first_name, last_name
FROM actor;

-- 1b. Display the first and last name of each actor in a single column in upper case letters. Name the column Actor Name.
SELECT concat(UPPER(first_name), " ", UPPER(last_name)) 
AS Actor_Name 
FROM actor;

-- 2a. You need to find the ID number, first name, and last name of an actor, of whom you know only the first name, "Joe."--
SELECT actor_id, first_name, last_name
FROM actor
WHERE first_name = "Joe";

-- 2b. Find all actors whose last name contain the letters GEN --
SELECT first_name, last_name FROM actor
WHERE last_name LIKE '%GEN%';

-- 2c. Find all actors whose last names contain the letters LI. This time, order the rows by last name and first name, in that order: --
SELECT first_name, last_name FROM actor
WHERE last_name LIKE '%LI%'
ORDER BY last_name, first_name;

-- 2d. Using IN, display the country_id and country columns of the following countries: Afghanistan, Bangladesh, and China --
SELECT country_id, country
FROM country
WHERE country IN ('Afghanistan', 'Bangladesh', 'China');

-- 3a. You want to keep a description of each actor. You don't think you will be performing queries on a description, so create a column --
-- in the table actor named description and use the data type BLOB (Make sure to research the type BLOB, as the difference between it and --
-- VARCHAR are significant) -- 
ALTER TABLE actor
ADD description BLOB;

-- 3b. Very quickly you realize that entering descriptions for each actor is too much effort. Delete the description column. --
ALTER TABLE actor
DROP COLUMN description;

--  List the last names of actors, as well as how many actors have that last name. --
SELECT last_name, COUNT(*) FROM actor
GROUP BY last_name;

-- 4b. List last names of actors and the number of actors who have that last name, but only for names that are shared by at least two actors --
SELECT last_name, COUNT(*) FROM actor
GROUP BY last_name
HAVING COUNT(*) > 1;

-- 4c. The actor HARPO WILLIAMS was accidentally entered in the actor table as GROUCHO WILLIAMS. Write a query to fix the record. --
SET SQL_SAFE_UPDATES = 0;
SELECT * FROM actor
WHERE first_name = "GROUCHO"; -- The actor formerly know as HARPO actor_ID is 172

UPDATE actor
SET first_name = "HARPO"
WHERE actor_id = 172;

-- 4d. Perhaps we were too hasty in changing GROUCHO to HARPO. It turns out that GROUCHO was the correct name after all! In a single query,--
-- if the first name of the actor is currently HARPO, change it to GROUCHO. --
UPDATE actor
SET first_name = "HARPO"
WHERE first_name = "GROUCHO";

-- 5a. You cannot locate the schema of the address table. Which query would you use to re-create it? --
SHOW CREATE TABLE address;

-- 6a. Use JOIN to display the first and last names, as well as the address, of each staff member. Use the tables staff and address --
SELECT first_name, last_name, address
FROM staff
INNER JOIN address on staff.address_id = address.address_id;

-- 6b. Use JOIN to display the total amount rung up by each staff member in August of 2005. Use tables staff and payment. --
SELECT first_name, last_name, sum(amount) from staff
JOIN payment on staff.staff_id = payment.staff_id
WHERE payment_date LIKE "%2005-08%"
GROUP BY staff.staff_id;

-- 6c. List each film and the number of actors who are listed for that film. Use tables film_actor and film. Use inner join. --
SELECT title, count(actor_id) as actor_count from film
JOIN film_actor on film_actor.film_id = film.film_id
GROUP BY film.film_id;

-- 6d. How many copies of the film Hunchback Impossible exist in the inventory system? --
SELECT COUNT(*) from inventory WHERE film_id IN
	(SELECT film_id FROM film WHERE title = "Hunchback Impossible");


-- 6e. Using the tables payment and customer and the JOIN command, list the total paid by each customer. -- 
-- List the customers alphabetically by last name--
SELECT first_name, last_name, sum(amount) as amount_paid FROM payment
JOIN customer on payment.customer_id = customer.customer_id
GROUP BY payment.customer_id
ORDER BY last_name;

-- 7a. The music of Queen and Kris Kristofferson have seen an unlikely resurgence. As an unintended consequence,--
-- films starting with the letters K and Q have also soared in popularity. Use subqueries to display the titles of-- 
-- movies starting with the letters K and Q whose language is English. --
SELECT title FROM film
WHERE title LIKE "K%" OR title LIKE "Q%" AND language_id IN
	(SELECT language_id FROM language WHERE name = "English");
    
-- 7b. Use subqueries to display all actors who appear in the film Alone Trip. --
SELECT first_name, last_name from actor WHERE actor_id IN 
	(SELECT actor_id from film_actor WHERE film_id =
		(SELECT film_id from film WHERE title = "Alone Trip"));
        
        
-- 7c. You want to run an email marketing campaign in Canada, for which you will need the names and email addresses --
-- of all Canadian customers. Use joins to retrieve this information. --
select c.first_name, c.last_name, c.email from customer AS c
JOIN address AS a on c.address_id = a.address_id
JOIN city AS ct on ct.city_id = a.city_id
JOIN country on ct.country_id = country.country_id
WHERE country = "Canada";

-- 7d. Sales have been lagging among young families, and you wish to target all family movies for a promotion. --
-- Identify all movies categorized as family films. --
SELECT f.title AS "Movie Title" from film_category as fc
JOIN category as c on fc.category_id = c.category_id
JOIN film as f on f.film_id = fc.film_id
WHERE c.name = "family";

-- 7e. Display the most frequently rented movies in descending order. --
SELECT f.title, COUNT(r.inventory_id) AS "Number of Rentals" from rental as r
JOIN inventory AS i on r.inventory_id = i.inventory_id
JOIN film as f on i.film_id = f.film_id
GROUP BY f.title
ORDER BY COUNT(r.inventory_id) DESC;

-- 7f. Write a query to display how much business, in dollars, each store brought in. -- 
SELECT r.staff_id as "Store", sum(p.amount) as "Total Business ($)" from rental as r
JOIN payment as p on p.rental_id = r.rental_id
GROUP BY r.staff_id;

-- 7g. Write a query to display for each store its store ID, city, and country. --
SELECT store_id, cty.city, cnt.country from store as s
JOIN address as a on a.address_id = s.address_id
JOIN city as cty on a.city_id = cty.city_id
JOIN country as cnt on cnt.country_id = cty.country_id;

-- 7h. List the top five genres in gross revenue in descending order. (Hint: you may need to use
-- the following tables: category, film_category, inventory, payment, and rental.) --
SELECT sum(p.amount) as "Revenue", c.name as "Genre" from rental as r
JOIN payment as p on p.rental_id = r.rental_id
JOIN inventory as i on i.inventory_id = r.inventory_id
JOIN film_category as fc on i.film_id = fc.film_id
JOIN category as c on fc.category_id = c.category_id
GROUP BY c.name
ORDER BY sum(p.amount) DESC
LIMIT 5;

-- 8a. In your new role as an executive, you would like to have an easy way of viewing the --
-- Top five genres by gross revenue. Use the solution from the problem above to create a view. --
CREATE OR REPLACE VIEW TopFive AS
SELECT sum(p.amount) as "Revenue", c.name as "Genre" from rental as r
JOIN payment as p on p.rental_id = r.rental_id
JOIN inventory as i on i.inventory_id = r.inventory_id
JOIN film_category as fc on i.film_id = fc.film_id
JOIN category as c on fc.category_id = c.category_id
GROUP BY c.name
ORDER BY sum(p.amount) DESC
LIMIT 5;

-- 8b. How would you display the view that you created in 8a? --
SELECT * From TopFive;

-- 8c. You find that you no longer need the view top_five_genres. Write a query to delete it. --
DROP VIEW TopFive;

-- End of Assignment --