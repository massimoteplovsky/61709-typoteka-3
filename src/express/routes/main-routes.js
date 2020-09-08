'use strict';

const {Router} = require(`express`);
const {fileUploader} = require(`../file-uploader`);
const {truncateText} = require(`../../utils`);
const upload = fileUploader.single(`avatar`);

const getMainRouter = (service) => {

  const mainRouter = new Router();

  mainRouter.get(`/`, async (req, res, next) => {
    try {
      const activePage = parseInt(req.query.page, 10) || 1;
      const {
        articles,
        mostDiscussedArticles,
        articlesCount,
        pagesCount
      } = await service.getAllArticles(activePage);
      const categories = await service.getAllCategoriesWithArticlesCount();
      const lastComments = await service.getLastArticlesComments();

      return res.render(`main`, {
        articles,
        categories,
        mostDiscussedArticles,
        lastComments,
        articlesCount,
        activePage,
        pagesCount,
        template: `main`,
        truncateText
      });
    } catch (err) {
      return next(err);
    }
  });

  mainRouter.get(`/register`, (req, res) => res.render(`register-login`, {activeTab: `register`}));

  mainRouter.post(`/register`, upload, async (req, res, next) => {
    try {
      const file = req.file;
      let userData = {...req.body};

      userData = {
        ...userData,
        avatar: file ? file.filename : null
      };

      const userCreationResult = await service.createUser(userData);

      if (userCreationResult.validationError) {
        const {errors} = userCreationResult;
        return res.render(`register-login`, {errors, userData, activeTab: `register`});
      }

      return res.redirect(`/login`);

    } catch (err) {
      return next(err);
    }
  });

  mainRouter.get(`/login`, (req, res) => res.render(`register-login`, {activeTab: `login`}));

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
