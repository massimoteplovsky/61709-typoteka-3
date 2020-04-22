'use strict';

const fs = require(`fs`);
const {
  getRandomInt,
  shuffle,
  generateRandomDate
} = require(`../../utils`);

const {
  DEFAULT_COUNT,
  MAX_ARTICLE_COUNT,
  FILE_NAME,
  MONTH_START,
  DATE_START,
  TITLES,
  ANNOUNCEMENTS,
  CATEGORIES,
  ExitCode
} = require(`../../constants`);

const generateArticles = (count) => (
  Array(count).fill({}).map(() => ({
    title: TITLES[getRandomInt(0, TITLES.length - 1)],
    announce: shuffle(ANNOUNCEMENTS).slice(0, 4).join(` `),
    fullText: shuffle(ANNOUNCEMENTS).slice(0, getRandomInt(0, ANNOUNCEMENTS.length - 1)).join(` `),
    createdDate: generateRandomDate(
        new Date(new Date().getFullYear(), new Date().getMonth() - MONTH_START, DATE_START),
        new Date()
    ),
    category: shuffle(CATEGORIES).slice(0, getRandomInt(0, CATEGORIES.length - 1)),
  }))
);

module.exports = {
  name: `--generate`,
  run(userInputValue) {
    const countArticle = Number.parseInt(userInputValue, 10) || DEFAULT_COUNT;

    if (countArticle > MAX_ARTICLE_COUNT) {
      console.log(`Не больше ${MAX_ARTICLE_COUNT} публикаций`);
      process.exit(ExitCode.SUCCESS);
    }

    const content = JSON.stringify(generateArticles(Math.abs(countArticle)));

    fs.writeFile(FILE_NAME, content, (err) => {
      if (err) {
        return console.error(`Can't write data to file...`);
      }

      return console.log(`Operation success. File created.`);
    });

  }
};
