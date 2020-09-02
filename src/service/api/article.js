'use strict';

const {Router} = require(`express`);
const moment = require(`moment`);
const {
  newArticleFormFieldsRules,
  newCommentFormFieldsRules
} = require(`../form-validation`);
const {HttpCode} = require(`../../constants`);
const {
  validateForm,
  validateFormByFields
} = require(`../../utils`);
const {checkParamIsInteger} = require(`../middlewares/param-validator`);
const {formatArticleDate, convertDate} = require(`../../utils`);
const ARTICLES_PER_PAGE = 8;


const getArticlesRouter = (articleService, commentService, categoryService, userService) => {

  const articlesRouter = new Router();

  articlesRouter.get(`/`, async (req, res) => {
    const {activePage} = req.query;
    const {articles, articlesCount} = await articleService.findAll(parseInt(activePage, 10));
    const mostDiscussedArticles = await articleService.findMostDiscussedArticles();
    const pagesCount = Math.ceil(articlesCount / ARTICLES_PER_PAGE);

    if (activePage > (pagesCount ? pagesCount : 1)) {
      return res.status(HttpCode.NOT_FOUND)
        .json({
          error: true,
          status: HttpCode.NOT_FOUND,
          message: `Page ${activePage} not found`
        });
    }

    return res.status(HttpCode.SUCCESS).json({
      articles: formatArticleDate(articles),
      mostDiscussedArticles,
      articlesCount,
      pagesCount
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
    const {activePage} = req.query;
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

    const {
      activeCategory,
      articles,
      articlesCount
    } = await articleService.findArticlesByCategory(categoryId, parseInt(activePage, 10));

    const pagesCount = Math.ceil(articlesCount / ARTICLES_PER_PAGE);

    if (activePage > (pagesCount ? pagesCount : 1)) {
      return res.status(HttpCode.NOT_FOUND)
        .json({
          error: true,
          status: HttpCode.NOT_FOUND,
          message: `Page ${activePage} not found`
        });
    }

    return res.status(HttpCode.SUCCESS).json({
      activeCategory,
      articles: formatArticleDate(articles),
      articlesCount,
      pagesCount
    });
  });

  articlesRouter.post(`/`, ...newArticleFormFieldsRules, async (req, res) => {
    const errors = {
      errorsList: validateForm(req),
      errorByField: validateFormByFields(req)
    };
    let articleData = {...req.body};

    if (errors.errorsList.length > 0) {
      const categories = await categoryService.findAll();
      return res.status(HttpCode.BAD_REQUEST).send({
        categories,
        errors
      });
    }

    articleData = {
      ...articleData,
      createdDate: convertDate(articleData.createdDate),
      userId: 1
    };

    const newArticle = await articleService.createArticle(articleData);
    return res.status(HttpCode.CREATED).json(formatArticleDate(newArticle));
  });

  articlesRouter.put(`/:articleId`, checkParamIsInteger, ...newArticleFormFieldsRules, async (req, res) => {
    const {articleId} = req.params;
    const errors = {
      errorsList: validateForm(req),
      errorByField: validateFormByFields(req)
    };
    let articleData = {...req.body};
    const article = await articleService.findOne(articleId);

    if (!article) {
      return res.status(HttpCode.NOT_FOUND)
      .json({
        error: true,
        status: HttpCode.NOT_FOUND,
        message: `Article with id: ${articleId} not found`
      });
    }

    if (errors.errorsList.length > 0) {
      const categories = await categoryService.findAll();
      return res.status(HttpCode.BAD_REQUEST).send({
        categories,
        article,
        errors
      });
    }

    articleData = {
      ...articleData,
      createdDate: convertDate(articleData.createdDate),
      userId: 1
    };

    const updatedArticle = await articleService.updateArticle(articleId, articleData);
    return res.status(HttpCode.SUCCESS).json(updatedArticle);
  });

  articlesRouter.get(`/users/:userId/comments`, checkParamIsInteger, async (req, res) => {
    const {userId} = req.params;
    const isUserExist = await userService.findUserById(userId);

    if (!isUserExist) {
      return res.status(HttpCode.NOT_FOUND).json({
        error: true,
        status: HttpCode.NOT_FOUND,
        message: `User with id ${userId} not found`
      });
    }

    const userArticles = await articleService.findUserArticlesWithComments(userId);
    return res.status(HttpCode.SUCCESS).json(formatArticleDate(userArticles));
  });

  articlesRouter.get(`/users/comments`, async (req, res) => {
    const lastArticlesComments = await commentService.findAll();
    return res.status(HttpCode.SUCCESS).json(lastArticlesComments);
  });

  articlesRouter.get(`/users/:userId`, async (req, res) => {
    const {userId} = req.params;
    const isUserExist = await userService.findUserById(userId);

    if (!isUserExist) {
      return res.status(HttpCode.NOT_FOUND).json({
        error: true,
        status: HttpCode.NOT_FOUND,
        message: `User with id ${userId} not found`
      });
    }

    const userArticles = await articleService.findAllByUser(userId);

    return res.status(HttpCode.SUCCESS).json(formatArticleDate(userArticles));
  });

  articlesRouter.post(`/:articleId/comments`, checkParamIsInteger, ...newCommentFormFieldsRules, async (req, res) => {
    const {articleId} = req.params;
    const errors = validateForm(req);
    const article = await articleService.findOne(articleId);
    let commentFormData = {...req.body};

    if (!article) {
      return res.status(HttpCode.NOT_FOUND)
      .json({
        error: true,
        status: HttpCode.NOT_FOUND,
        message: `Article with id: ${articleId} not found`
      });
    }

    if (errors.length > 0) {
      return res.status(HttpCode.BAD_REQUEST).send({
        errors,
        article,
        commentFormData
      });
    }

    commentFormData = {
      ...commentFormData,
      userId: 2,
      articleId,
      createdDate: convertDate(moment())
    };

    const newСomment = await commentService.createComment(article, commentFormData);
    return res.status(HttpCode.CREATED).json(newСomment);
  });

  articlesRouter.delete(`/comments/:commentId`, checkParamIsInteger, async (req, res) => {
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
