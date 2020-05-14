'use strict';

class CategoryService {
  constructor(articles) {
    this._articles = articles;
  }

  findAll() {
    const categories = this._articles.reduce((categoriesList, article) => {
      categoriesList.add(...article.category);
      return categoriesList;
    }, new Set());

    return [...categories];
  }
}

module.exports = CategoryService;
