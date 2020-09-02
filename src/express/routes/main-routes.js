'use strict';

const {Router} = require(`express`);
const {fileUploader} = require(`../file-uploader`);
const {validationResult} = require(`express-validator`);
const {newUserFormFieldsRules} = require(`../form-validation`);
const {truncateText} = require(`../../utils`);
const upload = fileUploader.single(`avatar`);

const MAX_FILE_SIZE = 15 * 1024 * 1024;
const MEGABYTE_IN_BYTES = 1048576;
const VALID_MIME_TYPES = [`image/png`, `image/jpg`, `image/jpeg`];

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

  mainRouter.get(`/register`, (req, res) => res.render(`sign-up`));

  mainRouter.post(`/register`, upload, ...newUserFormFieldsRules, async (req, res, next) => {
    try {
      const fileErrorMsg = {
        NO_FILE: `Файл не выбран`,
        WRONG_FORMAT: `Неверный формат файла (только jpg/jpeg/png)`,
        BIG_SIZE: `Большой размер файла (максимально: ${MAX_FILE_SIZE / MEGABYTE_IN_BYTES} мб)`
      };
      const pushErrorMessage = (msg, fieldName) => {
        errors.errorsList.push(msg);
        errors.errorByField[fieldName] = {msg};
      };
      const errorsListFormatter = ({msg}) => msg;
      const errors = {
        errorsList: validationResult(req).formatWith(errorsListFormatter).array(),
        errorByField: validationResult(req).mapped()
      };
      const file = req.file;
      let userData = {...req.body};

      if (!file) {
        pushErrorMessage(fileErrorMsg.NO_FILE, `avatar`);
      }

      if (file && !VALID_MIME_TYPES.includes(file.mimetype)) {
        pushErrorMessage(fileErrorMsg.WRONG_FORMAT, `avatar`);
      }

      if (file && file.size > MAX_FILE_SIZE) {
        pushErrorMessage(fileErrorMsg.BIG_SIZE, `avatar`);
      }

      userData = {
        ...userData,
        avatar: file ? file.filename : null
      };

      if (errors.errorsList.length || Object.keys(errors.errorByField).length) {
        return res.render(`sign-up`, {errors, userData});
      }

      const newUser = await service.createUser(userData);

      if (newUser.error) {
        pushErrorMessage(newUser.message, `email`);
        return res.render(`sign-up`, {errors, userData});
      }

      return res.redirect(`/login`);

    } catch (err) {
      return next(err);
    }
  });

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
