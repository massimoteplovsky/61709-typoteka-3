'use strict';

const {check} = require(`express-validator`);

const newArticleFormFieldsRules = [
  check(`title`)
    .trim()
    .notEmpty()
    .withMessage(`Введите название публикации`)
    .bail()
    .isLength({
      min: 30,
      max: 250
    })
    .withMessage(`Заголовок должен содержать от 30 до 250 символов`),
  check(`createdDate`)
    .notEmpty()
    .withMessage(`Введите дату`)
    .bail()
    .custom((value) => {
      const dateRegex = /^(0?[1-9]|[12][0-9]|3[01])[\.](0?[1-9]|1[012])[\.]\d{4}$/;
      return dateRegex.test(value);
    })
    .withMessage(`Неверный формат даты`),
  check(`category`, `Выберите минимум одну категорию для публикации`)
    .exists()
    .bail()
    .toArray()
    .isLength({min: 1}),
  check(`announce`)
    .trim()
    .notEmpty()
    .withMessage(`Введите описание публикации`)
    .bail()
    .isLength({
      min: 30,
      max: 250
    })
    .withMessage(`Анонс должен содержать от 30 до 250 символов`),
  check(`fullText`, `Полный текст должен содержать максимум 1000 символов`).trim().isLength({max: 1000})
];

module.exports = {newArticleFormFieldsRules};
