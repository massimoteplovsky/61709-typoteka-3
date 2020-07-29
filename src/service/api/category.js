'use strict';

const {Router} = require(`express`);
const categoryValidator = require(`../middlewares/category-validator`);
const {HttpCode} = require(`../../constants`);

const getCategoryRouter = (categoryService) => {
  const categoryRouter = new Router();

  categoryRouter.get(`/`, async (req, res) => {
    const categories = await categoryService.findAllWithArticlesCount();
    return res.status(HttpCode.SUCCESS).json(categories);
  });

  categoryRouter.delete(`/:categoryId`, async (req, res) => {
    const {categoryId} = req.params;
    const category = await categoryService.findCategoryById(categoryId);

    if (!category) {
      return res.status(HttpCode.NOT_FOUND)
      .json({
        error: true,
        status: HttpCode.NOT_FOUND,
        message: `Category doesn't exist`
      });
    }

    const articlesCount = await category.countArticles();

    if (articlesCount > 0) {
      return res.status(HttpCode.SUCCESS).json(category);
    }

    const deletedCategory = await categoryService.delete(categoryId);

    return res.status(HttpCode.SUCCESS).json(deletedCategory);
  });

  categoryRouter.post(`/`, categoryValidator, async (req, res) => {
    const categoryData = req.body;
    const isCategoryExist = await categoryService.findOne(categoryData.title);

    if (isCategoryExist) {
      return res.status(HttpCode.SUCCESS)
      .json({
        error: true,
        status: HttpCode.SUCCESS,
        message: `Category already exists`
      });
    }

    const newCategory = await categoryService.create(categoryData);
    return res.status(HttpCode.CREATED).json(newCategory);
  });

  categoryRouter.put(`/:categoryId`, async (req, res) => {
    const {categoryId} = req.params;
    const categoryData = req.body;
    const category = await categoryService.findCategoryById(categoryId);

    if (!category) {
      return res.status(HttpCode.NOT_FOUND)
      .json({
        error: true,
        status: HttpCode.NOT_FOUND,
        message: `Category is not found`
      });
    }

    const isCategoryExist = await categoryService.findOne(categoryData.title);

    if (isCategoryExist) {
      return res.status(HttpCode.SUCCESS)
      .json({
        error: true,
        status: HttpCode.SUCCESS,
        message: `Category already exists`
      });
    }

    const updatedCategory = await categoryService.updateCategory(categoryId, categoryData);
    return res.status(HttpCode.SUCCESS).json(updatedCategory);
  });

  categoryRouter.get(`/articles`, async (req, res) => {
    const categories = await categoryService.findAllWithArticlesCount();
    return res.status(HttpCode.SUCCESS).json(categories);
  });

  return categoryRouter;

};

module.exports = {getCategoryRouter};
