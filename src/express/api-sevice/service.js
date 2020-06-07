'use strict';

class ApiService {

  constructor(api) {
    this._api = api;
  }

  async getAllArticles() {
    return await this._api.get(`/articles`);
  }

  async getArticleById(articleId) {
    return await this._api.get(`/articles/${articleId}`);
  }

  async createNewArticle(articleData) {
    return await this._api.post(`/articles`, articleData);
  }

  async getAllCategories() {
    return await this._api.get(`/categories`);
  }

  async searchArticles(query) {
    return await this._api.get(`/search?query=${encodeURI(query)}`);
  }

  async getArticleComments(articleId) {
    return await this._api.get(`/articles/${articleId}/comments`);
  }

}

module.exports = ApiService;
