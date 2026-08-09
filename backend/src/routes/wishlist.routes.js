const express = require('express');
const router = express.Router();
const {
  getWishlist,
  toggleWishlist,
  addToWishlist,
  removeFromWishlist
} = require('../controllers/reader.controller');
const { verifyToken } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');

// All authenticated roles (reader, author, publisher, admin) get their independent wishlist
router.use(verifyToken);
router.use(requireRole('reader', 'author', 'publisher', 'admin'));

router.get('/', getWishlist);
router.post('/:bookId', toggleWishlist);
router.delete('/:bookId', removeFromWishlist);

module.exports = router;
