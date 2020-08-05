'use strict';

class ApiService {

  constructor(api) {
    this._api = api;
  }

  async getAllArticles(activePage) {
    return await this._api.get(`/articles`, {params: {activePage}});
  }

  async getAllArticlesByUser(userId) {
    return await this._api.get(`/articles/users/${userId}`);
  }

  async getArticleById(articleId) {
    return await this._api.get(`/articles/${articleId}`);
  }

  async getArticleByCategory(categoryId, activePage) {
    return await this._api.get(`/articles/category/${categoryId}`, {params: {activePage}});
  }

  async deleteArticle(articleId) {
    return await this._api.delete(`/articles/${articleId}`);
  }

  async createNewArticle(articleData) {
    return await this._api.post(`/articles`, articleData);
  }

  async updateArticle(articleId, articleData) {
    return await this._api.put(`/articles/${articleId}`, articleData);
  }

  async getAllCategories() {
    return await this._api.get(`/categories`);
  }

  async getAllCategoriesWithArticlesCount() {
    return await this._api.get(`/categories/articles`);
  }

  async createNewCategory(categoryData) {
    return await this._api.post(`/categories`, categoryData);
  }

  async updateCategory(categoryId, categoryData) {
    return await this._api.put(`/categories/${categoryId}`, categoryData);
  }

  async deleteCategory(categoryId) {
    return await this._api.delete(`/categories/${categoryId}`);
  }

  async searchArticles(query) {
    return await this._api.get(`/search?query=${encodeURI(query)}`);
  }

  async createComment(articleId, commentData) {
    return await this._api.post(`/articles/${articleId}/comments`, commentData);
  }

  async deleteComment(commentId) {
    return await this._api.delete(`/articles/comments/${commentId}`);
  }

  async getLastArticlesComments() {
    return await this._api.get(`/articles/users/comments`);
  }

  async getUserArticleComments(userId) {
    return await this._api.get(`/articles/users/${userId}/comments`);
  }

  async createUser(userData) {
    return await this._api.post(`/users`, userData);
  }

}

module.exports = ApiService;
