'use strict';

const request = require(`supertest`);
const {getServer} = require(`../api-server`);
const {getMockData} = require(`../lib/get-mock-data`);
const {HttpCode} = require(`../../constants`);

const newArticleData = {
  title: `Новинки музыки`,
  announce: `Простые ежедневные упражнения помогут достичь успеха.`,
  fullText: `Тяжело найти качественную музыку`,
  createdDate: `2020-04-17 20:25:31`,
  category: [`Музыка`],
  comments: []
};

const incorrectArticleData = {
  announce: `Простые ежедневные упражнения помогут достичь успеха.`,
  fullText: `Тяжело найти качественную музыку`,
  createdDate: `2020-04-17 20:25:31`,
  category: [`Музыка`],
  comments: []
};

const updatedArticleData = {
  title: `Новинки автопрома`,
  announce: `Простые ежедневные упражнения помогут достичь успеха.`,
  fullText: `Тяжело найти хороший б/у автомобиль`,
  createdDate: `2020-05-17 20:25:31`,
  category: [`Авто`],
  comments: []
};

let server;
let mockData;

beforeAll(async () => {
  server = await getServer();
  mockData = await getMockData();
});

describe(`Articles API end-to-end tests`, () => {

  describe(`Get all articles tests`, () => {

    test(`Get all articles with status code 200`, async () => {
      const res = await request(server).get(`/api/articles`);

      expect(res.statusCode).toBe(HttpCode.SUCCESS);
      expect(res.body).toStrictEqual(mockData);
    });
  });

  describe(`Get article by id tests`, () => {

    test(`Get article by id with status code 200`, async () => {
      const article = mockData[0];
      const articleId = article.id;
      const res = await request(server).get(`/api/articles/${articleId}`);

      expect(res.statusCode).toBe(HttpCode.SUCCESS);
      expect(res.body).toStrictEqual(article);
    });

    test(`Get article by id with status code 404 (article not found)`, async () => {
      const articleId = `Wp1PYIFF34`;
      const res = await request(server).get(`/api/articles/${articleId}`);

      expect(res.statusCode).toBe(HttpCode.NOT_FOUND);
      expect(res.body.error).toBeTruthy();
      expect(res.body.status).toBe(HttpCode.NOT_FOUND);
    });
  });

  describe(`Create a new article tests`, () => {

    test(`Must create a new article and return it with status code 201`, async () => {
      const res = await request(server).post(`/api/articles`).send(newArticleData);
      const createdArticle = {...newArticleData, id: res.body.id};

      expect(res.statusCode).toBe(HttpCode.CREATED);
      expect(res.body).toStrictEqual(createdArticle);
    });

    test(`Invalid article data sent. Request must end with status code 400 (incorrect article data)`, async () => {
      const res = await request(server).post(`/api/articles`).send(incorrectArticleData);

      expect(res.statusCode).toBe(HttpCode.BAD_REQUEST);
      expect(res.body.error).toBeTruthy();
      expect(res.body.status).toBe(HttpCode.BAD_REQUEST);
    });
  });

  describe(`Get article comments tests`, () => {

    test(`Get article comments with status code 200`, async () => {
      const article = mockData[0];
      const articleId = article.id;
      const articleComments = article.comments;
      const res = await request(server).get(`/api/articles/${articleId}/comments`);

      expect(res.statusCode).toBe(HttpCode.SUCCESS);
      expect(res.body).toStrictEqual(articleComments);
    });

    test(`Get article comments with status code 404 (article not found)`, async () => {
      const articleId = `Wp1PYIFF45`;
      const res = await request(server).get(`/api/articles/${articleId}/comments`);

      expect(res.statusCode).toBe(HttpCode.NOT_FOUND);
      expect(res.body.error).toBeTruthy();
      expect(res.body.status).toBe(HttpCode.NOT_FOUND);
    });

  });

  describe(`Create a new article comment tests`, () => {

    test(`Create a new article comment with status code 200`, async () => {
      const articleId = mockData[0].id;
      const commentData = {text: `New test comment`};
      const res = await request(server).post(`/api/articles/${articleId}/comments`).send(commentData);
      const returnedComment = {...commentData, id: res.body.id};

      expect(res.statusCode).toBe(HttpCode.CREATED);
      expect(res.body).toStrictEqual(returnedComment);
    });

    test(`Create a new article comment with status code 400 (incorrect comment data)`, async () => {
      const articleId = mockData[0].id;
      const commentData = {message: `New test comment`};
      const res = await request(server).post(`/api/articles/${articleId}/comments`).send(commentData);

      expect(res.statusCode).toBe(HttpCode.BAD_REQUEST);
      expect(res.body.error).toBeTruthy();
      expect(res.body.status).toBe(HttpCode.BAD_REQUEST);
    });

    test(`Create a new article comment with status code 404 (article not found)`, async () => {
      const articleId = `Wp1PYIFF45`;
      const commentData = {text: `New test comment`};
      const res = await request(server).post(`/api/articles/${articleId}/comments`).send(commentData);

      expect(res.statusCode).toBe(HttpCode.NOT_FOUND);
      expect(res.body.error).toBeTruthy();
      expect(res.body.status).toBe(HttpCode.NOT_FOUND);
    });

  });

  describe(`Delete article comment tests`, () => {

    test(`Delete one article comment with status code 200`, async () => {
      const article = mockData[0];
      const articleId = article.id;
      const articleComment = article.comments[0];
      const commentId = articleComment.id;
      const res = await request(server).delete(`/api/articles/${articleId}/comments/${commentId}`);

      expect(res.statusCode).toBe(HttpCode.SUCCESS);
      expect(res.body).toStrictEqual(articleComment);
    });

    test(`Delete one article comment with status code 404 (article not found)`, async () => {
      const articleId = `Wp1PYIFf45`;
      const commentId = mockData[0].comments[0].id;
      const res = await request(server).delete(`/api/articles/${articleId}/comments/${commentId}`);

      expect(res.statusCode).toBe(HttpCode.NOT_FOUND);
      expect(res.body.error).toBeTruthy();
      expect(res.body.status).toBe(HttpCode.NOT_FOUND);
    });

    test(`Delete one article comment with status code 404 (comment not found)`, async () => {
      const articleId = mockData[0].id;
      const commentId = `SSmj0HFF45`;
      const res = await request(server).delete(`/api/articles/${articleId}/comments/${commentId}`);

      expect(res.statusCode).toBe(HttpCode.NOT_FOUND);
      expect(res.body.error).toBeTruthy();
      expect(res.body.status).toBe(HttpCode.NOT_FOUND);
    });

  });

  describe(`Update article by id tests`, () => {

    test(`Update article by id with status code 200`, async () => {
      const articleId = mockData[0].id;
      const res = await request(server).put(`/api/articles/${articleId}`).send(updatedArticleData);
      const updatedArticle = {...updatedArticleData, id: articleId};

      expect(res.statusCode).toBe(HttpCode.SUCCESS);
      expect(res.body).toStrictEqual(updatedArticle);
    });

    test(`Update article by id with status code 400 (incorrect article data)`, async () => {
      const articleId = mockData[0].id;
      const res = await request(server).put(`/api/articles/${articleId}`).send(incorrectArticleData);

      expect(res.statusCode).toBe(HttpCode.BAD_REQUEST);
      expect(res.body.error).toBeTruthy();
      expect(res.body.status).toBe(HttpCode.BAD_REQUEST);
    });

    test(`Update article by id with status code 404 (article not found)`, async () => {
      const articleId = `Q_lvXBFf45`;
      const res = await request(server).put(`/api/articles/${articleId}`).send(newArticleData);

      expect(res.statusCode).toBe(HttpCode.NOT_FOUND);
      expect(res.body.error).toBeTruthy();
      expect(res.body.status).toBe(HttpCode.NOT_FOUND);
    });

  });

  describe(`Delete article by id tests`, () => {

    test(`Delete article by id with status code 200`, async () => {
      const articleId = mockData[0].id;
      const res = await request(server).delete(`/api/articles/${articleId}`);
      const deletedArticle = {...updatedArticleData, id: res.body.id};

      expect(res.statusCode).toBe(HttpCode.SUCCESS);
      expect(res.body).toStrictEqual(deletedArticle);
    });

    test(`Delete article by id with status code 404 (article not found)`, async () => {
      const articleId = `Wp1PssFf45`;
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
