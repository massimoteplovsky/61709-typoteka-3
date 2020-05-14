'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const articleValidator = require(`../middlewares/article-validator`);
const commentValidator = require(`../middlewares/comment-validator`);

const articlesRouter = new Router();

const getArticlesRouter = (articleService, commentService) => {

  articlesRouter.get(`/`, (req, res) => {
    const articles = articleService.findAll();
    return res.status(HttpCode.SUCCESS).json(articles);
  });

  articlesRouter.get(`/:articleId`, (req, res) => {
    const {articleId} = req.params;
    const article = articleService.findOne(articleId);

    if (!article) {
      return res.status(HttpCode.NOT_FOUND)
      .json({
        error: true,
        status: HttpCode.NOT_FOUND,
        message: `Article with ID ${articleId} not found`
      });
    }

    return res.status(HttpCode.SUCCESS).json(article);
  });

  articlesRouter.post(`/`, articleValidator, (req, res) => {
    const newArticle = articleService.create(req.body);
    return res.status(HttpCode.CREATED).json(newArticle);
  });

  articlesRouter.put(`/:articleId`, articleValidator, (req, res) => {
    const {articleId} = req.params;
    const article = articleService.findOne(articleId);

    if (!article) {
      return res.status(HttpCode.NOT_FOUND)
      .json({
        error: true,
        status: HttpCode.NOT_FOUND,
        message: `Article with ID ${articleId} not found`
      });
    }

    const updatedArticle = articleService.update(articleId, req.body);
    return res.status(HttpCode.SUCCESS).json(updatedArticle);
  });

  articlesRouter.delete(`/:articleId`, (req, res) => {
    const {articleId} = req.params;
    const article = articleService.findOne(articleId);

    if (!article) {
      return res.status(HttpCode.NOT_FOUND)
      .json({
        error: true,
        status: HttpCode.NOT_FOUND,
        message: `Article with ID ${articleId} not found`
      });
    }

    const deletedArticle = articleService.delete(articleId);
    return res.status(HttpCode.SUCCESS).json(deletedArticle);
  });

  articlesRouter.get(`/:articleId/comments`, (req, res) => {
    const {articleId} = req.params;
    const article = articleService.findOne(articleId);

    if (!article) {
      return res.status(HttpCode.NOT_FOUND)
      .json({
        error: true,
        status: HttpCode.NOT_FOUND,
        message: `Article with ID ${articleId} not found`
      });
    }

    const comments = commentService.findAll(article);
    return res.status(HttpCode.SUCCESS).json(comments);
  });

  articlesRouter.delete(`/:articleId/comments/:commentId`, (req, res) => {
    const {
      articleId,
      commentId
    } = req.params;
    const article = articleService.findOne(articleId);

    if (!article) {
      return res.status(HttpCode.NOT_FOUND)
      .json({
        error: true,
        status: HttpCode.NOT_FOUND,
        message: `Article with ID ${articleId} not found`
      });
    }

    const deletedComment = commentService.delete(commentId, article);

    if (!deletedComment) {
      return res.status(HttpCode.NOT_FOUND)
      .json({
        error: true,
        status: HttpCode.NOT_FOUND,
        message: `Comment with ID ${commentId} not found`
      });
    }

    return res.status(HttpCode.SUCCESS).json(deletedComment);
  });

  articlesRouter.post(`/:articleId/comments`, commentValidator, (req, res) => {
    const {articleId} = req.params;
    const article = articleService.findOne(articleId);

    if (!article) {
      return res.status(HttpCode.NOT_FOUND)
      .json({
        error: true,
        status: HttpCode.NOT_FOUND,
        message: `Article with ID ${articleId} not found`
      });
    }

    const newСomment = commentService.create(article, req.body);
    return res.status(HttpCode.CREATED).json(newСomment);
  });

  return articlesRouter;

};

module.exports = {getArticlesRouter};
