const express = require('express');
const router = express.Router();
const {
  getDownloadToken,
  streamCover,
  streamManuscript,
  downloadBookPdf
} = require('../controllers/file.controller');
const { verifyToken } = require('../middleware/auth.middleware');

// Public route for streaming cover image
router.get('/cover/:fileId', streamCover);

// Short-lived download token generation
router.get('/manuscript/:fileId/token', verifyToken, getDownloadToken);

// Published book PDF download route for readers (Requires authentication)
router.get('/books/:id/download', verifyToken, downloadBookPdf);

// Manuscript streaming route (supports query ?token= or Bearer token header)
router.get('/manuscript/:fileId', (req, res, next) => {
  if (req.headers.authorization) {
    return verifyToken(req, res, () => streamManuscript(req, res, next));
  }
  return streamManuscript(req, res, next);
});

module.exports = router;
