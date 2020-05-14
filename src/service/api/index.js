'use strict';

const {Router} = require(`express`);
const {getCategoryRouter} = require(`./category`);
const {getArticlesRouter} = require(`./article`);
const {getSearchRouter} = require(`./search`);
const {getMockData} = require(`../lib/get-mock-data`);

const {
  CategoryService,
  ArticleService,
  SearchService,
  CommentService
} = require(`../data-service`);

const appRouter = new Router();

(async () => {

  const mockData = await getMockData();

  appRouter.use(
      `/categories`,
      getCategoryRouter(new CategoryService(mockData))
  );
  appRouter.use(
      `/articles`,
      getArticlesRouter(
          new ArticleService(mockData),
          new CommentService()
      )
  );
  appRouter.use(
      `/search`,
      getSearchRouter(new SearchService(mockData))
  );
})();


module.exports = appRouter;
