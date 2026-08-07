const express = require('express');
const router = express.Router();
const {
  getStats,
  getAdminBooks,
  getAdminAuthors,
  getAdminUsers,
  deleteUser,
  getAdminCategories,
  getAdminReports
} = require('../controllers/admin.controller');
const { verifyToken } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');

router.use(verifyToken);
router.use(requireRole('admin'));

router.get('/stats', getStats);
router.get('/books', getAdminBooks);
router.get('/authors', getAdminAuthors);
router.get('/users', getAdminUsers);
router.delete('/users/:id', deleteUser);
router.get('/categories', getAdminCategories);
router.get('/reports', getAdminReports);

module.exports = router;
