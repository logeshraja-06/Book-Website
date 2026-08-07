const express = require('express');
const router = express.Router();
const { getReviewsByBookId } = require('../controllers/review.controller');

router.get('/book/:bookId', getReviewsByBookId);

module.exports = router;
