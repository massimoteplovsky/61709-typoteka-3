'use strict';

const {Router} = require(`express`);
const {truncateText} = require(`../../utils`);

const getMainRouter = (service) => {

  const mainRouter = new Router();

  mainRouter.get(`/`, async (req, res, next) => {
    try {
      const {articles, mostDiscussedArticles} = await service.getAllArticles();
      const categories = await service.getAllCategoriesWithArticlesCount();
      const lastComments = await service.getLastArticlesComments();

      return res.render(`main`, {
        articles,
        categories,
        mostDiscussedArticles,
        lastComments,
        truncateText
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

      const articles = await service.searchArticles(query);

      return res.render(`search`, {
        articles,
        query
      });
    } catch (err) {
      return next(err);
    }
  });

  return mainRouter;
};


module.exports = {getMainRouter};
