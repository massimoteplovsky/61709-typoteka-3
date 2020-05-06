'use strict';

const fs = require(`fs`).promises;
const {Router} = require(`express`);
const postsRouter = new Router();

const {
  FilePath,
  HttpCode
} = require(`../../../constants`);

postsRouter.get(`/`, async (req, res) => {
  try {
    const fileContent = await fs.readFile(FilePath.MOCKS);
    const mocks = JSON.parse(fileContent);
    res.json(mocks);
  } catch (err) {
    res.status(HttpCode.NOT_FOUND).send(err);
  }
});

module.exports = postsRouter;
