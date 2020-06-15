/* Get all categories */
SELECT
	categories.id AS "Идентификатор категории",
	categories.title AS "Наименование категории"
FROM categories

/* Get category including at least one article and more */
SELECT
	categories.id AS "Идентификатор категории",
	categories.title AS "Наименование категории"
FROM articles_categories
INNER JOIN categories
	ON articles_categories.category_id = categories.id
GROUP BY categories.id
HAVING count(categories.id) > 0
ORDER BY categories.id ASC

/* Get all categories with article quantity */
SELECT
	categories.id AS "Идентификатор категории",
	categories.title AS "Наименование категории",
	count(articles_categories.category_id) AS "Количество публикаций в категории"
FROM articles_categories
INNER JOIN categories
	ON articles_categories.category_id = categories.id
GROUP BY categories.id
ORDER BY categories.id ASC

/* Get all articles with users, comments, categories data ordered by novelty */
SELECT
	articles.id AS "Идентификатор публикации",
	articles.title AS "Заголовок публикации",
	articles.announce AS "Анонс публикации",
	articles.created_date AS "Дата публикации",
	concat(users.firstname, ' ', users.lastname) AS "Имя и фамилия автора",
	users.email AS "Контактный email",
	count(comments.article_id) AS "Количество комментариев",
	(
		SELECT
			string_agg(categories.title, ', ') AS "Наименование категорий"
		FROM articles_categories
		LEFT JOIN categories
			ON articles_categories.category_id = categories.id
			AND articles_categories.article_id = articles.id
	)
FROM articles
INNER JOIN users
	ON articles.user_id = users.id
INNER JOIN comments
	ON articles.id = comments.article_id
GROUP BY
	articles.id,
	users.firstname,
	users.lastname,
	users.email
ORDER BY articles.created_date DESC

/* Get one article with user, comments, categories data*/
SELECT
	articles.id AS "Идентификатор публикации",
	articles.title AS "Заголовок публикации",
	articles.announce AS "Анонс публикации",
	articles.created_date AS "Дата публикации",
	articles.picture AS "Изображения публикации",
	concat(users.firstname, ' ', users.lastname) AS "Имя и фамилия автора",
	users.email AS "Контактный email",
	count(comments.article_id) AS "Количество комментариев",
	(
		SELECT
			string_agg(categories.title, ', ') AS "Наименование категорий"
		FROM articles_categories
		LEFT JOIN categories
			ON articles_categories.category_id = categories.id
			AND articles_categories.article_id = articles.id
	)
FROM articles
INNER JOIN users
	ON articles.user_id = users.id
INNER JOIN comments
	ON articles.id = comments.article_id
WHERE articles.id = 1
GROUP BY
	articles.id,
	users.firstname,
	users.lastname,
	users.email

/* Get 5 newest comments with user data */
SELECT
	comments.id AS "Идентификатор комментария",
	comments.article_id AS "Идентификатор публикации",
	concat(users.firstname, ' ', users.lastname) AS "Имя и фамилия автора",
	comments.text AS "Tекст комментария"
FROM comments
INNER JOIN users
	ON comments.user_id = users.id
ORDER BY created_date DESC
LIMIT 5

/* Get offer comments with user data ordered by novelty*/
SELECT
	comments.id AS "Идентификатор комментария",
	comments.article_id AS "Идентификатор публикации",
	concat(users.firstname, ' ', users.lastname) AS "Имя и фамилия автора",
	comments.text AS "Tекст комментария"
FROM comments
	INNER JOIN users
		ON comments.user_id = users.id
WHERE comments.article_id = 1
ORDER BY comments.created_date DESC

/* Update article title */
UPDATE articles
SET title = 'Как я встретил Новый год'
WHERE articles.id = 1
