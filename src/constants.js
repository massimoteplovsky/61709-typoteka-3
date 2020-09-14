'use strict';

const DEFAULT_COMMAND = `--help`;
const USER_ARGV_INDEX = 2;
const PUBLIC_DIR = `public`;
const MAX_ID_LENGTH = 6;
const MAX_COMMENTS_COUNT = 4;
const API_PREFIX = `/api`;

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
  CATEGORIES: `./data/categories.txt`,
  COMMENTS: `./data/comments.txt`
};

const DateOption = {
  MONTH_START: 2,
  DATE_START: 1
};

const HttpCode = {
  SUCCESS: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  UNAUTHORIZED: 401
};

const UserRole = {
  READER: `reader`,
  ADMIN: `admin`
};

const RouteProtectionType = {
  FULL: `full`,
  SEMI: `semi`
};

module.exports = {
  DEFAULT_COMMAND,
  USER_ARGV_INDEX,
  PUBLIC_DIR,
  MAX_ID_LENGTH,
  MAX_COMMENTS_COUNT,
  API_PREFIX,
  UserRole,
  DefaultPort,
  FilePath,
  DateOption,
  ExitCode,
  GeneratorSlicer,
  ArticleCount,
  HttpCode,
  RouteProtectionType
};
