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
      const articleComments = articles.slice(0, 3).map((article) => service.getArticleComments(article.id));

      return Promise.all(articleComments).then((comments) => {
        return res.render(`comments`, {comments: comments.flat()});
      });
    } catch (err) {
      return next(err);
    }
  });

  return myRouter;
};

module.exports = {getMyRouter};
