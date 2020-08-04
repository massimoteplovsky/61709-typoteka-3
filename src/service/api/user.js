'use strict';

const {Router} = require(`express`);
const userValidator = require(`../middlewares/user-validator`);
const {HttpCode} = require(`../../constants`);

const getUserRouter = (userService) => {
  const userRouter = new Router();

  userRouter.get(`/`, async (req, res) => {
    const users = await userService.findAll();
    return res.status(HttpCode.CREATED).json(users);
  });

  userRouter.post(`/`, userValidator, async (req, res) => {
    const userData = req.body;
    const isUserExist = await userService.findUserByEmail(userData.email);

    if (isUserExist) {
      return res.status(HttpCode.SUCCESS).json({
        error: true,
        message: `Пользователь с такой почтой уже существует`
      });
    }

    const newUser = await userService.createUser(userData);

    return res.status(HttpCode.CREATED).json(newUser);
  });

  return userRouter;

};

module.exports = {getUserRouter};
