const express = require('express');
const router = express.Router();
const { getAuthors, getAuthorById } = require('../controllers/author.controller');

router.get('/', getAuthors);
router.get('/:id', getAuthorById);

module.exports = router;
