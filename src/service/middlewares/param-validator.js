'use strict';

const {HttpCode} = require(`../../constants`);

const checkParamIsInteger = (req, res, next) => {
  const params = req.params;
  const isInteger = Object.keys(params).every((param) => Number.isInteger(Number(params[param])));

  if (!isInteger) {
    return res.status(HttpCode.NOT_FOUND)
      .json({
        status: HttpCode.NOT_FOUND,
        message: `Incorrect data sent`
      });
  }

  return next();
};

module.exports = {
  checkParamIsInteger
};
