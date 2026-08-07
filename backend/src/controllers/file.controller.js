const jwt = require('jsonwebtoken');
const env = require('../config/env');
const Book = require('../models/Book');
const Author = require('../models/Author');
const User = require('../models/User');
const { getGridFSFileStream } = require('../config/gridfs');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../middleware/asyncHandler');
const mongoose = require('mongoose');

// @desc    Get short-lived download token for manuscript viewing
// @route   GET /api/files/manuscript/:fileId/token
// @access  Private (Author/Publisher/Admin)
const getDownloadToken = asyncHandler(async (req, res) => {
  const { fileId } = req.params;

  if (!fileId || fileId === 'undefined' || fileId === 'null') {
    return ApiResponse.error(res, 'Valid manuscript file ID required', 400);
  }

  // Find book associated with this manuscript fileId or Mongo ObjectId
  const isObjId = mongoose.Types.ObjectId.isValid(fileId);
  let book = await Book.findOne({
    $or: [
      { manuscriptFileId: isObjId ? fileId : null },
      { _id: isObjId ? fileId : null },
      { legacyId: fileId }
    ].filter(cond => Object.values(cond)[0] !== null)
  });

  if (!book && isObjId) {
    book = await Book.findById(fileId);
  }

  if (!book) {
    return ApiResponse.error(res, 'Manuscript file record not found', 404);
  }

  const manuscriptId = book.manuscriptFileId ? book.manuscriptFileId.toString() : book._id.toString();

  // Create short-lived 5-minute download token
  const downloadToken = jwt.sign(
    {
      fileId: manuscriptId,
      bookId: book._id,
      userId: req.user._id,
      role: req.user.role,
      scope: 'manuscript_download'
    },
    env.JWT_SECRET,
    { expiresIn: '5m' }
  );

  return ApiResponse.success(res, 'Download token generated', {
    token: downloadToken,
    fileId: manuscriptId,
    downloadUrl: `/api/files/manuscript/${manuscriptId}?token=${downloadToken}`
  });
});

// @desc    Stream cover image from GridFS (Public access)
// @route   GET /api/files/cover/:fileId
// @access  Public
const streamCover = asyncHandler(async (req, res) => {
  const { fileId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(fileId)) {
    return ApiResponse.error(res, 'Invalid cover file ID', 400);
  }

  const result = await getGridFSFileStream('covers', fileId);
  if (!result) {
    return ApiResponse.error(res, 'Cover image not found in storage', 404);
  }

  const { fileDoc, downloadStream } = result;

  res.set('Content-Type', fileDoc.contentType || 'image/jpeg');
  res.set('Cache-Control', 'public, max-age=31536000, immutable');
  downloadStream.pipe(res);
});

// @desc    Stream manuscript PDF from GridFS
// @route   GET /api/files/manuscript/:fileId
// @access  Protected (via short-lived ?token= OR Bearer Authorization Header)
const streamManuscript = asyncHandler(async (req, res) => {
  const { fileId } = req.params;
  const tokenQuery = req.query.token;

  let authUser = req.user;

  // If token passed in query parameter, verify short-lived token
  if (!authUser && tokenQuery) {
    try {
      const decoded = jwt.verify(tokenQuery, env.JWT_SECRET);
      if (decoded.scope === 'manuscript_download' || decoded.id) {
        authUser = await User.findById(decoded.userId || decoded.id);
      }
    } catch (err) {
      return ApiResponse.error(res, 'Download link expired or invalid. Please refresh the page.', 401);
    }
  }

  if (!authUser) {
    return ApiResponse.error(res, 'Authentication required to access manuscript', 401);
  }

  if (!mongoose.Types.ObjectId.isValid(fileId)) {
    return ApiResponse.error(res, 'Invalid manuscript file ID', 400);
  }

  // Author authorization check
  if (authUser.role === 'author') {
    const authorProfile = await Author.findOne({ userId: authUser._id });
    const book = await Book.findOne({
      $or: [{ manuscriptFileId: fileId }, { _id: fileId }]
    });

    if (book && authorProfile && book.authorId.toString() !== authorProfile._id.toString()) {
      return ApiResponse.error(res, 'Not authorized to download this manuscript', 403);
    }
  } else if (authUser.role !== 'publisher' && authUser.role !== 'admin') {
    return ApiResponse.error(res, 'Readers cannot download unpublished manuscript files', 403);
  }

  const result = await getGridFSFileStream('manuscripts', fileId);
  if (!result) {
    return ApiResponse.error(res, 'Manuscript PDF not found in storage', 404);
  }

  const { fileDoc, downloadStream } = result;

  res.set('Content-Type', fileDoc.contentType || 'application/pdf');
  res.set('Content-Disposition', `inline; filename="${fileDoc.filename}"`);
  downloadStream.pipe(res);
});

module.exports = {
  getDownloadToken,
  streamCover,
  streamManuscript
};
