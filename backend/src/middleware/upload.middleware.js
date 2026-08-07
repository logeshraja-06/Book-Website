const multer = require('multer');
const path = require('path');
const fs = require('fs');

const coversDir = path.join(__dirname, '../../uploads/covers');
const pdfsDir = path.join(__dirname, '../../uploads/pdfs');

if (!fs.existsSync(coversDir)) {
  fs.mkdirSync(coversDir, { recursive: true });
}
if (!fs.existsSync(pdfsDir)) {
  fs.mkdirSync(pdfsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'coverImage' || file.fieldname === 'coverUrl') {
      cb(null, coversDir);
    } else if (file.fieldname === 'manuscriptFile' || file.fieldname === 'pdfFile') {
      cb(null, pdfsDir);
    } else {
      cb(null, path.join(__dirname, '../../uploads'));
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

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
  } else if (file.fieldname === 'manuscriptFile' || file.fieldname === 'pdfFile') {
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
