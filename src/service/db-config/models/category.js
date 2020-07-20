'use strict';
const Sequelize = require(`sequelize`);

class Category extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    return super.init({
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      }
    }, {
      sequelize,
      tableName: `categories`,
      timestamps: false
    });
  }

  static associate(models) {
    this.articlesCategories = this.belongsToMany(models.Article, {
      through: `articlesCategories`,
      as: `articles`,
      foreignKey: `categoryId`,
      timestamps: false,
      paranoid: false
    });
  }
}

module.exports = Category;


