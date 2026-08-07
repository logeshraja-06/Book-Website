const express = require('express');
const router = express.Router();
const {
  register,
  registerReader,
  registerAuthor,
  login,
  logout,
  getMe
} = require('../controllers/auth.controller');
const { verifyToken } = require('../middleware/auth.middleware');

router.post('/register', register);
router.post('/register/reader', registerReader);
router.post('/register/author', registerAuthor);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', verifyToken, getMe);

module.exports = router;
