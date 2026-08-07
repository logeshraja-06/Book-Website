const User = require('../models/User');
const Author = require('../models/Author');
const generateToken = require('../utils/generateToken');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Register a new user (reader or author)
// @route   POST /api/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
  const { name, email, password, role, bio, handle } = req.body;

  if (!name || !email || !password) {
    return ApiResponse.error(res, 'Name, email, and password are required', 400);
  }

  // Prevent self-registration for publisher/admin
  let userRole = role || 'reader';
  if (userRole === 'publisher' || userRole === 'admin') {
    return ApiResponse.error(res, 'Cannot self-register as publisher or admin', 403);
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return ApiResponse.error(res, 'User already exists with this email', 400);
  }

  const user = await User.create({
    name,
    email,
    password,
    role: userRole,
    bio: bio || '',
    handle: handle || `@${email.split('@')[0]}`
  });

  // If registering as author, also create Author profile if not exists
  if (userRole === 'author') {
    const existingAuthor = await Author.findOne({ userId: user._id });
    if (!existingAuthor) {
      await Author.create({
        name: user.name,
        userId: user._id,
        bio: user.bio || 'BookVerse Author',
        handle: user.handle,
        role: 'Verified Author'
      });
    }
  }

  const token = generateToken(user._id, user.role);

  const userResponse = user.toObject();
  delete userResponse.password;

  return ApiResponse.success(
    res,
    'User registered successfully',
    { token, user: userResponse },
    201
  );
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return ApiResponse.error(res, 'Email and password are required', 400);
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.matchPassword(password))) {
    return ApiResponse.error(res, 'Invalid credentials', 401);
  }

  const token = generateToken(user._id, user.role);

  const userResponse = user.toObject();
  delete userResponse.password;

  return ApiResponse.success(res, 'Login successful', {
    token,
    user: userResponse
  });
});

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('wishlistBookIds');
  return ApiResponse.success(res, 'Current user profile fetched successfully', { user });
});

module.exports = {
  register,
  login,
  getMe
};
