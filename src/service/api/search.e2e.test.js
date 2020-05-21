'use strict';

const request = require(`supertest`);
const {getServer} = require(`../api-server`);
const {getMockData} = require(`../lib/get-mock-data`);
const {HttpCode} = require(`../../constants`);

let server;
let mockData;

beforeAll(async () => {
  server = await getServer();
  mockData = await getMockData();
});

describe(`Search API end-to-end tests`, () => {

  test(`Get empty article array with status code 200`, async () => {
    const res = await request(server).get(`/api/search`).query({query: `Тестовый текст для поиска статьи`});

    expect(res.statusCode).toBe(HttpCode.SUCCESS);
    expect(res.body.length).toBe(0);
  });

  test(`Get searched articles array with status code 200`, async () => {
    const articleTitle = mockData[0].title;
    const res = await request(server).get(`/api/search`).query({query: articleTitle});

    expect(res.statusCode).toBe(HttpCode.SUCCESS);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  test(`Search ends with status code 400`, async () => {
    const res = await request(server).get(`/api/search`).query({param: `Продам`});

    expect(res.statusCode).toBe(HttpCode.BAD_REQUEST);
    expect(res.body.error).toBeTruthy();
    expect(res.body.status).toBe(HttpCode.BAD_REQUEST);
  });
});
