const User = require('../models/User');
const Book = require('../models/Book');
const Author = require('../models/Author');
const Category = require('../models/Category');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Get admin high-level stats
// @route   GET /api/admin/stats
// @access  Private (Admin)
const getStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalAuthors = await Author.countDocuments();
  const totalBooks = await Book.countDocuments();
  const publishedBooks = await Book.countDocuments({ status: 'Published' });
  const pendingReviews = await Book.countDocuments({ status: 'In Review' });

  const stats = {
    totalUsers,
    totalAuthors,
    totalBooks,
    publishedBooks,
    pendingReviews
  };

  return ApiResponse.success(res, 'Admin overview stats fetched successfully', stats);
});

// @desc    Get all books for admin
// @route   GET /api/admin/books
// @access  Private (Admin)
const getAdminBooks = asyncHandler(async (req, res) => {
  const books = await Book.find().populate('authorId').sort({ createdAt: -1 });
  return ApiResponse.success(res, 'Admin books list fetched successfully', books);
});

// @desc    Get all authors for admin
// @route   GET /api/admin/authors
// @access  Private (Admin)
const getAdminAuthors = asyncHandler(async (req, res) => {
  const authors = await Author.find().populate('books').sort({ createdAt: -1 });
  return ApiResponse.success(res, 'Admin authors list fetched successfully', authors);
});

// @desc    Get all users for admin
// @route   GET /api/admin/users
// @access  Private (Admin)
const getAdminUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 });
  return ApiResponse.success(res, 'Admin users list fetched successfully', users);
});

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id);
  if (!user) {
    return ApiResponse.error(res, 'User not found', 404);
  }

  // Prevent deleting self or root admin
  if (user._id.toString() === req.user._id.toString()) {
    return ApiResponse.error(res, 'Cannot delete your own admin account', 400);
  }

  await User.findByIdAndDelete(id);
  return ApiResponse.success(res, 'User account deleted successfully', null);
});

// @desc    Get admin categories
// @route   GET /api/admin/categories
// @access  Private (Admin)
const getAdminCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ name: 1 });
  return ApiResponse.success(res, 'Admin categories fetched successfully', categories);
});

// @desc    Get admin reports
// @route   GET /api/admin/reports
// @access  Private (Admin)
const getAdminReports = asyncHandler(async (req, res) => {
  const userRoleAgg = await User.aggregate([
    { $group: { _id: '$role', count: { $sum: 1 } } }
  ]);

  const bookStatusAgg = await Book.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ]);

  const reports = {
    usersByRole: userRoleAgg.map((r) => ({ role: r._id, count: r.count })),
    booksByStatus: bookStatusAgg.map((b) => ({ status: b._id, count: b.count }))
  };

  return ApiResponse.success(res, 'Admin reports fetched successfully', reports);
});

module.exports = {
  getStats,
  getAdminBooks,
  getAdminAuthors,
  getAdminUsers,
  deleteUser,
  getAdminCategories,
  getAdminReports
};
