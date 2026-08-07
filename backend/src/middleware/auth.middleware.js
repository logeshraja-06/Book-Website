const jwt = require('jsonwebtoken');
const env = require('../config/env');
const User = require('../models/User');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('./asyncHandler');

const verifyToken = asyncHandler(async (req, res, next) => {
  let token;

  // 1. Check HTTP-Only Cookie
  if (req.cookies && req.cookies.bookverse_token) {
    token = req.cookies.bookverse_token;
  }
  // 2. Check Authorization Bearer Header Fallback
  else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return ApiResponse.error(res, 'Authentication token required', 401);
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return ApiResponse.error(res, 'User associated with token not found', 401);
    }

    req.user = user;
    next();
  } catch (error) {
    return ApiResponse.error(res, 'Invalid or expired token', 401);
  }
});

module.exports = { verifyToken };
