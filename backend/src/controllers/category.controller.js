const Category = require('../models/Category');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ count: -1 });
  return ApiResponse.success(res, 'Categories fetched successfully', categories);
});

module.exports = {
  getCategories
};
