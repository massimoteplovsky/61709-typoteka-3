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
      return res.render(
          `comments`,
          {comments: articles.slice(0, 3).reduce((comments, article) => comments.concat(article.comments), [])}
      );
    } catch (err) {
      return next(err);
    }
  });

  return myRouter;
};

module.exports = {getMyRouter};
