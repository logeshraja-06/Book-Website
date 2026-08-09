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
  getBookmarksForBook,
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
router.get('/my-shelf', getLibrary);
router.post('/library/:bookId', toggleLibrary);

router.post('/purchase', purchaseBook);
router.post('/progress', saveReadingProgress);
router.get('/progress/:bookId', getReadingProgress);
router.get('/books/:bookId/progress', getReadingProgress);
router.put('/books/:bookId/progress', saveReadingProgress);
router.post('/books/:bookId/progress', saveReadingProgress);

router.get('/wishlist', getWishlist);
router.post('/wishlist/:bookId', toggleWishlist);
router.delete('/wishlist/:bookId', removeFromWishlist);

router.get('/bookmarks', getBookmarks);
router.get('/bookmarks/:bookId', getBookmarksForBook);
router.get('/books/:bookId/bookmarks', getBookmarksForBook);
router.post('/bookmarks', addBookmark);
router.post('/books/:bookId/bookmarks', addBookmark);
router.delete('/bookmarks/:id', deleteBookmark);
router.delete('/books/:bookId/bookmarks/:pageNumber', deleteBookmark);

router.get('/books/:bookId/pdf', getProtectedBookPdf);

router.get('/reviews', getUserReviews);
router.post('/reviews', createReview);
router.delete('/reviews/:id', deleteReview);

router.put('/profile', updateProfile);

module.exports = router;
