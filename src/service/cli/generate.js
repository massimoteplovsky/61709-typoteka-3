'use strict';

const fs = require(`fs`).promises;
const chalk = require(`chalk`);
const {nanoid} = require(`nanoid`);

const {
  getRandomInt,
  shuffle,
  generateRandomDate,
  readContent
} = require(`../../utils`);

const {
  MAX_ID_LENGTH,
  MAX_COMMENTS_COUNT,
  ArticleCount,
  DateOption,
  FilePath,
  GeneratorSlicer,
  ExitCode
} = require(`../../constants`);

const getTitle = (titles) => {
  return titles[getRandomInt(0, titles.length - 1)];
};

const getAnnounces = (sentences) => {
  return shuffle(sentences)
        .slice(GeneratorSlicer.MIN, GeneratorSlicer.MAX)
        .join(` `);
};

const getFullText = (sentences) => {
  return shuffle(sentences)
        .slice(GeneratorSlicer.MIN, getRandomInt(1, sentences.length - 1))
        .join(` `);
};

const getCategories = (categories) => {
  return shuffle(categories)
        .slice(GeneratorSlicer.MIN, getRandomInt(1, categories.length - 1));
};

const getComments = (count, comments) => {
  return Array(count).fill({}).map(() => ({
    id: nanoid(MAX_ID_LENGTH),
    text: shuffle(comments).slice(0, getRandomInt(1, comments.length - 1)).join(` `)
  }));
};

const generateArticles = (count, titles, categories, sentences, comments) => (

  Array(count).fill({}).map(() => ({
    id: nanoid(MAX_ID_LENGTH),
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
    category: getCategories(categories),
    comments: getComments(getRandomInt(1, MAX_COMMENTS_COUNT), comments)
  }))
);

module.exports = {
  name: `--generate`,
  async run(count) {
    const titles = await readContent(FilePath.TITLES);
    const categories = await readContent(FilePath.CATEGORIES);
    const sentences = await readContent(FilePath.SENTENCES);
    const comments = await readContent(FilePath.COMMENTS);
    const articleQuantity = Math.abs(Number.parseInt(count, 10) || ArticleCount.DEFAULT);

    if (articleQuantity > ArticleCount.MAX) {
      console.log(chalk.red(`Не больше ${ArticleCount.MAX} публикаций`));
      process.exit(ExitCode.SUCCESS);
    }

    const content = JSON.stringify(
        generateArticles(articleQuantity, titles, categories, sentences, comments)
    );

    try {
      await fs.writeFile(FilePath.MOCKS, content);
      return console.log(chalk.green(`Operation success. File created.`));
    } catch (e) {
      console.error(chalk.red(`Can't write data to file...`));
      return process.exit(ExitCode.ERROR);
    }
  }
};
