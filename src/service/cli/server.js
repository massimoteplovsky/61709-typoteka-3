'use strict';

const http = require(`http`);
const fs = require(`fs`).promises;
const chalk = require(`chalk`);

const {
  DefaultPort,
  FilePath,
  HttpCode,
  ExitCode
} = require(`../../constants`);

const sendResponse = (res, statusCode, content) => {
  const template = `
    <!Doctype html>
      <html lang="ru">
      <head>
        <title>With love from Node</title>
      </head>
      <body>${content}</body>
    </html>`.trim();

  res.writeHead(statusCode, {
    'Content-Type': `text/html; charset=UTF-8`,
  });

  res.end(template);
};

const onClientConnect = async (req, res) => {
  const notFoundMessageText = `Not found`;

  switch (req.url) {
    case `/`:
      try {
        const fileContent = await fs.readFile(FilePath.MOCKS);
        const mocks = JSON.parse(fileContent);
        const content = `
          <ul>
            ${mocks.map((post) => `<li>${post.title}</li>`).join(``)}
          </ul>`;
        sendResponse(res, HttpCode.SUCCESS, content);
      } catch (err) {
        sendResponse(res, HttpCode.NOT_FOUND, notFoundMessageText);
      }
      break;
    default:
      sendResponse(res, HttpCode.NOT_FOUND, notFoundMessageText);
      break;
  }

};

module.exports = {
  name: `--server`,
  run(customPort) {
    const port = Number.parseInt(customPort, 10) || DefaultPort.SERVICE_SERVER;

    http.createServer(onClientConnect)
      .listen(port)
      .on(`listening`, (err) => {
        if (err) {
          console.error(chalk.red(`Ошибка при создании сервера`, err));
          process.exit(ExitCode.ERROR);
        }

        console.info(chalk.green(`Ожидаю соединений на ${port}`));
      });
  }
};
