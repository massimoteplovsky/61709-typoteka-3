'use strict';

const request = require(`supertest`);
const {getServer} = require(`../api-server`);
const {sequelize} = require(`../db-config/db`);
const {HttpCode} = require(`../../constants`);

const incorrectArticleData = {
  announce: `Простые ежедневные упражнения помогут достичь успеха.`,
  fullText: `Тяжело найти качественную музыку`,
  createdDate: `2020-04-17 20:25`,
  category: [`Музыка`],
  picture: `picture.png`,
  comments: []
};

const getArticleWithId = async () => {
  const articlesData = await request(server).get(`/api/articles`);
  const {articles} = articlesData.body;
  return {
    articleId: articles[0].id,
    article: articles[0]
  };
};

let server;
let newArticleData;
let updatedArticleData;

beforeAll(async () => {
  server = await getServer();
  const testingCategoryData = await request(server).post(`/api/categories`).send({title: `Тестовая категория ${Date.now()}`});
  const testingUserData = await request(server).post(`/api/users`).send({
    firstname: `Тестовый`,
    lastname: `Юзер`,
    email: `useremail${Date.now()}@mail.ru`,
    password: `12345678`,
    avatar: `avatar.jpg`
  });

  newArticleData = {
    title: `Новинки музыки`,
    announce: `Простые ежедневные упражнения помогут достичь успеха.`,
    fullText: `Тяжело найти качественную музыку`,
    createdDate: `2020-06-17`,
    categories: [testingCategoryData.body.id],
    picture: `picture.png`,
    userId: testingUserData.body.id
  };

  updatedArticleData = {
    title: `Новинки музыки`,
    announce: `Простые ежедневные упражнения помогут достичь успеха.`,
    fullText: `Тяжело найти хороший б/у автомобиль`,
    createdDate: `2020-04-17 20:25`,
    categories: [testingCategoryData.body.id],
    picture: ``
  };

});

afterAll(async (done) => {
  sequelize.close();
  done();
});

describe(`Articles API end-to-end tests`, () => {

  describe(`Create a new article tests`, () => {

    test(`Must create a new article and return it with status code 201`, async () => {
      const res = await request(server).post(`/api/articles`).send(newArticleData);

      expect(res.statusCode).toBe(HttpCode.CREATED);
      expect(typeof res.body).toBe(`object`);
    });

    test(`Invalid article data sent. Request must end with status code 400 (incorrect article data)`, async () => {
      const res = await request(server).post(`/api/articles`).send(incorrectArticleData);

      expect(res.statusCode).toBe(HttpCode.BAD_REQUEST);
      expect(res.body.error).toBeTruthy();
      expect(res.body.status).toBe(HttpCode.BAD_REQUEST);
    });
  });

  describe(`Get all articles tests`, () => {

    test(`Get all articles with status code 200`, async () => {
      const res = await request(server).get(`/api/articles`);
      const {articles, mostDiscussedArticles} = res.body;

      expect(res.statusCode).toBe(HttpCode.SUCCESS);
      expect(Array.isArray(articles)).toBe(true);
      expect(Array.isArray(mostDiscussedArticles)).toBe(true);
    });
  });

  describe(`Get article by id tests`, () => {

    test(`Get article by id with status code 200`, async () => {
      const {articleId} = await getArticleWithId();
      const res = await request(server).get(`/api/articles/${articleId}`);

      expect(res.statusCode).toBe(HttpCode.SUCCESS);
      expect(res.body.id).toEqual(articleId);
    });

    test(`Get article by id with status code 404 (article not found)`, async () => {
      const articleId = `999999`;
      const res = await request(server).get(`/api/articles/${articleId}`);

      expect(res.statusCode).toBe(HttpCode.NOT_FOUND);
      expect(res.body.error).toBeTruthy();
      expect(res.body.status).toBe(HttpCode.NOT_FOUND);
    });
  });

  describe(`Get articles by category`, () => {

    test(`Get articles by category with status code 200`, async () => {
      const categoriesData = await request(server).get(`/api/categories`);
      const [category] = categoriesData.body;
      const categoryId = category.id;
      const res = await request(server).get(`/api/articles/category/${categoryId}`);
      const {articles} = res.body;

      expect(res.statusCode).toBe(HttpCode.SUCCESS);
      expect(Array.isArray(articles)).toBe(true);
    });

    test(`Get articles by category with status code 404 (category not found)`, async () => {
      const categoryId = 99999;
      const res = await request(server).get(`/api/articles/category/${categoryId}`);

      expect(res.statusCode).toBe(HttpCode.NOT_FOUND);
      expect(res.body.error).toBeTruthy();
      expect(res.body.status).toBe(HttpCode.NOT_FOUND);
    });
  });

  describe(`Get user articles with comments tests`, () => {

    test(`Get user articles with comments with status code 200`, async () => {
      const userId = 1;
      const res = await request(server).get(`/api/articles/users/${userId}/comments`);

      expect(res.statusCode).toBe(HttpCode.SUCCESS);
      expect(Array.isArray(res.body)).toBe(true);
    });

    // test(`Get user articles with comments with status code 404 (user not found)`, async () => {
    //   const userId = 99999;
    //   const res = await request(server).get(`/api/articles/users/${userId}/comments`);

    //   expect(res.statusCode).toBe(HttpCode.NOT_FOUND);
    //   expect(res.body.error).toBeTruthy();
    //   expect(res.body.status).toBe(HttpCode.NOT_FOUND);
    // });
  });

  describe(`Get last users comments from articles tests`, () => {

    test(`Get last 4 users comments from articles 200`, async () => {
      const res = await request(server).get(`/api/articles/users/comments`);

      expect(res.statusCode).toBe(HttpCode.SUCCESS);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe(`Get user articles by user id tests`, () => {

    test(`Get user articles with status code 200`, async () => {
      const userId = 1;
      const res = await request(server).get(`/api/articles/users/${userId}`);

      expect(res.statusCode).toBe(HttpCode.SUCCESS);
      expect(Array.isArray(res.body)).toBe(true);
    });

    // test(`Get user articles with status code 404 (user not found)`, async () => {
    //   const userId = 99999;
    //   const res = await request(server).get(`/api/articles/users/${userId}`);

    //   expect(res.statusCode).toBe(HttpCode.NOT_FOUND);
    //   expect(res.body.error).toBeTruthy();
    //   expect(res.body.status).toBe(HttpCode.NOT_FOUND);
    // });
  });

  describe(`Create a new article comment tests`, () => {

    test(`Create a new article comment with status code 200`, async () => {
      const {articleId} = await getArticleWithId();
      const commentData = {
        text: `New test comment`,
        articleId,
        userId: 1
      };
      const res = await request(server).post(`/api/articles/${articleId}/comments`).send(commentData);
      const returnedComment = {
        ...commentData,
        id: res.body.id,
        createdDate: res.body.createdDate,
        userId: res.body.userId
      };

      expect(res.statusCode).toBe(HttpCode.CREATED);
      expect(res.body).toStrictEqual(returnedComment);
    });

    test(`Create a new article comment with status code 400 (incorrect comment data)`, async () => {
      const {articleId} = await getArticleWithId();
      const commentData = {message: `New test comment`};
      const res = await request(server).post(`/api/articles/${articleId}/comments`).send(commentData);

      expect(res.statusCode).toBe(HttpCode.BAD_REQUEST);
      expect(res.body.error).toBeTruthy();
      expect(res.body.status).toBe(HttpCode.BAD_REQUEST);
    });

    test(`Create a new article comment with status code 404 (article not found)`, async () => {
      const articleId = 99999;
      const commentData = {
        text: `New test comment`,
        articleId
      };
      const res = await request(server).post(`/api/articles/${articleId}/comments`).send(commentData);

      expect(res.statusCode).toBe(HttpCode.NOT_FOUND);
      expect(res.body.error).toBeTruthy();
      expect(res.body.status).toBe(HttpCode.NOT_FOUND);
    });

  });

  describe(`Delete article comment tests`, () => {

    test(`Delete one article comment with status code 200`, async () => {
      const {article} = await getArticleWithId();
      const articleComment = article.comments[0];
      const commentId = articleComment.id;
      const res = await request(server).delete(`/api/articles/comments/${commentId}`);

      expect(res.statusCode).toBe(HttpCode.SUCCESS);
    });

    test(`Delete one article comment with status code 404 (comment not found)`, async () => {
      const commentId = 99999;
      const res = await request(server).delete(`/api/articles/comments/${commentId}`);

      expect(res.statusCode).toBe(HttpCode.NOT_FOUND);
      expect(res.body.error).toBeTruthy();
      expect(res.body.status).toBe(HttpCode.NOT_FOUND);
    });

  });

  describe(`Update article by id tests`, () => {

    test(`Update article by id with status code 200`, async () => {
      const {articleId} = await getArticleWithId();
      const res = await request(server).put(`/api/articles/${articleId}`).send(updatedArticleData);

      expect(res.statusCode).toBe(HttpCode.SUCCESS);
      expect(typeof res.body).toBe(`object`);
    });

    test(`Update article by id with status code 400 (incorrect article data)`, async () => {
      const {articleId} = await getArticleWithId();
      const res = await request(server).put(`/api/articles/${articleId}`).send(incorrectArticleData);

      expect(res.statusCode).toBe(HttpCode.BAD_REQUEST);
      expect(res.body.error).toBeTruthy();
      expect(res.body.status).toBe(HttpCode.BAD_REQUEST);
    });

    test(`Update article by id with status code 404 (article not found)`, async () => {
      const articleId = `99999`;
      const res = await request(server).put(`/api/articles/${articleId}`).send(newArticleData);

      expect(res.statusCode).toBe(HttpCode.NOT_FOUND);
      expect(res.body.error).toBeTruthy();
      expect(res.body.status).toBe(HttpCode.NOT_FOUND);
    });

  });

  describe(`Delete article by id tests`, () => {

    test(`Delete article by id with status code 200`, async () => {
      const {articleId} = await getArticleWithId();
      const res = await request(server).delete(`/api/articles/${articleId}`);

      expect(res.statusCode).toBe(HttpCode.SUCCESS);
    });

    test(`Delete article by id with status code 404 (article not found)`, async () => {
      const articleId = 99999;
      const res = await request(server).delete(`/api/articles/${articleId}`);

      expect(res.statusCode).toBe(HttpCode.NOT_FOUND);
      expect(res.body.error).toBeTruthy();
      expect(res.body.status).toBe(HttpCode.NOT_FOUND);
    });

  });

  describe(`Route not found test`, () => {

    test(`Route doesn't exist. Request must end with status code 404`, async () => {
      const res = await request(server).get(`/api/test`);

      expect(res.statusCode).toBe(HttpCode.NOT_FOUND);
      expect(res.body.error).toBeTruthy();
      expect(res.body.status).toBe(HttpCode.NOT_FOUND);
    });

  });
});
