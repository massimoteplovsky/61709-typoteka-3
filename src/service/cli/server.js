'use strict';

const {
  DefaultPort,
  ExitCode
} = require(`../../constants`);
const {getServer} = require(`../api-server`);
const {getLogger} = require(`../logger`);

module.exports = {
  name: `--server`,
  async run(customPort) {
    const port = Number.parseInt(customPort, 10) || DefaultPort.SERVICE_SERVER;
    const server = await getServer();
    const logger = getLogger();

    server.listen(port, (err) => {

      if (err) {
        logger.error(`Server error`, err);
        process.exit(ExitCode.ERROR);
      }

      return logger.info(`Server is running on port: ${port}`);
    });
  }
};
