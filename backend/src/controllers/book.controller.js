const Book = require('../models/Book');
const Author = require('../models/Author');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../middleware/asyncHandler');
const slugify = require('../utils/slugify');
const mongoose = require('mongoose');

// Helper to generate unique book slug
const generateUniqueBookSlug = async (title) => {
  let baseSlug = slugify(title) || 'book';
  let slug = baseSlug;
  let count = 2;
  while (await Book.findOne({ slug })) {
    slug = `${baseSlug}-${count}`;
    count++;
  }
  return slug;
};

// Helper to generate sequence bookCode and demo ISBN
const generateBookCodeAndIsbn = async () => {
  const count = await Book.countDocuments();
  const seq = String(count + 1).padStart(6, '0');
  const year = new Date().getFullYear();
  const bookCode = `BVS-${year}-${seq}`;
  const isbn = `978-81-${seq}${Math.floor(100 + Math.random() * 900)}`;
  return { bookCode, isbn };
};

// @desc    Get published books with filter, search, sort & pagination
// @route   GET /api/books
// @access  Public
const getBooks = asyncHandler(async (req, res) => {
  const { genre, language, search, sort, page = 1, limit = 50 } = req.query;

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
    case 'year-asc':
    case 'oldest':
      sortOptions = { publishYear: 1, createdAt: 1 };
      break;
    case 'year-desc':
    case 'newest':
      sortOptions = { publishYear: -1, createdAt: -1 };
      break;
    case 'alpha':
    case 'a-z':
      sortOptions = { title: 1 };
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

// @desc    Get single book by slug, ObjectId, or legacy ID
// @route   GET /api/books/:id
// @access  Public
const getBookById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  let book = await Book.findOne({ slug: id });

  if (!book && mongoose.Types.ObjectId.isValid(id)) {
    book = await Book.findById(id);
  }

  if (!book) {
    book = await Book.findOne({ legacyId: id });
  }

  if (!book) {
    return ApiResponse.error(res, 'Book not found', 404);
  }

  // Filter non-published books for public catalog access
  if (book.status !== 'Published') {
    if (!req.user || (req.user.role !== 'publisher' && req.user.role !== 'admin' && req.user.role !== 'author')) {
      return ApiResponse.error(res, 'Book not found or not published yet', 404);
    }
  }

  // Increment viewCount
  book.viewCount = (book.viewCount || 0) + 1;
  await book.save();

  return ApiResponse.success(res, 'Book details fetched successfully', book);
});

// @desc    Upload book (Publisher only)
// @route   POST /api/books/upload
// @access  Private (Publisher)
const uploadBook = asyncHandler(async (req, res) => {
  const { title, subtitle, author, genre, language, price, synopsis, tagline } = req.body;

  if (!title) {
    return ApiResponse.error(res, 'Book title is required', 400);
  }

  const authorName = (author || req.user.name || 'BookVerse Author').trim();
  const slug = await generateUniqueBookSlug(title);
  const { bookCode, isbn } = await generateBookCodeAndIsbn();

  // Find or create public Author profile record
  let authorRecord = await Author.findOne({ name: authorName });
  if (!authorRecord) {
    const authorSlug = slugify(authorName);
    authorRecord = await Author.create({
      name: authorName,
      slug: authorSlug,
      role: 'Featured Author',
      bio: `Author of ${title} and classic works published by BookVerse Studio.`,
      genres: genre ? [genre] : ['Fiction'],
      publications: 1
    });
  }

  let coverPath = '';
  let coverUrl = req.body.coverUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80';

  if (req.files && req.files.coverImage && req.files.coverImage[0]) {
    const file = req.files.coverImage[0];
    coverPath = `/uploads/covers/${file.filename}`;
    coverUrl = `/uploads/covers/${file.filename}`;
  }

  let pdfPath = '';
  let manuscriptFileName = req.body.manuscriptFileName || '';
  let manuscriptFileType = 'PDF Document';
  let manuscriptFileSize = '';
  let manuscriptUrl = req.body.manuscriptUrl || '';

  if (req.files && req.files.manuscriptFile && req.files.manuscriptFile[0]) {
    const file = req.files.manuscriptFile[0];
    pdfPath = `/uploads/pdfs/${file.filename}`;
    manuscriptFileName = file.originalname;
    manuscriptFileSize = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
    manuscriptUrl = `/uploads/pdfs/${file.filename}`;
  }

  const book = await Book.create({
    title,
    slug,
    bookCode,
    subtitle: subtitle || '',
    author: authorName,
    authorId: authorRecord._id,
    publisherId: req.user._id,
    genre: genre || 'General',
    language: language || 'English',
    price: Number(price) || 499,
    isbn,
    synopsis: synopsis || '',
    tagline: tagline || '',
    coverUrl,
    coverPath,
    pdfPath,
    status: 'Pending Review',
    submittedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    lastEdited: 'Just now',
    manuscriptFileName,
    manuscriptFileType,
    manuscriptFileSize,
    manuscriptUrl
  });

  // Link to author
  if (!authorRecord.books.includes(book._id)) {
    authorRecord.books.push(book._id);
    authorRecord.publications = (authorRecord.publications || 0) + 1;
    if (genre && !authorRecord.genres.includes(genre)) {
      authorRecord.genres.push(genre);
    }
    await authorRecord.save();
  }

  return ApiResponse.success(res, 'Book uploaded and queued for review', book, 201);
});

module.exports = {
  getBooks,
  getBookById,
  uploadBook,
  generateUniqueBookSlug,
  generateBookCodeAndIsbn
};
