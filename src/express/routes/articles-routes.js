'use strict';

const {Router} = require(`express`);
const {validationResult} = require(`express-validator`);
const {multer, storage} = require(`../file-uploader`);
const {
  newArticleFormFieldsRules,
  newCommentFormFieldsRules
} = require(`../form-validation`);
const {convertDate} = require(`../../utils`);
const upload = multer({storage}).single(`picture`);

const MAX_FILE_SIZE = 15 * 1024 * 1024;
const MEGABYTE_IN_BYTES = 1048576;
const VALID_MIME_TYPES = [`image/png`, `image/jpg`, `image/jpeg`];

const getArticlesRouter = (service) => {

  const articlesRouter = new Router();

  articlesRouter.get(`/category/:id`, async (req, res, next) => {
    try {
      const categoryId = req.params.id;
      const {activeCategory, articles} = await service.getArticleByCategory(categoryId);
      const categories = await service.getAllCategoriesWithArticlesCount();

      return res.render(`articles-by-category`, {activeCategory, articles, categories});
    } catch (err) {
      return next(err);
    }
  });

  articlesRouter.get(`/add`, async (req, res, next) => {
    try {
      const categories = await service.getAllCategories();
      return res.render(`article-new`, {categories});
    } catch (err) {
      return next(err);
    }
  });

  articlesRouter.post(`/add`, upload, ...newArticleFormFieldsRules, async (req, res, next) => {
    try {
      const fileErrorMsg = `Неверный формат (только jpg/jpeg/png), большой размер файла (максимально: ${MAX_FILE_SIZE / MEGABYTE_IN_BYTES} мб)`;
      const errorsListFormatter = ({msg}) => msg;
      const errors = {
        errorsList: validationResult(req).formatWith(errorsListFormatter).array(),
        errorByField: validationResult(req).mapped()
      };
      const file = req.file;
      let formFieldsData = {...req.body};

      if (file && (!VALID_MIME_TYPES.includes(file.mimetype) || file.size > MAX_FILE_SIZE)) {
        errors.errorsList.push(fileErrorMsg);
        errors.errorByField.picture = {msg: fileErrorMsg};
      }

      formFieldsData = {
        ...formFieldsData,
        picture: file ? file.filename : null
      };

      if (errors.errorsList.length || Object.keys(errors.errorByField).length) {
        const categories = await service.getAllCategories();
        return res.render(`article-new`, {errors, categories, formFieldsData});
      }

      formFieldsData = {
        ...formFieldsData,
        createdDate: convertDate(formFieldsData.createdDate),
        userId: 1
      };

      await service.createNewArticle(formFieldsData);

      return res.redirect(`/my`);
    } catch (err) {
      return next(err);
    }
  });

  articlesRouter.post(`/edit/:articleId`, upload, ...newArticleFormFieldsRules, async (req, res, next) => {
    try {
      const fileErrorMsg = `Неверный формат (только jpg/jpeg/png), большой размер файла (максимально: ${MAX_FILE_SIZE / MEGABYTE_IN_BYTES} мб)`;
      const {articleId} = req.params;
      const errorsListFormatter = ({msg}) => msg;
      const errors = {
        errorsList: validationResult(req).formatWith(errorsListFormatter).array(),
        errorByField: validationResult(req).mapped()
      };
      const file = req.file;
      let formFieldsData = {...req.body};

      if (file && (!VALID_MIME_TYPES.includes(file.mimetype) || file.size > MAX_FILE_SIZE)) {
        errors.errorsList.push(fileErrorMsg);
        errors.errorByField.picture = {msg: fileErrorMsg};
      }

      formFieldsData = {
        ...formFieldsData,
        picture: file ? file.filename : null
      };

      if (errors.errorsList.length || Object.keys(errors.errorByField).length) {
        const article = await service.getArticleById(articleId);
        const categories = await service.getAllCategories();
        return res.render(`article-edit`, {errors, article, categories, formFieldsData});
      }

      formFieldsData = {
        ...formFieldsData,
        createdDate: convertDate(formFieldsData.createdDate),
        userId: 1
      };

      await service.updateArticle(articleId, formFieldsData);

      return res.redirect(`/my`);
    } catch (err) {
      return next(err);
    }
  });

  articlesRouter.get(`/edit/:id`, async (req, res, next) => {
    try {
      const articleId = req.params.id;
      const article = await service.getArticleById(articleId);
      const categories = await service.getAllCategories();

      return res.render(`article-edit`, {article, categories});
    } catch (err) {
      return next(err);
    }
  });

  articlesRouter.get(`/:id`, async (req, res, next) => {
    try {
      const articleId = req.params.id;
      const article = await service.getArticleById(articleId);

      return res.render(`article`, {article});
    } catch (err) {
      return next(err);
    }
  });

  articlesRouter.post(`/delete/:id`, async (req, res, next) => {
    try {
      const articleId = req.params.id;
      await service.deleteArticle(articleId);

      return res.redirect(`/my`);
    } catch (err) {
      return next(err);
    }
  });

  articlesRouter.post(`/:id/comments`, ...newCommentFormFieldsRules, async (req, res, next) => {
    try {
      const articleId = req.params.id;
      const commentData = req.body;
      const errorsListFormatter = ({msg}) => msg;
      const errors = validationResult(req).formatWith(errorsListFormatter).array();

      if (errors.length > 0) {
        const article = await service.getArticleById(articleId);
        return res.render(`article`, {errors, article, commentData});
      }

      await service.createComment(articleId, commentData);

      return res.redirect(`/articles/${articleId}`);
    } catch (err) {
      return next(err);
    }
  });

  articlesRouter.post(`/comments/delete/:commentId`, async (req, res, next) => {
    try {
      const {commentId} = req.params;
      await service.deleteComment(commentId);

      return res.redirect(`/my/comments`);
    } catch (err) {
      return next(err);
    }
  });

  return articlesRouter;
};


module.exports = {getArticlesRouter};
