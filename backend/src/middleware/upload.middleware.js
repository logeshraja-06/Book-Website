const multer = require('multer');
const path = require('path');
const fs = require('fs');

const coversDir = path.join(__dirname, '../../uploads/covers');
const manuscriptsDir = path.join(__dirname, '../../uploads/manuscripts');

if (!fs.existsSync(coversDir)) fs.mkdirSync(coversDir, { recursive: true });
if (!fs.existsSync(manuscriptsDir)) fs.mkdirSync(manuscriptsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'coverImage' || file.fieldname === 'coverUrl') {
      cb(null, coversDir);
    } else if (file.fieldname === 'manuscriptFile') {
      cb(null, manuscriptsDir);
    } else {
      cb(null, coversDir);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'coverImage' || file.fieldname === 'coverUrl') {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = allowedTypes.test(file.mimetype);

    if (extName && mimeType) {
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
    fileSize: 25 * 1024 * 1024 // 25 MB max
  }
});

module.exports = upload;
