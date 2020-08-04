'use strict';

const {sequelize} = require(`../db-config/db`);
const {Category} = sequelize.models;

class CategoryService {

  async create(categoryData) {
    return await Category.create(categoryData, {returning: true});
  }

  async updateCategory(categoryId, categoryData) {
    const [updateResult, [updatedCategory]] = await Category.update(categoryData, {
      where: {id: categoryId},
      returning: true
    });

    if (!updateResult) {
      throw Error(`Category is not updated: ${categoryId}`);
    }

    return updatedCategory;
  }

  async findOne(title) {
    return await Category.findOne({
      where: {
        title
      }
    });
  }

  async delete(categoryId) {
    return await Category.destroy({where: {id: categoryId}});
  }

  async findAll() {
    return await Category.findAll({});
  }

  async findAllWithArticlesCount() {
    const sql = `SELECT
                  categories.id,
                  categories.title,
                  count("articlesCategories"."categoryId") AS "articlesCount"
                FROM categories
                LEFT JOIN "articlesCategories"
                  ON "articlesCategories"."categoryId" = categories.id
                GROUP BY
                  categories.id,
                  categories.title
                ORDER BY
                  COUNT("articlesCategories"."categoryId") DESC;`;
    const categories = await sequelize.query(sql, {model: Category});

    return categories;
  }

  async findCategoryById(categoryId) {
    return await Category.findByPk(categoryId);
  }
}

module.exports = CategoryService;
