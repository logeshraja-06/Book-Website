const express = require('express');
const router = express.Router();
const { getBooks, getBookById, uploadBook } = require('../controllers/book.controller');
const { getReviewsByBookId } = require('../controllers/review.controller');
const { verifyToken } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');
const upload = require('../middleware/upload.middleware');

router.get('/', getBooks);
router.get('/:id', getBookById);
router.get('/:bookId/reviews', getReviewsByBookId);

router.post(
  '/upload',
  verifyToken,
  requireRole('publisher', 'admin'),
  upload.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'manuscriptFile', maxCount: 1 }
  ]),
  uploadBook
);

module.exports = router;
