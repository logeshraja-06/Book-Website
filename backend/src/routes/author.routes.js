const express = require('express');
const router = express.Router();
const { getAuthors, getAuthorBySlug } = require('../controllers/author.controller');

// Public author routes
router.get('/', getAuthors);
router.get('/:slug', getAuthorBySlug);

module.exports = router;
