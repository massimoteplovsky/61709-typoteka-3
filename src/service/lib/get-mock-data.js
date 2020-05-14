'use strict';

const chalk = require(`chalk`);
const {readContentJSON} = require(`../../utils`);
const {
  ExitCode,
  FilePath
} = require(`../../constants`);

const getMockData = async () => {

  let fileData = null;

  try {
    fileData = await readContentJSON(FilePath.MOCKS);
  } catch (err) {
    console.log(chalk.red(err));
    process.exit(ExitCode.ERROR);
  }

  return fileData;
};

module.exports = {getMockData};
