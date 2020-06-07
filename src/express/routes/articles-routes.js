'use strict';

const {Router} = require(`express`);
const {validationResult} = require(`express-validator`);
const {multer, storage} = require(`../file-uploader`);
const {newArticleFormFieldsRules} = require(`../form-validation`);
const {convertDate} = require(`../../utils`);
const upload = multer({storage}).single(`picture`);

const MAX_FILE_SIZE = 15 * 1024 * 1024;
const MEGABYTE_IN_BYTES = 1048576;
const VALID_MIME_TYPES = [`image/png`, `image/jpg`, `image/jpeg`];

const getArticlesRouter = (service) => {

  const articlesRouter = new Router();

  articlesRouter.get(`/category/:id`, (req, res) => res.render(`articles-by-category`));

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
      let formFieldsData = req.body;

      if (file && (!VALID_MIME_TYPES.includes(file.mimetype) || file.size > MAX_FILE_SIZE)) {
        errors.errorsList.push(fileErrorMsg);
        errors.errorByField.picture = {msg: fileErrorMsg};
      }

      formFieldsData = {
        ...formFieldsData,
        picture: file ? {image: file.filename, image2x: file.filename} : null
      };

      if (errors.errorsList.length || Object.keys(errors.errorByField).length) {
        const categories = await service.getAllCategories();
        return res.render(`article-new`, {errors, categories, formFieldsData});
      }

      formFieldsData = {
        ...formFieldsData,
        createdDate: convertDate(formFieldsData.createdDate)
      };

      await service.createNewArticle(formFieldsData);

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

  articlesRouter.get(`/:id`, (req, res) => res.render(`post`));

  return articlesRouter;
};


module.exports = {getArticlesRouter};
