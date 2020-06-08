'use strict';

class CategoryService {
  constructor(articles) {
    this._articles = articles;
  }

  findAll() {
    return [
      ...new Set(
          this._articles.reduce((categoriesList, article) => categoriesList.concat(article.category), [])
      )
    ];
  }
}

module.exports = CategoryService;
