'use strict';

const fs = require(`fs`).promises;
const moment = require(`moment`);
const chalk = require(`chalk`);

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const shuffle = (someArray) => {
  for (let i = someArray.length - 1; i > 0; i--) {
    const randomPosition = Math.floor(Math.random() * i);
    [someArray[i], someArray[randomPosition]] = [someArray[randomPosition], someArray[i]];
  }

  return someArray;
};

const generateRandomDate = (start, end) => {
  return moment.utc(moment(start.getTime() + Math.random() * (end.getTime() - start.getTime()))).format();
};

const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);
    return content.trim().split(`\n`);
  } catch (err) {
    console.error(chalk.red(err));
    return [];
  }
};

const readContentJSON = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);

    if (!content.trim().length) {
      return [];
    }

    return JSON.parse(content);
  } catch (err) {
    console.error(chalk.red(err));
    return [];
  }
};

const getMostDiscussedArticles = (articles) => {
  return articles.filter((article) => article.comments.length > 0)
                .sort((a, b) => b.comments.length - a.comments.length)
                .slice(0, 4);
};

const convertDate = (dateToCheck) => {
  const date = moment(dateToCheck, `DD.MM.YYYY`);

  if (date.isSame(moment(), `day`, `month`, `year`)) {
    return moment.utc().format();
  }

  return moment.utc(date).format();
};

const copyObject = (obj) => JSON.parse(JSON.stringify(obj));

const formatArticleDate = (articleData) => {

  const DATE_FORMAT = `DD.MM.YYYY, HH:mm`;
  const makeDateFormat = (date) => moment(date).format(DATE_FORMAT);

  if (Array.isArray(articleData)) {
    const newArticleList = copyObject(articleData);
    return newArticleList.map((article) => {
      article.createdDate = makeDateFormat(article.createdDate);
      return article;
    });
  }

  return {...articleData, createdDate: makeDateFormat(articleData.createdDate)};
};

const highlightArticleTitle = (articles, searchedText) => {
  const newArticleList = copyObject(articles);
  return newArticleList.map((article) => {
    const index = article.title.toLowerCase().indexOf(searchedText.toLowerCase());

    if (index !== -1) {
      article.title = `
        ${article.title.slice(0, index)}
        <b>
        ${article.title.slice(index, index + searchedText.length)}
        </b>
        ${article.title.slice(index + searchedText.length)}`;
    }

    return article;
  });
};

module.exports = {
  getRandomInt,
  shuffle,
  generateRandomDate,
  readContent,
  readContentJSON,
  getMostDiscussedArticles,
  convertDate,
  formatArticleDate,
  highlightArticleTitle
};
