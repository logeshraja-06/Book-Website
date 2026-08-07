const Review = require('../models/Review');
const Book = require('../models/Book');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../middleware/asyncHandler');
const mongoose = require('mongoose');

// @desc    Get reviews for a specific book
// @route   GET /api/books/:bookId/reviews
// @access  Public
const getReviewsByBookId = asyncHandler(async (req, res) => {
  const { bookId } = req.params;

  let bookObjId = bookId;
  if (!mongoose.Types.ObjectId.isValid(bookId)) {
    const foundBook = await Book.findOne({ legacyId: bookId });
    if (foundBook) bookObjId = foundBook._id;
  }

  const reviews = await Review.find({ bookId: bookObjId }).sort({ createdAt: -1 });

  return ApiResponse.success(res, 'Reviews fetched successfully', reviews);
});

module.exports = {
  getReviewsByBookId
};
