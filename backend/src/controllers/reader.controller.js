const path = require('path');
const fs = require('fs');
const User = require('../models/User');
const Book = require('../models/Book');
const Review = require('../models/Review');
const Bookmark = require('../models/Bookmark');
const Purchase = require('../models/Purchase');
const ReadingProgress = require('../models/ReadingProgress');
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

// @desc    Get user library with aggregated ReadingProgress and Bookmark counts
// @route   GET /api/reader/library or GET /api/reader/my-shelf
// @access  Private (Reader/Author/Publisher)
const getLibrary = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('library.bookId');

  const libraryWithProgress = await Promise.all(
    (user.library || []).filter((item) => item && item.bookId).map(async (item) => {
      const bObj = item.bookId;
      const targetBookId = bObj._id || bObj;

      // Query real ReadingProgress from MongoDB
      const progDoc = await ReadingProgress.findOne({ userId: req.user._id, bookId: targetBookId });

      // Query real Bookmarks count from MongoDB
      const bmCount = await Bookmark.countDocuments({ userId: req.user._id, bookId: targetBookId });

      const curPage = progDoc?.currentPage || item.currentPage || 1;
      const totPages = progDoc?.totalPages || item.totalPages || bObj.pages || 350;
      const progPct = progDoc?.progressPercent !== undefined ? progDoc.progressPercent : (item.progress !== undefined ? item.progress : Math.min(100, Math.round((curPage / totPages) * 100)));
      const statusStr = progPct >= 100 ? 'Completed' : (progDoc?.status || item.status || 'Currently Reading');
      const lastReadDate = progDoc?.lastReadAt || item.lastRead || item.updatedAt || item.createdAt || 'Recently';

      return {
        _id: item._id,
        bookId: bObj,
        currentPage: curPage,
        totalPages: totPages,
        progress: progPct,
        progressPercent: progPct,
        status: statusStr,
        lastReadAt: lastReadDate,
        bookmarksCount: bmCount
      };
    })
  );

  return ApiResponse.success(res, 'User library fetched successfully', libraryWithProgress);
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

// @desc    Purchase a book & add to library
// @route   POST /api/reader/purchase
// @access  Private
const purchaseBook = asyncHandler(async (req, res) => {
  const { bookId, price } = req.body;

  if (!bookId) {
    return ApiResponse.error(res, 'Book ID is required', 400);
  }

  const resolvedId = await resolveBookId(bookId);
  if (!resolvedId) {
    return ApiResponse.error(res, 'Book not found', 404);
  }

  const book = await Book.findById(resolvedId);

  // Check or create Purchase record
  let purchase = await Purchase.findOne({ userId: req.user._id, bookId: resolvedId });
  if (!purchase) {
    purchase = await Purchase.create({
      userId: req.user._id,
      bookId: resolvedId,
      price: price || book.price || 499,
      currency: book.currency || 'INR',
      status: 'completed'
    });
  }

  // Ensure book is in user's library
  const user = await User.findById(req.user._id);
  const existingItem = user.library.find(
    (item) => item.bookId && item.bookId.toString() === resolvedId.toString()
  );

  if (!existingItem) {
    user.library.push({
      bookId: resolvedId,
      progress: 0,
      currentPage: 1,
      totalPages: book.pages || 350,
      status: 'Currently Reading',
      lastRead: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    });
    await user.save();
  }

  const updatedUser = await User.findById(user._id).populate('library.bookId');

  return ApiResponse.success(res, 'Book purchased successfully', {
    purchase,
    library: updatedUser.library
  }, 201);
});

// @desc    Save reading progress and current page
// @route   POST /api/reader/progress or PUT /api/reader/books/:bookId/progress
// @access  Private
const saveReadingProgress = asyncHandler(async (req, res) => {
  const targetBookId = req.params.bookId || req.body.bookId;
  const currentPage = Number(req.body.currentPage) || 1;
  const totalPages = Number(req.body.totalPages) || 350;

  if (!targetBookId) {
    return ApiResponse.error(res, 'Book ID is required', 400);
  }

  const resolvedId = await resolveBookId(targetBookId);
  if (!resolvedId) {
    return ApiResponse.error(res, 'Book not found', 404);
  }

  const pagesCount = totalPages || 350;
  const progressPercent = Math.min(100, Math.round((currentPage / pagesCount) * 100));

  const progressRecord = await ReadingProgress.findOneAndUpdate(
    { userId: req.user._id, bookId: resolvedId },
    {
      currentPage,
      totalPages: pagesCount,
      progressPercent,
      status: progressPercent >= 100 ? 'Completed' : 'Currently Reading',
      lastReadAt: new Date()
    },
    { new: true, upsert: true }
  );

  console.log('[PROGRESS SAVE]');
  console.log(`Reader ID: ${req.user._id}`);
  console.log(`Book ID: ${resolvedId}`);
  console.log(`Current page: ${currentPage}`);
  console.log(`Percentage: ${progressPercent}`);

  // Sync to User library array
  const user = await User.findById(req.user._id);
  const libItem = user.library.find(
    (item) => item.bookId && item.bookId.toString() === resolvedId.toString()
  );

  if (libItem) {
    libItem.currentPage = currentPage;
    libItem.totalPages = pagesCount;
    libItem.progress = progressPercent;
    libItem.status = progressPercent >= 100 ? 'Completed' : 'Currently Reading';
    libItem.lastRead = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } else {
    user.library.push({
      bookId: resolvedId,
      currentPage,
      totalPages: pagesCount,
      progress: progressPercent,
      status: 'Currently Reading',
      lastRead: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    });
  }
  await user.save();

  return ApiResponse.success(res, 'Reading progress saved successfully', progressRecord);
});

// @desc    Get reading progress for a book
// @route   GET /api/reader/progress/:bookId or GET /api/reader/books/:bookId/progress
// @access  Private
const getReadingProgress = asyncHandler(async (req, res) => {
  const targetBookId = req.params.bookId;
  const resolvedId = await resolveBookId(targetBookId);

  if (!resolvedId) {
    return ApiResponse.error(res, 'Book not found', 404);
  }

  let progress = await ReadingProgress.findOne({ userId: req.user._id, bookId: resolvedId });
  if (!progress) {
    const user = await User.findById(req.user._id);
    const libItem = user.library.find(
      (item) => item.bookId && item.bookId.toString() === resolvedId.toString()
    );
    progress = {
      currentPage: libItem ? libItem.currentPage : 1,
      totalPages: libItem ? libItem.totalPages : 350,
      progressPercent: libItem ? libItem.progress : 0
    };
  }

  console.log('[PROGRESS LOAD]');
  console.log(`Reader ID: ${req.user._id}`);
  console.log(`Book ID: ${resolvedId}`);
  console.log(`Saved page: ${progress.currentPage || 1}`);

  return ApiResponse.success(res, 'Reading progress fetched successfully', progress);
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

// @desc    Add book to wishlist (Explicit POST)
// @route   POST /api/wishlist/:bookId or POST /api/reader/wishlist/:bookId/add
// @access  Private
const addToWishlist = asyncHandler(async (req, res) => {
  const { bookId } = req.params;
  const resolvedId = await resolveBookId(bookId);

  if (!resolvedId) {
    return ApiResponse.error(res, 'Book not found', 404);
  }

  const user = await User.findById(req.user._id);
  const exists = user.wishlistBookIds.some((id) => id.toString() === resolvedId.toString());

  if (!exists) {
    user.wishlistBookIds.push(resolvedId);
    await user.save();
  }

  const updatedUser = await User.findById(user._id).populate('wishlistBookIds');
  return ApiResponse.success(res, 'Book added to wishlist successfully', updatedUser.wishlistBookIds);
});

// @desc    Remove book from wishlist (Explicit DELETE)
// @route   DELETE /api/wishlist/:bookId
// @access  Private
const removeFromWishlist = asyncHandler(async (req, res) => {
  const { bookId } = req.params;
  const resolvedId = await resolveBookId(bookId);

  if (!resolvedId) {
    return ApiResponse.error(res, 'Book not found', 404);
  }

  const user = await User.findById(req.user._id);
  const index = user.wishlistBookIds.findIndex((id) => id.toString() === resolvedId.toString());

  if (index > -1) {
    user.wishlistBookIds.splice(index, 1);
    await user.save();
  }

  const updatedUser = await User.findById(user._id).populate('wishlistBookIds');
  return ApiResponse.success(res, 'Book removed from wishlist successfully', updatedUser.wishlistBookIds);
});

// @desc    Get user bookmarks
// @route   GET /api/reader/bookmarks
// @access  Private
const getBookmarks = asyncHandler(async (req, res) => {
  const bookmarks = await Bookmark.find({ userId: req.user._id }).populate('bookId');
  return ApiResponse.success(res, 'Bookmarks fetched successfully', bookmarks);
});

// @desc    Get bookmarks for a specific book
// @route   GET /api/reader/books/:bookId/bookmarks or GET /api/reader/bookmarks/:bookId
// @access  Private
const getBookmarksForBook = asyncHandler(async (req, res) => {
  const targetBookId = req.params.bookId;
  const resolvedId = await resolveBookId(targetBookId);

  if (!resolvedId) {
    return ApiResponse.error(res, 'Book not found', 404);
  }

  const bookmarks = await Bookmark.find({ userId: req.user._id, bookId: resolvedId }).sort({ pageNumber: 1 });
  return ApiResponse.success(res, 'Book bookmarks fetched successfully', bookmarks);
});

// @desc    Add a bookmark (upsert by user, book, pageNumber)
// @route   POST /api/reader/bookmarks or POST /api/reader/books/:bookId/bookmarks
// @access  Private
const addBookmark = asyncHandler(async (req, res) => {
  const targetBookId = req.params.bookId || req.body.bookId;
  const pageNum = Number(req.body.pageNumber) || 1;
  const { pageRef, chapterTitle, quote, note } = req.body;

  if (!targetBookId) {
    return ApiResponse.error(res, 'Book ID is required', 400);
  }

  const resolvedId = await resolveBookId(targetBookId);
  if (!resolvedId) {
    return ApiResponse.error(res, 'Book not found', 404);
  }

  const bookmark = await Bookmark.findOneAndUpdate(
    { userId: req.user._id, bookId: resolvedId, pageNumber: pageNum },
    {
      pageNumber: pageNum,
      pageRef: pageRef || `Page ${pageNum}`,
      chapterTitle: chapterTitle || '',
      quote: quote || '',
      note: note || '',
      dateSaved: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    },
    { new: true, upsert: true }
  );

  return ApiResponse.success(res, 'Bookmark saved successfully', bookmark, 201);
});

// @desc    Delete a bookmark (by id or by bookId + pageNumber)
// @route   DELETE /api/reader/bookmarks/:id or DELETE /api/reader/books/:bookId/bookmarks/:pageNumber
// @access  Private
const deleteBookmark = asyncHandler(async (req, res) => {
  const { id, bookId, pageNumber } = req.params;

  if (bookId && pageNumber) {
    const resolvedId = await resolveBookId(bookId);
    await Bookmark.findOneAndDelete({
      userId: req.user._id,
      bookId: resolvedId,
      pageNumber: Number(pageNumber)
    });
  } else if (id) {
    if (mongoose.Types.ObjectId.isValid(id)) {
      await Bookmark.findOneAndDelete({ _id: id, userId: req.user._id });
    } else {
      await Bookmark.findOneAndDelete({ userId: req.user._id, pageNumber: Number(id) });
    }
  }

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

// @desc    Get protected book PDF download for purchased reader
// @route   GET /api/reader/books/:bookId/pdf
// @access  Private (Reader with Purchase / Author / Publisher / Admin)
const getProtectedBookPdf = asyncHandler(async (req, res) => {
  const { bookId } = req.params;
  const resolvedId = await resolveBookId(bookId);

  if (!resolvedId) {
    return ApiResponse.error(res, 'Book not found', 404);
  }

  const book = await Book.findById(resolvedId);
  if (!book) {
    return ApiResponse.error(res, 'Book not found', 404);
  }

  // Check purchase ownership for readers
  if (req.user.role === 'reader') {
    const purchase = await Purchase.findOne({ userId: req.user._id, bookId: resolvedId });
    if (!purchase) {
      return ApiResponse.error(res, 'Access denied: Purchase required to download PDF', 403);
    }
  }

  let pdfRel = book.pdfPath || book.manuscriptUrl;
  if (!pdfRel || !pdfRel.startsWith('/uploads/')) {
    pdfRel = '/uploads/pdfs/manuscriptFile-1786116816151-185900693.pdf';
  }

  const absPath = path.join(__dirname, '../../', pdfRel.startsWith('/') ? pdfRel : `/${pdfRel}`);
  if (!fs.existsSync(absPath)) {
    return ApiResponse.error(res, 'PDF file not found on server disk', 404);
  }

  const safeFilename = (book.title || 'manuscript').replace(/[^a-zA-Z0-9_-]/g, '_');
  res.set('Content-Type', 'application/pdf');
  res.set('Content-Disposition', `attachment; filename="${safeFilename}.pdf"`);
  return fs.createReadStream(absPath).pipe(res);
});

module.exports = {
  getLibrary,
  toggleLibrary,
  purchaseBook,
  saveReadingProgress,
  getReadingProgress,
  getWishlist,
  toggleWishlist,
  addToWishlist,
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
};
