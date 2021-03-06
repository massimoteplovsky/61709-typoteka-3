'use strict';

const request = require(`supertest`);
const {getServer} = require(`../api-server`);
const {sequelize} = require(`../db-config/db`);
const {HttpCode} = require(`../../constants`);

const getArticleWithId = async () => {
  const articlesData = await request(server).get(`/api/articles?activePage=1`);
  const {articles} = articlesData.body;
  return {
    articleId: articles[0].id,
    article: articles[0]
  };
};

let server;

beforeAll(async () => {
  server = await getServer();
  const testingCategoryData = await request(server).post(`/api/categories`).send({title: `Категория ${Date.now()}`});
  const testingUserData = await request(server).post(`/api/users`).send({
    firstname: `Тестовый`,
    lastname: `Юзер`,
    email: `useremail${Date.now()}@mail.ru`,
    password: `12345678`,
    confirmPassword: `12345678`,
    avatar: `avatar.jpg`
  });

  await request(server).post(`/api/articles`).send({
    title: `Новинки музыки. Топовая музыка каждый день`,
    announce: `Простые ежедневные упражнения помогут достичь успеха.`,
    fullText: `Тяжело найти качественную музыку`,
    createdDate: `17.06.2020`,
    categories: [testingCategoryData.body.id],
    userId: testingUserData.body.id
  });
});

afterAll(async (done) => {
  sequelize.close();
  done();
});

describe(`Search API end-to-end tests`, () => {

  test(`Get empty article array with status code 200`, async () => {
    const res = await request(server).get(`/api/search`).query({query: `Тестовый текст для поиска статьи`});

    expect(res.statusCode).toBe(HttpCode.SUCCESS);
    expect(res.body.length).toBe(0);
  });

  test(`Get searched articles array with status code 200`, async () => {
    const {article} = await getArticleWithId();
    const res = await request(server).get(`/api/search`).query({query: article.title});

    expect(res.statusCode).toBe(HttpCode.SUCCESS);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test(`Search ends with status code 400`, async () => {
    const res = await request(server).get(`/api/search`).query({param: `Продам`});

    expect(res.statusCode).toBe(HttpCode.BAD_REQUEST);
    expect(res.body.error).toBe(true);
    expect(res.body.status).toBe(HttpCode.BAD_REQUEST);
  });
});
