'use strict';

const {Router} = require(`express`);
const moment = require(`moment`);
const {HttpCode} = require(`../../constants`);
const articleValidator = require(`../middlewares/article-validator`);
const commentValidator = require(`../middlewares/comment-validator`);
const {formatArticleDate, convertDate} = require(`../../utils`);

const getArticlesRouter = (articleService, commentService, categoryService) => {

  const articlesRouter = new Router();

  articlesRouter.get(`/`, async (req, res) => {
    const articles = await articleService.findAll();
    const mostDiscussedArticles = await articleService.findMostDiscussedArticles();

    return res.status(HttpCode.SUCCESS).json({
      articles: formatArticleDate(articles),
      mostDiscussedArticles
    });
  });

  articlesRouter.get(`/:articleId`, async (req, res) => {
    const {articleId} = req.params;
    const article = await articleService.findOne(articleId);

    if (!article) {
      return res.status(HttpCode.NOT_FOUND)
      .json({
        error: true,
        status: HttpCode.NOT_FOUND,
        message: `Article with id: ${articleId} not found`
      });
    }

    return res.status(HttpCode.SUCCESS).json(formatArticleDate(article.toJSON()));
  });

  articlesRouter.delete(`/:articleId`, async (req, res) => {
    const {articleId} = req.params;
    const article = await articleService.findOne(articleId);

    if (!article) {
      return res.status(HttpCode.NOT_FOUND)
      .json({
        error: true,
        status: HttpCode.NOT_FOUND,
        message: `Article with id: ${articleId} not found`
      });
    }

    const deletedArticle = await articleService.deleteArticle(articleId);

    return res.status(HttpCode.SUCCESS).json(deletedArticle);
  });

  articlesRouter.get(`/category/:categoryId`, async (req, res) => {
    const {categoryId} = req.params;
    const isCategoryExist = await categoryService.findCategoryById(categoryId);

    if (!isCategoryExist) {
      return res.status(HttpCode.NOT_FOUND)
      .json({
        error: true,
        status: HttpCode.NOT_FOUND,
        message: `Category with id: ${categoryId} not found`
      });
    }

    const {category, articles} = await articleService.findArticlesByCategory(categoryId);

    return res.status(HttpCode.SUCCESS).json({
      activeCategory: category,
      articles: formatArticleDate(articles)
    });
  });

  articlesRouter.post(`/`, articleValidator, async (req, res) => {
    const articleData = req.body;
    const newArticle = await articleService.createArticle(articleData);
    return res.status(HttpCode.CREATED).json(formatArticleDate(newArticle));
  });

  articlesRouter.put(`/:articleId`, articleValidator, async (req, res) => {
    const {articleId} = req.params;
    const articleData = req.body;
    const article = await articleService.findOne(articleId);

    if (!article) {
      return res.status(HttpCode.NOT_FOUND)
      .json({
        error: true,
        status: HttpCode.NOT_FOUND,
        message: `Article with id: ${articleId} not found`
      });
    }

    const updatedArticle = await articleService.updateArticle(articleId, articleData);
    return res.status(HttpCode.SUCCESS).json(updatedArticle);
  });

  articlesRouter.get(`/users/:userId/comments`, async (req, res) => {
    const {userId} = req.params;
    const userArticles = await articleService.findUserArticlesWithComments(userId);
    return res.status(HttpCode.SUCCESS).json(formatArticleDate(userArticles));
  });

  articlesRouter.get(`/users/comments`, async (req, res) => {
    const lastArticlesComments = await commentService.findAll();
    return res.status(HttpCode.SUCCESS).json(lastArticlesComments);
  });

  articlesRouter.get(`/users/:userId`, async (req, res) => {
    const {userId} = req.params;
    const userArticles = await articleService.findAllByUser(userId);

    return res.status(HttpCode.SUCCESS).json(formatArticleDate(userArticles));
  });

  articlesRouter.post(`/:articleId/comments`, commentValidator, async (req, res) => {
    const {articleId} = req.params;
    const article = await articleService.findOne(articleId);
    let commentData = {...req.body};

    if (!article) {
      return res.status(HttpCode.NOT_FOUND)
      .json({
        error: true,
        status: HttpCode.NOT_FOUND,
        message: `Article with id: ${articleId} not found`
      });
    }

    commentData = {
      ...commentData,
      userId: 2,
      articleId,
      createdDate: convertDate(moment())
    };

    const newСomment = await commentService.createComment(article, commentData);
    return res.status(HttpCode.CREATED).json(newСomment);
  });

  articlesRouter.delete(`/comments/:commentId`, async (req, res) => {
    const {commentId} = req.params;
    const comment = await commentService.findOne(commentId);

    if (!comment) {
      return res.status(HttpCode.NOT_FOUND)
      .json({
        error: true,
        status: HttpCode.NOT_FOUND,
        message: `Comment with id: ${commentId} not found`
      });
    }

    const deletedComment = await commentService.deleteComment(commentId);
    return res.status(HttpCode.SUCCESS).json(deletedComment);
  });

  return articlesRouter;

};

module.exports = {getArticlesRouter};
