const express = require('express');
const router = express.Router();
const {
  getDownloadToken,
  streamCover,
  streamManuscript
} = require('../controllers/file.controller');
const { verifyToken } = require('../middleware/auth.middleware');

// Public route for streaming cover image
router.get('/cover/:fileId', streamCover);

// Short-lived download token generation
router.get('/manuscript/:fileId/token', verifyToken, getDownloadToken);

// Manuscript streaming route (supports query ?token= or Bearer token header)
router.get('/manuscript/:fileId', (req, res, next) => {
  // If authorization header provided, verify token first
  if (req.headers.authorization) {
    return verifyToken(req, res, () => streamManuscript(req, res, next));
  }
  return streamManuscript(req, res, next);
});

module.exports = router;
