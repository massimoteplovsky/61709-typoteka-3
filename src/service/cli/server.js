'use strict';

const {DefaultPort} = require(`../../constants`);
const {apiServerInit} = require(`../api-server/api-server`);

module.exports = {
  name: `--server`,
  run(customPort) {
    const port = Number.parseInt(customPort, 10) || DefaultPort.SERVICE_SERVER;
    apiServerInit(port);
  }
};
