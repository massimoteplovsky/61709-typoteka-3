'use strict';

const {HttpCode} = require(`../../constants`);

const userKeys = [`firstname`, `lastname`, `email`, `password`, `avatar`];

module.exports = (req, res, next) => {
  const comment = req.body;
  const keys = Object.keys(comment);
  const keysExists = userKeys.every((key) => keys.includes(key));

  if (!keysExists) {
    return res.status(HttpCode.BAD_REQUEST)
      .json({
        error: true,
        status: HttpCode.BAD_REQUEST,
        message: `Incorrect user data sent`
      });
  }

  return next();
};
