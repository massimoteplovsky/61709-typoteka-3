'use strict';

const {Router} = require(`express`);
const csrf = require(`csurf`);
const checkAuth = require(`../check-auth`);
const {RouteProtectionType} = require(`../../constants`);

const csrfProtection = csrf({cookie: true});

const getMyRouter = (service) => {

  const myRouter = new Router();

  myRouter.get(`/`, csrfProtection, checkAuth(service, RouteProtectionType.FULL, true), async (req, res, next) => {
    try {
      const user = req.user;
      const articles = await service.getAllArticlesByUser(user.id);
      return res.render(`my`, {articles, csrf: req.csrfToken()});
    } catch (err) {
      return next(err);
    }
  });

  myRouter.get(`/comments`, csrfProtection, checkAuth(service, RouteProtectionType.FULL, true), async (req, res, next) => {
    try {
      const user = req.user;
      const userArticlesWithComments = await service.getUserArticleComments(user.id);
      return res.render(`comments`, {userArticlesWithComments, csrf: req.csrfToken()});
    } catch (err) {
      return next(err);
    }
  });

  return myRouter;
};

module.exports = {getMyRouter};
