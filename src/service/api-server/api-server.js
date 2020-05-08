'use strict';

const chalk = require(`chalk`);
const express = require(`express`);
const postsRouter = require(`../routes/postsRoutes`);

const {
  HttpCode,
  ExitCode
} = require(`../../constants`);

const app = express();

app.use(express.json());

app.use(`/posts`, postsRouter);

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
