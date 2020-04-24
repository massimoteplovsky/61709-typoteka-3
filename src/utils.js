'use strict';

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

const changeFormat = (format) => format < 10 ? `0${format}` : format;

const generateRandomDate = (start, end) => {
  const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  const year = randomDate.getFullYear();
  const month = changeFormat(randomDate.getMonth() + 1);
  const dateOfMonth = changeFormat(randomDate.getDate());
  const hours = changeFormat(randomDate.getHours());
  const minutes = changeFormat(randomDate.getMinutes());
  const seconds = changeFormat(randomDate.getSeconds());

  return `${year}-${month}-${dateOfMonth} ${hours}:${minutes}:${seconds}`;
};

module.exports = {
  getRandomInt,
  shuffle,
  generateRandomDate
};
