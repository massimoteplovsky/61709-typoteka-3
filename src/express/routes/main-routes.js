'use strict';

const {Router} = require(`express`);
const {getMostDiscussedArticles} = require(`../../utils`);

const getMainRouter = (service) => {

  const mainRouter = new Router();

  mainRouter.get(`/`, async (req, res, next) => {
    try {
      const articles = await service.getAllArticles();
      const categories = await service.getAllCategories();

      return res.render(`main`, {
        articles: articles.slice(0, 8),
        categories,
        mostDiscussedArticles: getMostDiscussedArticles(articles)
      });
    } catch (err) {
      return next(err);
    }
  });

  mainRouter.get(`/register`, (req, res) => res.render(`sign-up`));

  mainRouter.get(`/login`, (req, res) => res.render(`login`));

  mainRouter.get(`/search`, async (req, res, next) => {
    try {
      const {query} = req.query;

      if (typeof (query) === `undefined`) {
        return res.render(`search`);
      }

      const searchResult = await service.searchArticles(query);

      return res.render(`search`, {
        articles: searchResult,
        query
      });
    } catch (err) {
      return next(err);
    }
  });

  return mainRouter;
};


module.exports = {getMainRouter};
