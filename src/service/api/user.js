'use strict';

const {Router} = require(`express`);
const bcrypt = require(`bcrypt`);
const {newUserFormFieldsRules} = require(`../form-validation`);
const {validateForm, validateFormByFields} = require(`../../utils`);
const {HttpCode, UserRole} = require(`../../constants`);
const saltRounds = 10;

const getUserRouter = (userService) => {
  const userRouter = new Router();

  userRouter.get(`/`, async (req, res) => {
    const users = await userService.findAll();
    return res.status(HttpCode.SUCCESS).json(users);
  });

  userRouter.post(`/`, ...newUserFormFieldsRules, async (req, res) => {
    const errors = {
      errorsList: validateForm(req),
      errorByField: validateFormByFields(req)
    };
    let userData = {...req.body};

    const user = await userService.findUserByEmail(userData.email);

    if (user) {
      errors.errorsList.push(`Пользователь с такой почтой ${user.email} уже существует.`);
      errors.errorByField[`email`] = {msg: `Пользователь с такой почтой ${user.email} уже существует.`};
    }

    if (errors.errorsList.length > 0) {
      return res.status(HttpCode.BAD_REQUEST).send({errors});
    }

    const usersCount = await userService.countUsers();

    userData = {
      ...userData,
      password: await bcrypt.hash(userData.password, saltRounds),
      role: usersCount > 0 ? UserRole.READER : UserRole.ADMIN
    };

    const newUser = await userService.createUser(userData);

    return res.status(HttpCode.CREATED).json(newUser);
  });

  return userRouter;

};

module.exports = {getUserRouter};
