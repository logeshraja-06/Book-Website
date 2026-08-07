const Author = require('../models/Author');
const Book = require('../models/Book');
const User = require('../models/User');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../middleware/asyncHandler');
const { uploadToGridFS } = require('../config/gridfs');
const mongoose = require('mongoose');

// Helper to get or create Author profile for current user
const getOrCreateAuthorProfile = async (user) => {
  let author = await Author.findOne({ userId: user._id });
  if (!author) {
    author = await Author.findOne({ name: user.name });
  }
  if (!author) {
    author = await Author.create({
      name: user.name,
      userId: user._id,
      role: 'Verified Studio Author',
      bio: user.bio || 'BookVerse Author',
      handle: user.handle || `@${user.name.toLowerCase().replace(/\s+/g, '')}`,
      joinDate: `Since ${new Date().getFullYear()}`,
      joinedYear: new Date().getFullYear()
    });
  } else if (!author.userId) {
    author.userId = user._id;
    await author.save();
  }
  return author;
};

// ─── PUBLIC AUTHOR ENDPOINTS ──────────────────────────────────────────────

// @desc    Get all authors with pagination and search
// @route   GET /api/authors
// @access  Public
const getAuthors = asyncHandler(async (req, res) => {
  const { search, page = 1, limit = 20 } = req.query;

  const query = {};
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { role: { $regex: search, $options: 'i' } },
      { bio: { $regex: search, $options: 'i' } }
    ];
  }

  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const skip = (pageNum - 1) * limitNum;

  const total = await Author.countDocuments(query);
  const authors = await Author.find(query)
    .populate('books')
    .sort({ name: 1 })
    .skip(skip)
    .limit(limitNum);

  const pages = Math.ceil(total / limitNum) || 1;

  return ApiResponse.success(res, 'Authors fetched successfully', authors, 200, {
    total,
    page: pageNum,
    pages
  });
});

// @desc    Get single author by ID or legacy ID
// @route   GET /api/authors/:id
// @access  Public
const getAuthorById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  let author;
  if (mongoose.Types.ObjectId.isValid(id)) {
    author = await Author.findById(id).populate('books');
  }

  if (!author) {
    author = await Author.findOne({ legacyId: id }).populate('books');
  }

  if (!author) {
    return ApiResponse.error(res, 'Author not found', 404);
  }

  const authorBooks = await Book.find({ authorId: author._id });
  const authorData = author.toObject();
  authorData.authorBooks = authorBooks;

  return ApiResponse.success(res, 'Author profile fetched successfully', authorData);
});

// ─── WRITING STUDIO (AUTHOR MODULE) ENDPOINTS ──────────────────────────────

// @desc    Get current author's books
// @route   GET /api/studio/books
// @access  Private (Author)
const getStudioBooks = asyncHandler(async (req, res) => {
  const authorProfile = await getOrCreateAuthorProfile(req.user);

  const books = await Book.find({ authorId: authorProfile._id }).sort({ updatedAt: -1 });

  return ApiResponse.success(res, 'Author books fetched successfully', books);
});

// @desc    Create new book draft in Writing Studio (GridFS upload)
// @route   POST /api/studio/books
// @access  Private (Author)
const createStudioBook = asyncHandler(async (req, res) => {
  const authorProfile = await getOrCreateAuthorProfile(req.user);

  const { title, subtitle, genre, language, price, synopsis, tagline, status } = req.body;

  if (!title) {
    return ApiResponse.error(res, 'Book title is required', 400);
  }

  let coverUrl = req.body.coverUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80';
  let coverFileId = null;

  // Handle Cover Image Upload to GridFS
  if (req.files && req.files.coverImage && req.files.coverImage[0]) {
    const file = req.files.coverImage[0];
    const gridRes = await uploadToGridFS('covers', file.originalname, file.buffer, file.mimetype);
    coverFileId = gridRes.fileId;
    coverUrl = `/api/files/cover/${gridRes.fileId}`;
  }

  let manuscriptFileId = null;
  let manuscriptFileName = req.body.manuscriptFileName || '';
  let manuscriptFileType = 'PDF Document';
  let manuscriptFileSize = '';
  let manuscriptUrl = req.body.manuscriptUrl || '';

  // Handle PDF Manuscript Upload to GridFS
  if (req.files && req.files.manuscriptFile && req.files.manuscriptFile[0]) {
    const file = req.files.manuscriptFile[0];
    const gridRes = await uploadToGridFS('manuscripts', file.originalname, file.buffer, file.mimetype);
    manuscriptFileId = gridRes.fileId;
    manuscriptFileName = file.originalname;
    manuscriptFileSize = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
    manuscriptUrl = `/api/files/manuscript/${gridRes.fileId}`;
  }

  const newBookStatus = status === 'In Review' || status === 'published' || status === 'Published' ? 'In Review' : 'Draft';

  const book = await Book.create({
    title,
    subtitle: subtitle || '',
    author: authorProfile.name,
    authorId: authorProfile._id,
    genre: genre || 'Historical Fiction',
    language: language || 'Tamil / English',
    price: Number(price) || 499,
    synopsis: synopsis || '',
    tagline: tagline || '',
    coverUrl,
    coverFileId,
    status: newBookStatus,
    submittedDate: newBookStatus === 'In Review' ? new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—',
    lastEdited: 'Just now',
    manuscriptFileId,
    manuscriptFileName,
    manuscriptFileType,
    manuscriptFileSize,
    manuscriptUrl,
    draftProgress: newBookStatus === 'Draft' ? '30% Completed' : ''
  });

  // Link book to Author profile
  authorProfile.books.push(book._id);
  authorProfile.publications = (authorProfile.publications || 0) + 1;
  await authorProfile.save();

  return ApiResponse.success(res, 'Book created in Writing Studio successfully', book, 201);
});

// @desc    Edit author book metadata/files (GridFS updates allowed if status is Draft or In Review)
// @route   PUT /api/studio/books/:id
// @access  Private (Author)
const updateStudioBook = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const authorProfile = await getOrCreateAuthorProfile(req.user);

  let book;
  if (mongoose.Types.ObjectId.isValid(id)) {
    book = await Book.findById(id);
  }
  if (!book) {
    book = await Book.findOne({ legacyId: id });
  }

  if (!book) {
    return ApiResponse.error(res, 'Book not found', 404);
  }

  // Ensure author owns book
  if (book.authorId.toString() !== authorProfile._id.toString()) {
    return ApiResponse.error(res, 'You are not authorized to edit this book', 403);
  }

  const { title, subtitle, genre, language, price, synopsis, tagline, coverUrl, status } = req.body;

  if (title) book.title = title;
  if (subtitle !== undefined) book.subtitle = subtitle;
  if (genre) book.genre = genre;
  if (language) book.language = language;
  if (price !== undefined) book.price = Number(price);
  if (synopsis !== undefined) book.synopsis = synopsis;
  if (tagline !== undefined) book.tagline = tagline;
  if (coverUrl) book.coverUrl = coverUrl;
  if (status && (status === 'Draft' || status === 'In Review')) book.status = status;

  // Handle Cover Image Upload to GridFS
  if (req.files && req.files.coverImage && req.files.coverImage[0]) {
    const file = req.files.coverImage[0];
    const gridRes = await uploadToGridFS('covers', file.originalname, file.buffer, file.mimetype);
    book.coverFileId = gridRes.fileId;
    book.coverUrl = `/api/files/cover/${gridRes.fileId}`;
  }

  // Handle PDF Manuscript Upload to GridFS
  if (req.files && req.files.manuscriptFile && req.files.manuscriptFile[0]) {
    const file = req.files.manuscriptFile[0];
    const gridRes = await uploadToGridFS('manuscripts', file.originalname, file.buffer, file.mimetype);
    book.manuscriptFileId = gridRes.fileId;
    book.manuscriptFileName = file.originalname;
    book.manuscriptFileSize = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
    book.manuscriptUrl = `/api/files/manuscript/${gridRes.fileId}`;
  }

  book.lastEdited = 'Just now';
  await book.save();

  return ApiResponse.success(res, 'Book metadata updated successfully', book);
});

// @desc    Delete author book
// @route   DELETE /api/studio/books/:id
// @access  Private (Author)
const deleteStudioBook = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const authorProfile = await getOrCreateAuthorProfile(req.user);

  let book;
  if (mongoose.Types.ObjectId.isValid(id)) {
    book = await Book.findById(id);
  }
  if (!book) {
    book = await Book.findOne({ legacyId: id });
  }

  if (!book) {
    return ApiResponse.error(res, 'Book not found', 404);
  }

  if (book.authorId.toString() !== authorProfile._id.toString()) {
    return ApiResponse.error(res, 'You are not authorized to delete this book', 403);
  }

  await Book.findByIdAndDelete(book._id);

  // Remove from Author profile
  authorProfile.books = authorProfile.books.filter((bId) => bId.toString() !== book._id.toString());
  authorProfile.publications = Math.max(0, (authorProfile.publications || 1) - 1);
  await authorProfile.save();

  return ApiResponse.success(res, 'Book removed from catalog successfully', null);
});

// @desc    Submit draft book to Editorial Workspace (Draft -> In Review)
// @route   POST /api/studio/books/:id/submit
// @access  Private (Author)
const submitStudioBook = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const authorProfile = await getOrCreateAuthorProfile(req.user);

  let book;
  if (mongoose.Types.ObjectId.isValid(id)) {
    book = await Book.findById(id);
  }
  if (!book) {
    book = await Book.findOne({ legacyId: id });
  }

  if (!book) {
    return ApiResponse.error(res, 'Book not found', 404);
  }

  if (book.authorId.toString() !== authorProfile._id.toString()) {
    return ApiResponse.error(res, 'Not authorized to submit this book', 403);
  }

  book.status = 'In Review';
  book.submittedDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  book.lastEdited = 'Submitted just now';
  book.draftProgress = '';

  await book.save();

  return ApiResponse.success(res, 'Book submitted to Editorial Workspace for review', book);
});

// @desc    Get Writing Studio analytics
// @route   GET /api/studio/analytics
// @access  Private (Author)
const getStudioAnalytics = asyncHandler(async (req, res) => {
  const authorProfile = await getOrCreateAuthorProfile(req.user);
  const authorBooks = await Book.find({ authorId: authorProfile._id });

  const analytics = {
    totalBooks: authorBooks.length,
    totalReads: authorProfile.stats?.totalReads || '48.2k',
    avgRating: authorProfile.avgRating || '4.9 ★',
    completionRate: '84%',
    monthlyReads: [
      { month: 'Jan', reads: 3200 },
      { month: 'Feb', reads: 4100 },
      { month: 'Mar', reads: 5800 },
      { month: 'Apr', reads: 7200 },
      { month: 'May', reads: 8900 },
      { month: 'Jun', reads: 11400 },
      { month: 'Jul', reads: 12450 }
    ]
  };

  return ApiResponse.success(res, 'Studio analytics fetched successfully', analytics);
});

// @desc    Update author studio profile
// @route   PUT /api/studio/profile
// @access  Private (Author)
const updateStudioProfile = asyncHandler(async (req, res) => {
  const { name, bio, fullBio, role, avatarUrl, handle } = req.body;
  const authorProfile = await getOrCreateAuthorProfile(req.user);

  if (name) {
    authorProfile.name = name;
    req.user.name = name;
  }
  if (bio !== undefined) {
    authorProfile.bio = bio;
    req.user.bio = bio;
  }
  if (fullBio !== undefined) authorProfile.fullBio = fullBio;
  if (role) authorProfile.role = role;
  if (avatarUrl) {
    authorProfile.avatarUrl = avatarUrl;
    req.user.avatarUrl = avatarUrl;
  }
  if (handle) {
    authorProfile.handle = handle;
    req.user.handle = handle;
  }

  await authorProfile.save();
  await req.user.save();

  return ApiResponse.success(res, 'Author profile updated successfully', authorProfile);
});

module.exports = {
  getAuthors,
  getAuthorById,
  getStudioBooks,
  createStudioBook,
  updateStudioBook,
  deleteStudioBook,
  submitStudioBook,
  getStudioAnalytics,
  updateStudioProfile
};
