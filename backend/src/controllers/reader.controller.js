const User = require('../models/User');
const Book = require('../models/Book');
const Review = require('../models/Review');
const Bookmark = require('../models/Bookmark');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../middleware/asyncHandler');
const mongoose = require('mongoose');

// Helper to resolve book ID (Mongo ObjectId or legacy String ID)
const resolveBookId = async (bookIdStr) => {
  if (mongoose.Types.ObjectId.isValid(bookIdStr)) {
    const book = await Book.findById(bookIdStr);
    if (book) return book._id;
  }
  const book = await Book.findOne({ legacyId: bookIdStr });
  return book ? book._id : null;
};

// @desc    Get user library
// @route   GET /api/reader/library
// @access  Private (Reader/Author/Publisher)
const getLibrary = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('library.bookId');
  return ApiResponse.success(res, 'User library fetched successfully', user.library || []);
});

// @desc    Toggle add/remove book in library (Idempotent)
// @route   POST /api/reader/library/:bookId
// @access  Private
const toggleLibrary = asyncHandler(async (req, res) => {
  const { bookId } = req.params;
  const resolvedId = await resolveBookId(bookId);

  if (!resolvedId) {
    return ApiResponse.error(res, 'Book not found', 404);
  }

  const user = await User.findById(req.user._id);

  const existingIndex = user.library.findIndex(
    (item) => item.bookId && item.bookId.toString() === resolvedId.toString()
  );

  let action = '';
  if (existingIndex > -1) {
    user.library.splice(existingIndex, 1);
    action = 'removed from';
  } else {
    const book = await Book.findById(resolvedId);
    user.library.push({
      bookId: resolvedId,
      progress: 0,
      currentPage: 1,
      totalPages: book ? book.pages : 300,
      status: 'Currently Reading',
      lastRead: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    });
    action = 'added to';
  }

  await user.save();
  const updatedUser = await User.findById(user._id).populate('library.bookId');

  return ApiResponse.success(
    res,
    `Book ${action} shelf successfully`,
    updatedUser.library
  );
});

// @desc    Get user wishlist
// @route   GET /api/reader/wishlist
// @access  Private
const getWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('wishlistBookIds');
  return ApiResponse.success(res, 'User wishlist fetched successfully', user.wishlistBookIds || []);
});

// @desc    Toggle add/remove book in wishlist (Idempotent)
// @route   POST /api/reader/wishlist/:bookId
// @access  Private
const toggleWishlist = asyncHandler(async (req, res) => {
  const { bookId } = req.params;
  const resolvedId = await resolveBookId(bookId);

  if (!resolvedId) {
    return ApiResponse.error(res, 'Book not found', 404);
  }

  const user = await User.findById(req.user._id);

  const index = user.wishlistBookIds.findIndex(
    (id) => id.toString() === resolvedId.toString()
  );

  let action = '';
  if (index > -1) {
    user.wishlistBookIds.splice(index, 1);
    action = 'removed from';
  } else {
    user.wishlistBookIds.push(resolvedId);
    action = 'added to';
  }

  await user.save();
  const updatedUser = await User.findById(user._id).populate('wishlistBookIds');

  return ApiResponse.success(
    res,
    `Book ${action} wishlist successfully`,
    updatedUser.wishlistBookIds
  );
});

// @desc    Get user bookmarks
// @route   GET /api/reader/bookmarks
// @access  Private
const getBookmarks = asyncHandler(async (req, res) => {
  const bookmarks = await Bookmark.find({ userId: req.user._id }).populate('bookId');
  return ApiResponse.success(res, 'Bookmarks fetched successfully', bookmarks);
});

// @desc    Add a bookmark
// @route   POST /api/reader/bookmarks
// @access  Private
const addBookmark = asyncHandler(async (req, res) => {
  const { bookId, pageRef, quote, note } = req.body;

  const resolvedId = await resolveBookId(bookId);
  if (!resolvedId) {
    return ApiResponse.error(res, 'Book not found', 404);
  }

  const newBookmark = await Bookmark.create({
    userId: req.user._id,
    bookId: resolvedId,
    pageRef: pageRef || 'Page 1',
    quote: quote || '',
    note: note || '',
    dateSaved: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  });

  const populated = await Bookmark.findById(newBookmark._id).populate('bookId');
  return ApiResponse.success(res, 'Bookmark saved successfully', populated, 201);
});

// @desc    Delete a bookmark
// @route   DELETE /api/reader/bookmarks/:id
// @access  Private
const deleteBookmark = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await Bookmark.findOneAndDelete({ _id: id, userId: req.user._id });
  const remaining = await Bookmark.find({ userId: req.user._id }).populate('bookId');

  return ApiResponse.success(res, 'Bookmark removed successfully', remaining);
});

// @desc    Create review for a book (Enforce 1 review per (user, book) pair)
// @route   POST /api/reader/reviews
// @access  Private
const createReview = asyncHandler(async (req, res) => {
  const { bookId, rating, text } = req.body;

  if (!bookId || !rating || !text) {
    return ApiResponse.error(res, 'BookId, rating, and review text are required', 400);
  }

  const resolvedId = await resolveBookId(bookId);
  if (!resolvedId) {
    return ApiResponse.error(res, 'Book not found', 404);
  }

  // Check if review already exists for this user and book
  const existingReview = await Review.findOne({ bookId: resolvedId, reviewerId: req.user._id });
  if (existingReview) {
    return ApiResponse.error(res, 'You have already submitted a review for this book', 400);
  }

  const review = await Review.create({
    bookId: resolvedId,
    reviewerId: req.user._id,
    reviewer: req.user.name,
    rating: Number(rating),
    text,
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  });

  // Update book rating stats
  const allBookReviews = await Review.find({ bookId: resolvedId });
  const avgRating = (
    allBookReviews.reduce((acc, curr) => acc + curr.rating, 0) / allBookReviews.length
  ).toFixed(1);

  await Book.findByIdAndUpdate(resolvedId, {
    rating: parseFloat(avgRating),
    reviewsCount: `${allBookReviews.length}`
  });

  return ApiResponse.success(res, 'Review submitted successfully', review, 201);
});

// @desc    Get reviews written by current user
// @route   GET /api/reader/reviews
// @access  Private
const getUserReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ reviewerId: req.user._id }).populate('bookId');
  return ApiResponse.success(res, 'User reviews fetched successfully', reviews);
});

// @desc    Delete a review
// @route   DELETE /api/reader/reviews/:id
// @access  Private
const deleteReview = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const review = await Review.findById(id);
  if (!review) {
    return ApiResponse.error(res, 'Review not found', 404);
  }

  if (review.reviewerId && review.reviewerId.toString() !== req.user._id.toString()) {
    return ApiResponse.error(res, 'Not authorized to delete this review', 403);
  }

  const bookId = review.bookId;
  await Review.findByIdAndDelete(id);

  // Recalculate book stats
  const remainingReviews = await Review.find({ bookId });
  const count = remainingReviews.length;
  const avgRating = count > 0
    ? parseFloat((remainingReviews.reduce((acc, curr) => acc + curr.rating, 0) / count).toFixed(1))
    : 0;

  await Book.findByIdAndUpdate(bookId, {
    rating: avgRating,
    reviewsCount: `${count}`
  });

  return ApiResponse.success(res, 'Review deleted successfully', null);
});

// @desc    Update reader profile
// @route   PUT /api/reader/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const { name, bio, handle, avatarUrl } = req.body;

  const user = await User.findById(req.user._id);

  if (name) user.name = name;
  if (bio !== undefined) user.bio = bio;
  if (handle !== undefined) user.handle = handle;
  if (avatarUrl !== undefined) user.avatarUrl = avatarUrl;

  await user.save();

  return ApiResponse.success(res, 'Profile updated successfully', user);
});

module.exports = {
  getLibrary,
  toggleLibrary,
  getWishlist,
  toggleWishlist,
  getBookmarks,
  addBookmark,
  deleteBookmark,
  createReview,
  getUserReviews,
  deleteReview,
  updateProfile
};
