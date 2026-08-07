const express = require('express');
const router = express.Router();
const {
  getStudioBooks,
  createStudioBook,
  updateStudioBook,
  deleteStudioBook,
  submitStudioBook,
  getStudioAnalytics,
  updateStudioProfile
} = require('../controllers/author.controller');
const { verifyToken } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');
const upload = require('../middleware/upload.middleware');

router.use(verifyToken);
router.use(requireRole('author', 'publisher', 'admin'));

router.get('/books', getStudioBooks);
router.post(
  '/books',
  upload.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'manuscriptFile', maxCount: 1 }
  ]),
  createStudioBook
);
router.put(
  '/books/:id',
  upload.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'manuscriptFile', maxCount: 1 }
  ]),
  updateStudioBook
);
router.delete('/books/:id', deleteStudioBook);
router.post('/books/:id/submit', submitStudioBook);
router.get('/analytics', getStudioAnalytics);
router.put('/profile', updateStudioProfile);

module.exports = router;
