'use strict';

const DEFAULT_COMMAND = `--help`;
const USER_ARGV_INDEX = 2;

const ExitCode = {
  ERROR: 1,
  SUCCESS: 0,
};

const GeneratorSlicer = {
  MIN: 0,
  NAX: 4
};

const ArticleCount = {
  DEFAULT: 1,
  MAX: 1000
};

const FilePath = {
  MOCKS: `mocks.json`,
  SENTENCES: `./data/sentences.txt`,
  TITLES: `./data/titles.txt`,
  CATEGORIES: `./data/categories.txt`
};

const DateOption = {
  MONTH_START: 2,
  DATE_START: 1
};

module.exports = {
  DEFAULT_COMMAND,
  USER_ARGV_INDEX,
  FilePath,
  DateOption,
  ExitCode,
  GeneratorSlicer,
  ArticleCount,
};
