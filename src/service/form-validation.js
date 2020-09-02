'use strict';

const {check} = require(`express-validator`);
const CategoryService = require(`./data-service/category`);

const categoryService = new CategoryService();

const newArticleFormFieldsRules = [
  check(`title`)
    .trim()
    .notEmpty()
    .escape()
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
  check(`categories`, `Выберите минимум одну категорию для публикации`)
    .exists()
    .bail()
    .toArray()
    .isLength({min: 1}),
  check(`announce`)
    .trim()
    .notEmpty()
    .escape()
    .withMessage(`Введите описание публикации`)
    .bail()
    .isLength({
      min: 30,
      max: 250
    })
    .withMessage(`Анонс должен содержать от 30 до 250 символов`),
  check(`fullText`, `Полный текст должен содержать максимум 1000 символов`)
    .trim()
    .isLength({max: 1000})
    .escape()
];

const newCategoryFormFieldsRules = [
  check(`title`)
  .trim()
    .notEmpty()
    .withMessage(`Введите название категории`)
    .bail()
    .isLength({
      min: 5,
      max: 30
    })
    .withMessage(`Название категории должно содержать от 5 до 30 символов`)
    .bail()
    .custom(async (value) => {
      const isCategoryExist = await categoryService.findOne(value);

      if (isCategoryExist) {
        throw Error(`Категория уже существует`);
      }

      return true;
    })
];

const newCommentFormFieldsRules = [
  check(`text`)
  .trim()
    .notEmpty()
    .withMessage(`Введите текст комментария`)
    .escape()
    .bail()
    .isLength({
      min: 20
    })
    .withMessage(`Текст комментария должен содержать минимум 20 символов`)
];

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
  newArticleFormFieldsRules,
  newCategoryFormFieldsRules,
  newCommentFormFieldsRules,
  newUserFormFieldsRules
};
