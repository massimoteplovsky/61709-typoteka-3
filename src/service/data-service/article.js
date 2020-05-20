'use strict';

const {nanoid} = require(`nanoid`);
const {MAX_ID_LENGTH} = require(`../../constants`);

class ArticleService {
  constructor(articles) {
    this._articles = articles;
  }

  create(article) {
    const newArticle = Object.assign(
        {
          id: nanoid(MAX_ID_LENGTH)
        },
        article
    );

    this._articles.push(newArticle);

    return newArticle;
  }

  update(articleId, articleData) {
    const oldArticle = this._articles.find((article) => article.id === articleId);

    return Object.assign(oldArticle, articleData);
  }

  delete(articleId) {
    const deletedArticle = this._articles.find((article) => article.id === articleId);
    this._articles = this._articles.filter((article) => article.id !== articleId);

    return deletedArticle;
  }

  findOne(articleId) {
    return this._articles.find((article) => article.id === articleId);
  }

  findAll() {
    return this._articles;
  }
}

module.exports = ArticleService;
