const multer = require('multer');
const path = require('path');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'coverImage' || file.fieldname === 'coverUrl') {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = allowedTypes.test(file.mimetype);

    if (extName || mimeType) {
      cb(null, true);
    } else {
      cb(new Error('Only JPG, PNG, and WebP images are allowed for covers'), false);
    }
  } else if (file.fieldname === 'manuscriptFile') {
    const extName = path.extname(file.originalname).toLowerCase() === '.pdf';
    const mimeType = file.mimetype === 'application/pdf';

    if (extName || mimeType) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed for manuscripts'), false);
    }
  } else {
    cb(null, true);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 35 * 1024 * 1024 // 35 MB max
  }
});

module.exports = upload;
