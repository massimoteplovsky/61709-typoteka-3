'use strict';

const {getCategoryRouter} = require(`./category`);
const {getArticlesRouter} = require(`./article`);
const {getSearchRouter} = require(`./search`);
const {getUserRouter} = require(`./user`);

module.exports = {
  getCategoryRouter,
  getArticlesRouter,
  getSearchRouter,
  getUserRouter
};
