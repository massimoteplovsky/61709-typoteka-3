'use strict';

const {Router} = require(`express`);
const {fileUploader} = require(`../file-uploader`);
const upload = fileUploader.single(`picture`);

const getArticlesRouter = (service) => {

  const articlesRouter = new Router();

  articlesRouter.get(`/category/:id`, async (req, res, next) => {
    try {
      const activePage = parseInt(req.query.page, 10) || 1;
      const categoryId = req.params.id;
      const {
        activeCategory,
        articles,
        articlesCount,
        pagesCount
      } = await service.getArticleByCategory(categoryId, activePage);
      const categories = await service.getAllCategoriesWithArticlesCount();

      return res.render(`articles-by-category`, {
        activeCategory,
        articles,
        categories,
        activePage,
        articlesCount,
        pagesCount,
        template: `articles-by-category`
      });
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

  articlesRouter.post(`/add`, upload, async (req, res, next) => {
    try {
      const file = req.file;
      let articleData = {...req.body};

      articleData = {
        ...articleData,
        picture: file ? file.filename : null
      };

      const articleCreationResult = await service.createNewArticle(articleData);

      if (articleCreationResult.validationError) {
        const {errors, categories} = articleCreationResult;
        return res.render(`article-new`, {errors, categories, articleData});
      }

      return res.redirect(`/my`);
    } catch (err) {
      return next(err);
    }
  });

  articlesRouter.post(`/edit/:articleId`, upload, async (req, res, next) => {
    try {
      const {articleId} = req.params;
      const file = req.file;
      let articleData = {...req.body};

      articleData = {
        ...articleData,
        picture: file ? file.filename : null
      };

      const articleUpdateResult = await service.updateArticle(articleId, articleData);

      if (articleUpdateResult.validationError) {
        const {errors, article, categories} = articleUpdateResult;
        return res.render(`article-edit`, {
          errors,
          article,
          categories,
          articleData: {...articleData, categories: articleData.categories ? articleData.categories : []},
        });
      }

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

  articlesRouter.post(`/:id/delete`, async (req, res, next) => {
    try {
      const articleId = req.params.id;
      await service.deleteArticle(articleId);

      return res.redirect(`/my`);
    } catch (err) {
      return next(err);
    }
  });

  articlesRouter.post(`/:id/comments`, async (req, res, next) => {
    try {
      const articleId = req.params.id;
      const commentData = {...req.body};

      const commentCreationResult = await service.createComment(articleId, commentData);

      if (commentCreationResult.validationError) {
        const {errors, article} = commentCreationResult;
        return res.render(`article`, {errors, article, commentData});
      }

      return res.redirect(`/articles/${articleId}`);
    } catch (err) {
      return next(err);
    }
  });

  articlesRouter.post(`/comments/:commentId/delete`, async (req, res, next) => {
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
