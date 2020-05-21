'use strict';

const request = require(`supertest`);
const {getServer} = require(`../api-server`);
const {HttpCode} = require(`../../constants`);

describe(`Category API end-to-end tests`, () => {

  test(`Get all categories with status code 200`, async () => {
    const server = await getServer();
    const res = await request(server).get(`/api/categories`);

    expect(res.statusCode).toBe(HttpCode.SUCCESS);
    expect(Array.isArray(res.body)).toBe(true);
  });

});
