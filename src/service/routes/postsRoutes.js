'use strict';

const {Router} = require(`express`);
const {readContentJSON} = require(`../../utils`);
const postsRouter = new Router();

const {
  FilePath,
  HttpCode
} = require(`../../constants`);

postsRouter.get(`/`, async (req, res) => {
  try {
    const mocks = await readContentJSON(FilePath.MOCKS);
    res.status(HttpCode.SUCCESS).json(mocks);
  } catch (err) {
    res.status(HttpCode.INTERNAL_SERVER_ERROR)
    .json({
      error: true,
      status: HttpCode.INTERNAL_SERVER_ERROR,
      message: err.message
    });
  }
});

module.exports = postsRouter;
