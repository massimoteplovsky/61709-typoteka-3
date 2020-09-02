'use strict';

const request = require(`supertest`);
const {getServer} = require(`../api-server`);
const {sequelize} = require(`../db-config/db`);
const {HttpCode} = require(`../../constants`);

const getCategory = async () => {
  const categoriesData = await request(server).get(`/api/categories`);
  return categoriesData.body[0];
};

let server;

beforeAll(async () => {
  server = await getServer();
});

afterAll(async (done) => {
  sequelize.close();
  done();
});

const incorrectCategoryData = {
  title: ``
};

describe(`Categories API end-to-end tests`, () => {

  describe(`Get all categories test`, () => {

    test(`Get all categories with status code 200`, async () => {
      const res = await request(server).get(`/api/categories`);

      expect(res.statusCode).toBe(HttpCode.SUCCESS);
      expect(Array.isArray(res.body)).toBe(true);
    });

  });

  describe(`Create a new category tests`, () => {

    test(`Create a new category with status code 201`, async () => {
      const res = await request(server).post(`/api/categories`).send({title: `Категория ${Date.now()}`});
      expect(res.statusCode).toBe(HttpCode.CREATED);
      expect(typeof res.body).toBe(`object`);
    });

    test(`Create a new category with status code 400 (incorrect or invalid data sent)`, async () => {
      const res = await request(server).post(`/api/categories`).send(incorrectCategoryData);

      expect(res.statusCode).toBe(HttpCode.BAD_REQUEST);
    });

  });

  describe(`Update category tests`, () => {

    test(`Update category with status code 200`, async () => {
      const category = await getCategory();
      const res = await request(server).put(`/api/categories/${category.id}`).send({title: `Категория ${Date.now()}`});

      expect(res.statusCode).toBe(HttpCode.SUCCESS);
      expect(typeof res.body).toBe(`object`);
    });

    test(`Update category with the same title status code 200`, async () => {
      const category = await getCategory();
      const res = await request(server).put(`/api/categories/${category.id}`).send({title: category.title});

      expect(res.statusCode).toBe(HttpCode.BAD_REQUEST);
    });

    test(`Update cetgory with wrong id with status code 404 (category not found)`, async () => {
      const categoryId = 99999;
      const res = await request(server).put(`/api/categories/${categoryId}`).send({title: `Teстовая категория 2`});

      expect(res.statusCode).toBe(HttpCode.NOT_FOUND);
      expect(res.body.error).toBe(true);
      expect(res.body.status).toBe(HttpCode.NOT_FOUND);
    });

  });

  describe(`Delete category tests`, () => {

    test(`Delete category with status code 200`, async () => {
      const category = await getCategory();
      const res = await request(server).delete(`/api/categories/${category.id}`);

      expect(res.statusCode).toBe(HttpCode.SUCCESS);
    });

    test(`Delete category with wrong id with status code 404 (category not found)`, async () => {
      const categoryId = 99999;
      const res = await request(server).delete(`/api/categories/${categoryId}`);

      expect(res.statusCode).toBe(HttpCode.NOT_FOUND);
      expect(res.body.error).toBe(true);
      expect(res.body.status).toBe(HttpCode.NOT_FOUND);
    });

  });

});
