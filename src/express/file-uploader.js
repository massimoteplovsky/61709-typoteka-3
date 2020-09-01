'use strict';

const path = require(`path`);
const multer = require(`multer`);
const VALID_MIME_TYPES = [`image/png`, `image/jpg`, `image/jpeg`];
const MAX_FILE_SIZE = 15 * 1024 * 1024;

const storageConfig = multer.diskStorage({
  destination: (req, file, cb) =>{
    cb(null, path.resolve(__dirname, `../express/public`, `img`));
  },
  filename: (req, file, cb) =>{
    cb(null, `${Date.now()}_${file.originalname}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (VALID_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const fileUploader = multer({
  storage: storageConfig,
  fileFilter,
  limits: {fileSize: MAX_FILE_SIZE}
});

module.exports = {fileUploader, multer};
