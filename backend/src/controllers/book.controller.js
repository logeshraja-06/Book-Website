const Book = require('../models/Book');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../middleware/asyncHandler');
const mongoose = require('mongoose');

// @desc    Get published books with filter, search, sort & pagination
// @route   GET /api/books
// @access  Public
const getBooks = asyncHandler(async (req, res) => {
  const { genre, language, search, sort, page = 1, limit = 12 } = req.query;

  const query = { status: 'Published' };

  if (genre && genre !== 'All') {
    query.genre = genre;
  }

  if (language && language !== 'All') {
    query.language = { $regex: language, $options: 'i' };
  }

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { author: { $regex: search, $options: 'i' } },
      { genre: { $regex: search, $options: 'i' } },
      { synopsis: { $regex: search, $options: 'i' } }
    ];
  }

  let sortOptions = {};
  switch (sort) {
    case 'price-asc':
      sortOptions = { price: 1 };
      break;
    case 'price-desc':
      sortOptions = { price: -1 };
      break;
    case 'rating':
      sortOptions = { rating: -1 };
      break;
    case 'year':
      sortOptions = { publishYear: -1 };
      break;
    default:
      sortOptions = { createdAt: -1 };
      break;
  }

  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const skip = (pageNum - 1) * limitNum;

  const total = await Book.countDocuments(query);
  const books = await Book.find(query)
    .populate('authorId', 'name avatarUrl role handle')
    .sort(sortOptions)
    .skip(skip)
    .limit(limitNum);

  const pages = Math.ceil(total / limitNum) || 1;

  return ApiResponse.success(res, 'Published books fetched successfully', books, 200, {
    total,
    page: pageNum,
    pages
  });
});

// @desc    Get single book by ID or legacy ID
// @route   GET /api/books/:id
// @access  Public
const getBookById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  let book;
  if (mongoose.Types.ObjectId.isValid(id)) {
    book = await Book.findById(id).populate('authorId');
  }

  if (!book) {
    book = await Book.findOne({ legacyId: id }).populate('authorId');
  }

  if (!book) {
    return ApiResponse.error(res, 'Book not found', 404);
  }

  return ApiResponse.success(res, 'Book details fetched successfully', book);
});

module.exports = {
  getBooks,
  getBookById
};
