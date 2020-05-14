'use strict';

const {HttpCode} = require(`../../constants`);

const offerKeys = [`title`, `announce`, `fullText`, `createdDate`, `category`, `comments`];

module.exports = (req, res, next) => {
  const newOffer = req.body;
  const keys = Object.keys(newOffer);
  const keysExists = offerKeys.every((key) => keys.includes(key));

  if (!keysExists) {
    return res.status(HttpCode.BAD_REQUEST)
      .json({
        error: true,
        status: HttpCode.BAD_REQUEST,
        message: `Invalid article data sent`
      });
  }

  return next();
};
