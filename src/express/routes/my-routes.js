'use strict';

const {Router} = require(`express`);

const getMyRouter = (service) => {

  const myRouter = new Router();

  myRouter.get(`/`, async (req, res, next) => {
    try {
      const articles = await service.getAllArticles();
      return res.render(`my`, {articles});
    } catch (err) {
      return next(err);
    }
  });

  myRouter.get(`/comments`, async (req, res, next) => {
    try {
      const articles = await service.getAllArticles();
      const articleComments = await Promise.all(
          articles.slice(0, 3)
          .map((article) => service.getArticleComments(article.id))
      );
      return res.render(`comments`, {comments: articleComments.flat()});
    } catch (err) {
      return next(err);
    }
  });

  return myRouter;
};

module.exports = {getMyRouter};
