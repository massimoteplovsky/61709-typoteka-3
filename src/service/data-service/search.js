'use strict';

class SearchService {
  constructor(articles) {
    this._articles = articles;
  }

  findAll(text) {
    return this._articles.filter((article) => {
      return article.title.toLowerCase().includes(text.toLowerCase());
    });
  }
}

module.exports = SearchService;
