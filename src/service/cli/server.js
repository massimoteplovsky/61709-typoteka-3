'use strict';

const chalk = require(`chalk`);
const express = require(`express`);
const app = express();
const postsRouter = require(`./routes/postsRoutes`);

app.use(express.json());

const {
  DefaultPort,
  HttpCode,
  ExitCode
} = require(`../../constants`);

app.use(`/posts`, postsRouter);

app.use((req, res) => {
  const notFoundMessageText = `Not found`;
  res.status(HttpCode.NOT_FOUND)
  .send(notFoundMessageText);
});

module.exports = {
  name: `--server`,
  run(customPort) {
    const port = Number.parseInt(customPort, 10) || DefaultPort.SERVICE_SERVER;

    app.listen(port, (err) => {
      if (err) {
        console.error(chalk.red(`Ошибка при создании сервера`, err));
        process.exit(ExitCode.ERROR);
      }

      return console.info(chalk.green(`Ожидаю соединений на порту: ${port}`));
    });
  }
};
