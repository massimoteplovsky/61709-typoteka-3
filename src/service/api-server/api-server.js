'use strict';

const express = require(`express`);
const {getMockData} = require(`../lib/get-mock-data`);
const {getLogger} = require(`../logger`);
const expressPinoLogger = require(`express-pino-logger`);

const {
  API_PREFIX,
  HttpCode
} = require(`../../constants`);

const {
  getCategoryRouter,
  getArticlesRouter,
  getSearchRouter
} = require(`../api`);

const {
  CategoryService,
  ArticleService,
  SearchService,
  CommentService
} = require(`../data-service`);

const getServer = async () => {
  const server = express();
  const logger = getLogger();
  const mockData = await getMockData();

  server.disable(`x-powered-by`);
  server.use(expressPinoLogger(logger));
  server.use(express.json());

  server.use((req, res, next) => {
    logger.debug(`Start request to url ${req.url}`);
    next();
  });

  server.use(
      `${API_PREFIX}/categories`,
      getCategoryRouter(new CategoryService(mockData))
  );

  server.use(
      `${API_PREFIX}/articles`,
      getArticlesRouter(
          new ArticleService(mockData),
          new CommentService()
      )
  );

  server.use(
      `${API_PREFIX}/search`,
      getSearchRouter(new SearchService(mockData))
  );

  server.use((req, res) => {
    const notFoundMessageText = `Not found`;

    logger.error(`End request (${req.url}) with error ${HttpCode.NOT_FOUND}.`);
    return res.status(HttpCode.NOT_FOUND)
    .json({
      error: true,
      status: HttpCode.NOT_FOUND,
      message: notFoundMessageText
    });
  });

  return server;
};

module.exports = {getServer};
