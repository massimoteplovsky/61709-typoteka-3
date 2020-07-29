'use strict';

const {sequelize} = require(`../db-config/db`);
const {Article, Comment, articlesCategories, Category} = sequelize.models;
const POPULAR_ARTICLES_LIMIT = 4;
const ARTICLES_LIMIT = 8;

class ArticleService {
  constructor(articles) {
    this._articles = articles;
  }

  async findAll() {
    const articles = await Article.findAll({
      include: [`categories`, `comments`],
      limit: ARTICLES_LIMIT
    });

    return articles;
  }

  async findAllByUser(userId) {
    const userArticles = await Article.findAll({
      where: {userId}
    });

    return userArticles;
  }

  async createArticle(articleData) {
    const newArticle = await Article.create(articleData, {returning: true});
    await newArticle.addCategories(articleData.categories);
    return newArticle;
  }

  async updateArticle(articleId, articleData) {
    const [updateResult, [updatedArticle]] = await Article.update(articleData, {
      where: {id: articleId},
      returning: true
    });

    if (!updateResult) {
      throw Error(`Article is not updated: ${articleId}`);
    }

    await articlesCategories.destroy({where: {articleId}});
    await updatedArticle.addCategories(articleData.categories);

    return updatedArticle;
  }

  async deleteArticle(articleId) {
    return await Article.destroy({where: {id: articleId}});
  }

  async findMostDiscussedArticles() {

    const offers = await Article.findAll({
      attributes: [`id`, `announce`, [sequelize.fn(`count`, sequelize.col(`comments.articleId`)), `commentsCount`]],
      include: [
        {
          model: Comment,
          as: `comments`,
          attributes: [],
          required: true,
          duplicating: false
        }
      ],
      group: [`Article.id`],
      order: sequelize.literal(`"commentsCount" DESC`),
      limit: POPULAR_ARTICLES_LIMIT
    });

    return offers;
  }

  async findOne(articleId) {
    const article = await Article.findByPk(articleId, {
      include: [
        `categories`,
        {
          model: Comment,
          as: `comments`,
          include: [`users`]
        }
      ],
      order: sequelize.literal(`"comments"."createdDate" DESC`)
    });

    return article;
  }

  async findArticlesByCategory(categoryId) {
    const category = await Category.findByPk(categoryId);
    const articles = await category.getArticles({include: [`categories`, `comments`]});

    return {category, articles};
  }

  async findAllByUser(userId) {
    return await Article.findAll({
      where: {userId},
      order: [[`createdDate`, `DESC`]]
    });
  }

  async findUserArticlesWithComments(userId) {
    return await Article.findAll({
      where: {userId},
      include: [
        {
          model: Comment,
          as: `comments`,
          include: [`users`]
        }
      ],
      order: sequelize.literal(`"comments"."createdDate" DESC`)
    });
  }
}

module.exports = ArticleService;
