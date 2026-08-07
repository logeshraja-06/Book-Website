const express = require('express');
const router = express.Router();
const { getBooks, getBookById } = require('../controllers/book.controller');
const { getReviewsByBookId } = require('../controllers/review.controller');

router.get('/', getBooks);
router.get('/:id', getBookById);
router.get('/:bookId/reviews', getReviewsByBookId);

module.exports = router;
