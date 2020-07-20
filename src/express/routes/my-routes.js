'use strict';

const {Router} = require(`express`);

const getMyRouter = (service) => {

  const myRouter = new Router();

  myRouter.get(`/`, async (req, res, next) => {
    try {
      const articles = await service.getAllArticlesByUser(1);
      return res.render(`my`, {articles});
    } catch (err) {
      return next(err);
    }
  });

  myRouter.get(`/comments`, async (req, res, next) => {
    try {
      const userArticleComments = await service.getUserArticleComments(1);
      return res.render(`comments`, {articles: userArticleComments});
    } catch (err) {
      return next(err);
    }
  });

  return myRouter;
};

module.exports = {getMyRouter};
