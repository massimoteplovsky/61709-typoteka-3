'use strict';

const fs = require(`fs`);
const {
  getRandomInt,
  shuffle,
  generateRandomDate
} = require(`../../utils`);

const {
  ArticleCount,
  FILE_NAME,
  MONTH_START,
  DATE_START,
  TITLES,
  ANNOUNCEMENTS,
  CATEGORIES,
  GeneratorSlicer,
  ExitCode
} = require(`../../constants`);

const getTitle = (titles) => TITLES[getRandomInt(0, titles.length - 1)];
const getAnnounces = (announcements) => shuffle(announcements).slice(GeneratorSlicer.MIN, GeneratorSlicer.MAX).join(` `);
const getFullText = (announcements) => shuffle(announcements).slice(GeneratorSlicer.MIN, getRandomInt(0, announcements.length - 1)).join(` `);
const getCategories = (categories) => shuffle(categories).slice(GeneratorSlicer.MIN, getRandomInt(0, categories.length - 1));

const generateArticles = (count) => (
  Array(count).fill({}).map(() => ({
    title: getTitle(TITLES),
    announce: getAnnounces(ANNOUNCEMENTS),
    fullText: getFullText(ANNOUNCEMENTS),
    createdDate: generateRandomDate(
        new Date(
            new Date().getFullYear(),
            new Date().getMonth() - MONTH_START,
            DATE_START
        ),
        new Date()
    ),
    category: getCategories(CATEGORIES)
  }))
);

module.exports = {
  name: `--generate`,
  run(userInputValue) {
    const articleQuantity = Math.abs(Number.parseInt(userInputValue, 10) || ArticleCount.DEFAULT);

    if (articleQuantity > ArticleCount.MAX) {
      console.log(`Не больше ${ArticleCount.MAX} публикаций`);
      process.exit(ExitCode.SUCCESS);
    }

    const content = JSON.stringify(generateArticles(articleQuantity));

    try {
      fs.writeFileSync(FILE_NAME, content);
      return console.log(`Operation success. File created.`);
    } catch (e) {
      console.error(`Can't write data to file...`);
      return process.exit(ExitCode.ERROR);
    }
  }
};
