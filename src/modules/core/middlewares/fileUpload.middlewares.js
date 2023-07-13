import formidable from 'express-formidable';

export const singleFileUpload = (fileSizeLimit = 10) => {
  const limit = fileSizeLimit * 1024 * 1024;

  return formidable({
    multiples: false,
    keepExtensions: true,
    maxFileSize: limit,
  });
};

export const multipleFileUpload = (fileSizeLimit = 10) => {
  const limit = fileSizeLimit * 1024 * 1024;

  return formidable({
    multiples: true,
    keepExtensions: true,
    maxFileSize: limit,
  });
};
