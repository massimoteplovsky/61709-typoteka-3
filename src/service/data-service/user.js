'use strict';

const {sequelize} = require(`../db-config/db`);
const {User} = sequelize.models;

class UserService {

  async createUser(userData) {
    return await User.create(userData, {returning: true});
  }

  async findAll() {
    return User.findAll();
  }

  async findUserByEmail(email) {
    return User.findOne({where: {email}});
  }

}

module.exports = UserService;
