const express = require('express');
const router = express.Router();
const {
  getLibrary,
  toggleLibrary,
  purchaseBook,
  saveReadingProgress,
  getReadingProgress,
  getWishlist,
  toggleWishlist,
  removeFromWishlist,
  getBookmarks,
  addBookmark,
  deleteBookmark,
  createReview,
  getUserReviews,
  deleteReview,
  updateProfile,
  getProtectedBookPdf
} = require('../controllers/reader.controller');
const { verifyToken } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');

// All reader routes protected for authenticated users
router.use(verifyToken);
router.use(requireRole('reader', 'author', 'publisher', 'admin'));

router.get('/library', getLibrary);
router.post('/library/:bookId', toggleLibrary);

router.post('/purchase', purchaseBook);
router.post('/progress', saveReadingProgress);
router.get('/progress/:bookId', getReadingProgress);

router.get('/wishlist', getWishlist);
router.post('/wishlist/:bookId', toggleWishlist);
router.delete('/wishlist/:bookId', removeFromWishlist);

router.get('/bookmarks', getBookmarks);
router.post('/bookmarks', addBookmark);
router.delete('/bookmarks/:id', deleteBookmark);

router.get('/books/:bookId/pdf', getProtectedBookPdf);

router.get('/reviews', getUserReviews);
router.post('/reviews', createReview);
router.delete('/reviews/:id', deleteReview);

router.put('/profile', updateProfile);

module.exports = router;
