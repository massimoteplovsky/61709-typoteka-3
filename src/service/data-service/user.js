'use strict';

const {sequelize} = require(`../db-config/db`);
const {User} = sequelize.models;

class UserService {

  async createUser(userData) {
    return await User.create(userData, {returning: true});
  }

  async findAll() {
    return await User.findAll();
  }

  async countUsers() {
    return await User.count();
  }

  async findUserById(userId) {
    return await User.findByPk(userId);
  }

  async findUserByEmail(email) {
    return await User.findOne({where: {email}});
  }

}

module.exports = UserService;
