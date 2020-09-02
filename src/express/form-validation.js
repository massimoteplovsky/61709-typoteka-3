'use strict';

const {check} = require(`express-validator`);

const newUserFormFieldsRules = [
  check(`email`)
    .trim()
    .notEmpty()
    .withMessage(`Введите почту`)
    .bail()
    .isEmail()
    .withMessage(`Почта введена некорректно`),
  check(`firstname`)
    .trim()
    .notEmpty()
    .withMessage(`Введите имя`)
    .bail()
    .custom((value) => {
      const nameRegExp = /^[а-яА-ЯёЁa-zA-Z]+$/;
      return nameRegExp.test(value);
    })
    .withMessage(`Имя должно содержать только буквы`),
  check(`lastname`)
    .trim()
    .notEmpty()
    .withMessage(`Введите фамилию`)
    .bail()
    .custom((value) => {
      const nameRegExp = /^[а-яА-ЯёЁa-zA-Z]+$/;
      return nameRegExp.test(value);
    })
    .withMessage(`Фамилия должна содержать только буквы`),
  check(`password`)
    .trim()
    .notEmpty()
    .withMessage(`Введите пароль`)
    .bail()
    .isLength({min: 6})
    .withMessage(`Пароль должен содержать минимум 6 символов`),
  check(`confirm_password`)
    .trim()
    .notEmpty()
    .withMessage(`Подтвердите пароль`)
    .bail()
    .isLength({min: 6})
    .withMessage(`Пароль для подтверждения должен содержать минимум 6 символов`)
    .bail()
    .custom((value, {req}) => value !== req.body.password)
];

module.exports = {
  newUserFormFieldsRules
};
