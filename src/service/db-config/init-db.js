'use strict';

const {sequelize, initDB} = require(`./db`);

(async () => {
  await initDB();
  await sequelize.close();
})();
