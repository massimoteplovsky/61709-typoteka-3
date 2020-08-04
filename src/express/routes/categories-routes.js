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

  categoriesRouter.post(`/delete/:categoryId`, async (req, res, next) => {
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

      const createdCategory = await service.createNewCategory(categoryData);

      if (createdCategory.error) {
        error.title = {msg: `Категория уже существует`};
        return res.render(`all-categories`, {error, categories, categoryData});
      }

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

      const updatedCategory = await service.updateCategory(categoryId, categoryData);

      if (updatedCategory.error) {
        error.title = {msg: `Категория уже существует`};
        console.log(error);
        return res.render(`all-categories`, {error, categories, categoryData, categoryId});
      }

      return res.redirect(`/categories`);
    } catch (err) {
      return next(err);
    }
  });

  return categoriesRouter;
};

module.exports = {getCategoriesRouter};
