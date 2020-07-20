'use strict';

const {Router} = require(`express`);
const {validationResult} = require(`express-validator`);
const {newCategoryFormFieldsRules} = require(`../form-validation`);

const getCategoriesRouter = (service) => {
  const categoriesRouter = new Router();

  categoriesRouter.get(`/`, async (req, res, next) => {
    try {
      const categories = await service.getAllCategoriesWithArticlesCount();
      return res.render(`all-categories`, {categories});
    } catch (err) {
      return next(err);
    }
  });

  categoriesRouter.get(`/:categoryId`, async (req, res, next) => {
    try {
      const {categoryId} = req.params;
      await service.deleteCategory(categoryId);

      return res.redirect(`/categories`);
    } catch (err) {
      return next(err);
    }
  });

  categoriesRouter.post(`/`, ...newCategoryFormFieldsRules, async (req, res, next) => {
    try {
      const error = validationResult(req).mapped();
      const categories = await service.getAllCategories();
      let categoryData = {...req.body};

      if (Object.keys(error).length > 0) {
        return res.render(`all-categories`, {error, categories, categoryData});
      }

      await service.createNewCategory(categoryData);

      return res.redirect(`/categories`);
    } catch (err) {
      return next(err);
    }
  });

  categoriesRouter.post(`/:categoryId`, ...newCategoryFormFieldsRules, async (req, res, next) => {
    try {
      const {categoryId} = req.params;
      const error = validationResult(req).mapped();
      const categories = await service.getAllCategories();
      let categoryData = {...req.body};

      if (Object.keys(error).length > 0) {
        return res.render(`all-categories`, {error, categories, categoryData, categoryId});
      }

      await service.updateCategory(categoryId, categoryData);

      return res.redirect(`/categories`);
    } catch (err) {
      return next(err);
    }
  });

  return categoriesRouter;
};

module.exports = {getCategoriesRouter};
