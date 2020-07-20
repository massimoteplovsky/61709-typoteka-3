'use strict';

class ApiService {

  constructor(api) {
    this._api = api;
  }

  async getAllArticles() {
    return await this._api.get(`/articles`);
  }

  async getAllArticlesByUser(userId) {
    return await this._api.get(`/articles/users/${userId}`);
  }

  async getArticleById(articleId) {
    return await this._api.get(`/articles/${articleId}`);
  }

  async getArticleBycategory(categoryId) {
    return await this._api.get(`/articles/category/${categoryId}`);
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

  async getArticleComments(articleId) {
    return await this._api.get(`/articles/${articleId}/comments`);
  }

  async getLastArticlesComments() {
    return await this._api.get(`/articles/users/comments`);
  }

  async getUserArticleComments(userId) {
    return await this._api.get(`/articles/users/${userId}/comments`);
  }

}

module.exports = ApiService;
