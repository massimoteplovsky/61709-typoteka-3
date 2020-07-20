'use strict';

const Sequelize = require(`sequelize`);

class Comment extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    return super.init({
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      articleId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      text: {
        type: DataTypes.STRING,
        allowNull: false
      },
      createdDate: {
        type: DataTypes.DATE,
        allowNull: false
      }
    }, {
      sequelize,
      tableName: `comments`,
      timestamps: false
    });
  }

  static associate(models) {
    this.commentsArticles = this.belongsTo(models.Article, {
      as: `articles`,
      foreignKey: `articleId`
    });
    this.commentsUsers = this.belongsTo(models.User, {
      as: `users`,
      foreignKey: `userId`,
      onUpdate: `cascade`,
      onDelete: `cascade`
    });
  }
}

module.exports = Comment;
