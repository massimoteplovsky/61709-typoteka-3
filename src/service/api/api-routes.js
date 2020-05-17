'use strict';

const {Router} = require(`express`);
const {
  getCategoryRouter,
  getArticlesRouter,
  getSearchRouter
} = require(`./`);

const {getMockData} = require(`../lib/get-mock-data`);

const {
  CategoryService,
  ArticleService,
  SearchService,
  CommentService
} = require(`../data-service`);

const apiRouter = new Router();

(async () => {

  const mockData = await getMockData();

  apiRouter.use(
      `/categories`,
      getCategoryRouter(new CategoryService(mockData))
  );
  apiRouter.use(
      `/articles`,
      getArticlesRouter(
          new ArticleService(mockData),
          new CommentService()
      )
  );
  apiRouter.use(
      `/search`,
      getSearchRouter(new SearchService(mockData))
  );
})();


module.exports = apiRouter;
