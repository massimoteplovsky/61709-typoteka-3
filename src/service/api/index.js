'use strict';

const {getCategoryRouter} = require(`./category`);
const {getArticlesRouter} = require(`./article`);
const {getSearchRouter} = require(`./search`);

module.exports = {
  getCategoryRouter,
  getArticlesRouter,
  getSearchRouter
};
