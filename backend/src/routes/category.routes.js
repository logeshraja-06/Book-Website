const express = require('express');
const router = express.Router();
const { getCategories, getCategoryBooksBySlug } = require('../controllers/category.controller');

router.get('/', getCategories);
router.get('/:slug/books', getCategoryBooksBySlug);

module.exports = router;
