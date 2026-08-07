const express = require('express');
const router = express.Router();
const {
  getReviewQueue,
  getEditorialBookById,
  approveBook,
  rejectBook,
  requestChanges,
  getEditorialAuthors,
  getEditorialBooks,
  getEditorialCategories,
  createCategory,
  deleteCategory,
  getEditorialReports
} = require('../controllers/publisher.controller');
const { verifyToken } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');

router.use(verifyToken);
router.use(requireRole('publisher', 'admin'));

router.get('/queue', getReviewQueue);
router.get('/books/:id', getEditorialBookById);
router.put('/books/:id/approve', approveBook);
router.put('/books/:id/reject', rejectBook);
router.put('/books/:id/request-changes', requestChanges);

router.get('/authors', getEditorialAuthors);
router.get('/books', getEditorialBooks);

router.get('/categories', getEditorialCategories);
router.post('/categories', createCategory);
router.delete('/categories/:id', deleteCategory);

router.get('/reports', getEditorialReports);

module.exports = router;
