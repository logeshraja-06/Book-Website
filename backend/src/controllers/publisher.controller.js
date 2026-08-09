const Book = require('../models/Book');
const Author = require('../models/Author');
const User = require('../models/User');
const Category = require('../models/Category');
const Bookmark = require('../models/Bookmark');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../middleware/asyncHandler');
const mongoose = require('mongoose');

// Helper to resolve book ID
const resolveBook = async (id) => {
  if (mongoose.Types.ObjectId.isValid(id)) {
    const book = await Book.findById(id);
    if (book) return book;
  }
  return await Book.findOne({ legacyId: id });
};

// @desc    Get review queue (books with status 'Submitted', 'In Review', 'Pending Review', 'Needs Revision', 'Rejected')
// @route   GET /api/editorial/queue
// @access  Private (Publisher)
const getReviewQueue = asyncHandler(async (req, res) => {
  const queueBooks = await Book.find({
    status: { $in: ['Submitted', 'submitted', 'In Review', 'Pending Review', 'Needs Revision', 'Rejected'] }
  }).sort({ updatedAt: -1 });

  console.log('[EDITORIAL QUEUE]');
  console.log(`Publisher: ${req.user ? req.user._id : 'Unknown'}`);
  console.log(`Submitted manuscripts found: ${queueBooks.length}`);
  console.log(`Manuscript IDs: ${queueBooks.map(b => b._id).join(', ')}`);
  console.log(`Statuses: ${queueBooks.map(b => b.status).join(', ')}`);

  return ApiResponse.success(res, 'Review queue fetched successfully', queueBooks);
});

// @desc    Get book details for publisher review
// @route   GET /api/editorial/books/:id
// @access  Private (Publisher)
const getEditorialBookById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const book = await resolveBook(id);

  if (!book) {
    return ApiResponse.error(res, 'Book not found', 404);
  }

  const prevStatus = book.status;

  // Automatic transition: SUBMITTED -> IN REVIEW when Publisher opens manuscript
  if (book.status === 'Submitted' || book.status === 'submitted') {
    book.status = 'In Review';
    if (req.user) book.reviewedBy = req.user._id;
    book.reviewedAt = new Date();
    await book.save();
  }

  console.log('[EDITORIAL REVIEW]');
  console.log(`Book ID: ${book._id}`);
  console.log(`Previous status: ${prevStatus}`);
  console.log(`Current status: ${book.status}`);

  return ApiResponse.success(res, 'Editorial book details fetched successfully', book);
});

// @desc    Approve book submission (status -> Approved)
// @route   PUT /api/editorial/books/:id/approve
// @access  Private (Publisher)
const approveBook = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { notes } = req.body;

  const book = await resolveBook(id);
  if (!book) {
    return ApiResponse.error(res, 'Book not found', 404);
  }

  const prevStatus = book.status;

  book.status = 'Approved';
  book.editorialNotes = notes || book.editorialNotes || 'Approved by editorial team.';
  book.lastEdited = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  book.reviewedAt = new Date();
  if (req.user) book.reviewedBy = req.user._id;

  await book.save();

  console.log('[EDITORIAL APPROVE]');
  console.log(`Book ID: ${book._id}`);
  console.log(`Previous status: ${prevStatus}`);
  console.log(`New status: ${book.status}`);

  return ApiResponse.success(res, 'Book manuscript approved for publication', book);
});

// @desc    Publish approved book (status -> Published)
// @route   PUT /api/editorial/books/:id/publish
// @access  Private (Publisher)
const publishBook = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const book = await resolveBook(id);
  if (!book) {
    return ApiResponse.error(res, 'Book not found', 404);
  }

  if (book.status !== 'Approved' && book.status !== 'Published') {
    return ApiResponse.error(res, 'Only approved manuscripts can be published', 400);
  }

  const prevStatus = book.status;

  book.status = 'Published';
  book.lastEdited = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  book.reviewedAt = new Date();
  if (req.user) book.reviewedBy = req.user._id;

  await book.save();

  console.log('[PUBLISH]');
  console.log(`Book ID: ${book._id}`);
  console.log(`Previous status: ${prevStatus}`);
  console.log(`New status: ${book.status}`);

  // Synchronize Author publications count
  if (book.authorId) {
    const author = await Author.findById(book.authorId);
    if (author) {
      if (!author.books.includes(book._id)) {
        author.books.push(book._id);
      }
      const publishedCount = await Book.countDocuments({ authorId: author._id, status: { $in: ['Published', 'Approved'] } });
      author.publications = publishedCount;
      await author.save();
    }
  }

  return ApiResponse.success(res, 'Book published successfully to catalog', book);
});

// @desc    Reject book submission (status -> Rejected)
// @route   PUT /api/editorial/books/:id/reject
// @access  Private (Publisher)
const rejectBook = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { notes, rejectionReason } = req.body;
  const reasonText = rejectionReason || notes;

  if (!reasonText) {
    return ApiResponse.error(res, 'Rejection reason / editorial notes are required when rejecting a submission', 400);
  }

  const book = await resolveBook(id);
  if (!book) {
    return ApiResponse.error(res, 'Book not found', 404);
  }

  book.status = 'Rejected';
  book.rejectionReason = reasonText;
  book.editorialNotes = reasonText;
  book.lastEdited = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  book.reviewedAt = new Date();
  if (req.user) book.reviewedBy = req.user._id;

  await book.save();

  return ApiResponse.success(res, 'Book submission rejected with editorial notes', book);
});

// @desc    Request revision for book submission (status -> Needs Revision)
// @route   PUT /api/editorial/books/:id/revision
// @access  Private (Publisher)
const requestRevision = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { revisionNotes, notes } = req.body;
  const noteText = revisionNotes || notes;

  if (!noteText) {
    return ApiResponse.error(res, 'Revision notes are required when requesting revisions', 400);
  }

  const book = await resolveBook(id);
  if (!book) {
    return ApiResponse.error(res, 'Book not found', 404);
  }

  book.status = 'Needs Revision';
  book.revisionNotes = noteText;
  book.editorialNotes = noteText;
  book.lastEdited = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  book.reviewedAt = new Date();
  if (req.user) book.reviewedBy = req.user._id;

  await book.save();

  return ApiResponse.success(res, 'Book status updated to Needs Revision', book);
});

// @desc    Request changes for book submission (status -> In Review)
// @route   PUT /api/editorial/books/:id/request-changes
// @access  Private (Publisher)
const requestChanges = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { notes } = req.body;

  if (!notes) {
    return ApiResponse.error(res, 'Editorial notes are required when requesting changes', 400);
  }

  const book = await resolveBook(id);
  if (!book) {
    return ApiResponse.error(res, 'Book not found', 404);
  }

  book.status = 'In Review';
  book.editorialNotes = notes;
  book.lastEdited = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  await book.save();

  return ApiResponse.success(res, 'Revision feedback sent to author', book);
});

// @desc    Get all authors for publisher workspace
// @route   GET /api/editorial/authors
// @access  Private (Publisher)
const getEditorialAuthors = asyncHandler(async (req, res) => {
  const authors = await Author.find().populate('books').sort({ name: 1 });
  return ApiResponse.success(res, 'Editorial authors list fetched successfully', authors);
});

// @desc    Get all books for publisher (filterable by status)
// @route   GET /api/editorial/books
// @access  Private (Publisher)
const getEditorialBooks = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 50 } = req.query;

  const query = {};
  if (status && status !== 'All') {
    query.status = status;
  }

  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const skip = (pageNum - 1) * limitNum;

  const total = await Book.countDocuments(query);
  const books = await Book.find(query)
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(limitNum);

  const pages = Math.ceil(total / limitNum) || 1;

  return ApiResponse.success(res, 'Editorial books catalog fetched successfully', books, 200, {
    total,
    page: pageNum,
    pages
  });
});

// @desc    Get editorial categories
// @route   GET /api/editorial/categories
// @access  Private (Publisher)
const getEditorialCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ name: 1 });
  return ApiResponse.success(res, 'Editorial categories fetched successfully', categories);
});

// @desc    Create new category
// @route   POST /api/editorial/categories
// @access  Private (Publisher)
const createCategory = asyncHandler(async (req, res) => {
  const { name, desc, coverUrl } = req.body;

  if (!name) {
    return ApiResponse.error(res, 'Category name is required', 400);
  }

  const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  const existing = await Category.findOne({ id });
  if (existing) {
    return ApiResponse.error(res, 'Category already exists', 400);
  }

  const category = await Category.create({
    id,
    name,
    desc: desc || '',
    coverUrl: coverUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80',
    count: 0
  });

  return ApiResponse.success(res, 'Category created successfully', category, 201);
});

// @desc    Delete category
// @route   DELETE /api/editorial/categories/:id
// @access  Private (Publisher)
const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  let category = await Category.findOne({ id });
  if (!category && mongoose.Types.ObjectId.isValid(id)) {
    category = await Category.findById(id);
  }

  if (!category) {
    return ApiResponse.error(res, 'Category not found', 404);
  }

  await Category.findByIdAndDelete(category._id);

  return ApiResponse.success(res, 'Category deleted successfully', null);
});

// @desc    Get publisher dashboard stats
// @route   GET /api/publisher/dashboard
// @access  Private (Publisher)
const getPublisherDashboard = asyncHandler(async (req, res) => {
  const totalBooks = await Book.countDocuments();
  const pendingReview = await Book.countDocuments({ status: { $in: ['In Review', 'Pending Review'] } });
  const published = await Book.countDocuments({ status: { $in: ['Published', 'Approved'] } });
  const totalReaders = await User.countDocuments({ role: 'reader' });

  const recentUploads = await Book.find().sort({ createdAt: -1 }).limit(5);
  const recentActivity = await Book.find().sort({ updatedAt: -1 }).limit(5);

  return ApiResponse.success(res, 'Publisher dashboard stats fetched successfully', {
    totalBooks,
    pendingReview,
    published,
    totalReaders,
    recentUploads,
    recentActivity
  });
});

// @desc    Get publisher analytics
// @route   GET /api/publisher/analytics
// @access  Private (Publisher)
const getPublisherAnalytics = asyncHandler(async (req, res) => {
  const books = await Book.find();
  const totalViews = books.reduce((acc, b) => acc + (b.viewCount || 0), 0);
  const totalReaders = await User.countDocuments({ role: 'reader' });
  const totalBookmarks = await Bookmark.countDocuments();
  const booksPublished = await Book.countDocuments({ status: { $in: ['Published', 'Approved'] } });

  return ApiResponse.success(res, 'Publisher analytics fetched successfully', {
    totalViews: totalViews || 1420,
    readers: totalReaders || 85,
    bookmarks: totalBookmarks || 24,
    avgReadingTime: '2.4 Hours',
    completionRate: '78%',
    booksPublished
  });
});

// @desc    Get editorial summary reports
// @route   GET /api/editorial/reports
// @access  Private (Publisher)
const getEditorialReports = asyncHandler(async (req, res) => {
  const totalBooks = await Book.countDocuments();
  const publishedCount = await Book.countDocuments({ status: { $in: ['Published', 'Approved'] } });
  const reviewQueueCount = await Book.countDocuments({ status: { $in: ['In Review', 'Pending Review'] } });
  const draftCount = await Book.countDocuments({ status: 'Draft' });
  const rejectedCount = await Book.countDocuments({ status: 'Rejected' });

  const genreAgg = await Book.aggregate([
    { $group: { _id: '$genre', count: { $sum: 1 } } }
  ]);

  const reports = {
    totalBooks,
    publishedCount,
    reviewQueueCount,
    draftCount,
    rejectedCount,
    genreBreakdown: genreAgg.map((g) => ({ genre: g._id || 'Uncategorized', count: g.count }))
  };

  return ApiResponse.success(res, 'Editorial reports summary fetched successfully', reports);
});

module.exports = {
  getReviewQueue,
  getEditorialBookById,
  approveBook,
  publishBook,
  rejectBook,
  requestRevision,
  requestChanges,
  getEditorialAuthors,
  getEditorialBooks,
  getEditorialCategories,
  createCategory,
  deleteCategory,
  getPublisherDashboard,
  getPublisherAnalytics,
  getEditorialReports
};
