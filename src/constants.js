'use strict';

const DEFAULT_COMMAND = `--help`;
const USER_ARGV_INDEX = 2;

const DefaultPort = {
  FRONT_SERVER: 8080,
  SERVICE_SERVER: 3000
};

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

const HttpCode = {
  SUCCESS: 200,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  FORBIDDEN: 403,
  UNAUTHORIZED: 401
};

module.exports = {
  DEFAULT_COMMAND,
  USER_ARGV_INDEX,
  DefaultPort,
  FilePath,
  DateOption,
  ExitCode,
  GeneratorSlicer,
  ArticleCount,
  HttpCode
};
