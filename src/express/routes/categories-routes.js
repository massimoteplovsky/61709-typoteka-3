'use strict';

const {Router} = require(`express`);

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

  categoriesRouter.post(`/:categoryId/delete`, async (req, res, next) => {
    try {
      const {categoryId} = req.params;
      await service.deleteCategory(categoryId);

      return res.redirect(`/categories`);
    } catch (err) {
      return next(err);
    }
  });

  categoriesRouter.post(`/`, async (req, res, next) => {
    try {
      let categoryData = {...req.body};

      const createdCategory = await service.createNewCategory(categoryData);

      if (createdCategory.validationError) {
        const {newCategoryError, categories} = createdCategory;
        return res.render(`all-categories`, {newCategoryError, categories, newCategoryData: categoryData});
      }

      return res.redirect(`/categories`);
    } catch (err) {
      return next(err);
    }
  });

  categoriesRouter.post(`/:categoryId`, async (req, res, next) => {
    try {
      const {categoryId} = req.params;
      let categoryData = {...req.body};

      const updatedCategory = await service.updateCategory(categoryId, categoryData);

      if (updatedCategory.validationError) {
        const {error, categories} = updatedCategory;
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
