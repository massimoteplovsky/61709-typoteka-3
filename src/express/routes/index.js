'use strict';

const {getArticlesRouter} = require(`./articles-routes`);
const {getCategoriesRouter} = require(`./categories-routes`);
const {getMainRouter} = require(`./main-routes`);
const {getMyRouter} = require(`./my-routes`);

module.exports = {
  getArticlesRouter,
  getCategoriesRouter,
  getMainRouter,
  getMyRouter
};
