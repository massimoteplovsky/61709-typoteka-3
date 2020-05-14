'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);

const categoryRouter = new Router();

const getCategoryRouter = (categoryService) => {

  categoryRouter.get(`/`, (req, res) => {
    const categories = categoryService.findAll();
    return res.status(HttpCode.SUCCESS).json(categories);
  });

  return categoryRouter;

};

module.exports = {getCategoryRouter};
