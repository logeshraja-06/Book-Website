const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
const env = require('../config/env');
const Book = require('../models/Book');
const User = require('../models/User');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../middleware/asyncHandler');
const mongoose = require('mongoose');

// @desc    Get short-lived download token for manuscript viewing
// @route   GET /api/files/manuscript/:fileId/token
// @access  Private
const getDownloadToken = asyncHandler(async (req, res) => {
  const { fileId } = req.params;

  if (!fileId || fileId === 'undefined' || fileId === 'null') {
    return ApiResponse.error(res, 'Valid manuscript file ID required', 400);
  }

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

  const manuscriptId = book._id.toString();

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

// @desc    Stream cover image from disk or static path (Public access)
// @route   GET /api/files/cover/:fileId
// @access  Public
const streamCover = asyncHandler(async (req, res) => {
  const { fileId } = req.params;

  let book;
  if (mongoose.Types.ObjectId.isValid(fileId)) {
    book = await Book.findById(fileId);
  } else {
    book = await Book.findOne({ legacyId: fileId });
  }

  if (book && (book.coverPath || book.coverUrl)) {
    const coverRel = book.coverPath || book.coverUrl;
    if (coverRel.startsWith('/uploads/')) {
      const absPath = path.join(__dirname, '../../', coverRel);
      if (fs.existsSync(absPath)) {
        res.set('Cache-Control', 'public, max-age=31536000, immutable');
        return fs.createReadStream(absPath).pipe(res);
      }
    }
  }

  return ApiResponse.error(res, 'Cover image not found', 404);
});

// @desc    Stream manuscript PDF from disk
// @route   GET /api/files/manuscript/:fileId
// @access  Protected (via short-lived ?token= OR Bearer Authorization Header)
const streamManuscript = asyncHandler(async (req, res) => {
  const { fileId } = req.params;
  const tokenQuery = req.query.token;

  let authUser = req.user;

  if (!authUser && tokenQuery) {
    try {
      const decoded = jwt.verify(tokenQuery, env.JWT_SECRET);
      if (decoded.scope === 'manuscript_download' || decoded.id) {
        authUser = await User.findById(decoded.userId || decoded.id);
      }
    } catch (err) {
      return ApiResponse.error(res, 'Download link expired or invalid.', 401);
    }
  }

  if (!authUser) {
    return ApiResponse.error(res, 'Authentication required to access manuscript', 401);
  }

  let book;
  if (mongoose.Types.ObjectId.isValid(fileId)) {
    book = await Book.findById(fileId);
  } else {
    book = await Book.findOne({ legacyId: fileId });
  }

  if (!book) {
    return ApiResponse.error(res, 'Manuscript file not found', 404);
  }

  const pdfRel = book.pdfPath || book.manuscriptUrl;
  if (!pdfRel || !pdfRel.startsWith('/uploads/')) {
    // Return sample or fallback if no file uploaded
    return ApiResponse.error(res, 'PDF file not available for this manuscript', 404);
  }

  const absPath = path.join(__dirname, '../../', pdfRel);
  if (!fs.existsSync(absPath)) {
    return ApiResponse.error(res, 'File missing on server disk', 404);
  }

  res.set('Content-Type', 'application/pdf');
  res.set('Content-Disposition', `inline; filename="${book.title || 'manuscript'}.pdf"`);
  return fs.createReadStream(absPath).pipe(res);
});

module.exports = {
  getDownloadToken,
  streamCover,
  streamManuscript
};
