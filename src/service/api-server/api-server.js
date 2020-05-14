'use strict';

const chalk = require(`chalk`);
const express = require(`express`);
const apiRoutes = require(`../api`);
const {
  API_PREFIX,
  HttpCode,
  ExitCode
} = require(`../../constants`);

const app = express();
app.disable(`x-powered-by`);

app.use(express.json());
app.use(API_PREFIX, apiRoutes);

app.use((req, res) => {
  const notFoundMessageText = `Not found`;

  res.status(HttpCode.NOT_FOUND)
  .json({
    error: true,
    status: HttpCode.NOT_FOUND,
    message: notFoundMessageText
  });
});

const apiServerInit = (port) => {
  app.listen(port, (err) => {

    if (err) {
      console.error(chalk.red(`Ошибка при создании сервера`, err));
      process.exit(ExitCode.ERROR);
    }

    return console.info(chalk.green(`Ожидаю соединений на порту: ${port}`));
  });
};

module.exports = {apiServerInit};
