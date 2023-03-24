const formidable = require('express-formidable');

const singleFileUpload = (fileSizeLimit = 10) => {
  const limit = fileSizeLimit * 1024 * 1024;

  return formidable({
    multiples: false,
    keepExtensions: true,
    maxFileSize: limit,
  });
};

const multipleFileUpload = (fileSizeLimit = 10) => {
  const limit = fileSizeLimit * 1024 * 1024;

  return formidable({
    multiples: true,
    keepExtensions: true,
    maxFileSize: limit,
  });
};

module.exports = {
  singleFileUpload,
  multipleFileUpload,
};
