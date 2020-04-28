'use strict';

const fs = require(`fs`).promises;
const {
  getRandomInt,
  shuffle,
  generateRandomDate,
  readContent
} = require(`../../utils`);
const chalk = require(`chalk`);

const {
  ArticleCount,
  DateOption,
  FilePath,
  GeneratorSlicer,
  ExitCode
} = require(`../../constants`);

const getTitle = (titles) => titles[getRandomInt(0, titles.length - 1)];
const getAnnounces = (sentences) => shuffle(sentences).slice(GeneratorSlicer.MIN, GeneratorSlicer.MAX).join(` `);
const getFullText = (sentences) => shuffle(sentences).slice(GeneratorSlicer.MIN, getRandomInt(0, sentences.length - 1)).join(` `);
const getCategories = (categories) => shuffle(categories).slice(GeneratorSlicer.MIN, getRandomInt(0, categories.length - 1));

const generateArticles = (count, titles, categories, sentences) => (
  Array(count).fill({}).map(() => ({
    title: getTitle(titles),
    announce: getAnnounces(sentences),
    fullText: getFullText(sentences),
    createdDate: generateRandomDate(
        new Date(
            new Date().getFullYear(),
            new Date().getMonth() - DateOption.MONTH_START,
            DateOption.DATE_START
        ),
        new Date()
    ),
    category: getCategories(categories)
  }))
);

module.exports = {
  name: `--generate`,
  async run(userInputValue) {
    const titles = await readContent(FilePath.TITLES);
    const categories = await readContent(FilePath.CATEGORIES);
    const sentences = await readContent(FilePath.SENTENCES);
    const articleQuantity = Math.abs(Number.parseInt(userInputValue, 10) || ArticleCount.DEFAULT);

    if (articleQuantity > ArticleCount.MAX) {
      console.log(chalk.red(`Не больше ${ArticleCount.MAX} публикаций`));
      process.exit(ExitCode.SUCCESS);
    }

    const content = JSON.stringify(generateArticles(articleQuantity, titles, categories, sentences));

    try {
      await fs.writeFile(FilePath.MOCKS, content);
      return console.log(chalk.green(`Operation success. File created.`));
    } catch (e) {
      console.error(chalk.red(`Can't write data to file...`));
      return process.exit(ExitCode.ERROR);
    }
  }
};
