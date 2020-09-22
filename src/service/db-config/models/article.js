'use strict';

const Sequelize = require(`sequelize`);

class Article extends Sequelize.Model {
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
        allowNull: false
      },
      announce: {
        type: DataTypes.STRING,
        allowNull: false
      },
      fullText: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      picture: {
        type: DataTypes.STRING,
        allowNull: true
      },
      createdDate: {
        type: DataTypes.DATE,
        allowNull: false
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
    }, {
      sequelize,
      tableName: `articles`,
      timestamps: false
    });
  }

  static associate(models) {
    this.articlesUsers = this.belongsTo(models.User, {
      as: `users`,
      foreignKey: `userId`,
      onUpdate: `cascade`,
      onDelete: `cascade`
    });
    this.articlesComments = this.hasMany(models.Comment, {
      as: `comments`,
      foreignKey: `articleId`,
      onUpdate: `cascade`,
      onDelete: `cascade`
    });
    this.articlesCategories = this.belongsToMany(models.Category, {
      through: `articlesCategories`,
      as: `categories`,
      foreignKey: `articleId`,
      timestamps: false,
      paranoid: false
    });
  }
}

module.exports = Article;
