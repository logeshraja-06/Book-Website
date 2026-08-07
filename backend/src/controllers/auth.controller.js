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

  if (password.length < 8) {
    return ApiResponse.error(res, 'Password must be at least 8 characters long', 400);
  }

  // Server-side strict role restriction
  let userRole = role || 'reader';
  if (userRole !== 'reader' && userRole !== 'author') {
    return ApiResponse.error(res, 'Registration is restricted to reader or author role only', 400);
  }

  const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
  if (existingUser) {
    return ApiResponse.error(res, 'An account with this email already exists.', 409);
  }

  const user = await User.create({
    name,
    email: email.toLowerCase().trim(),
    password,
    role: userRole,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    bio: bio || '',
    handle: handle || `@${email.split('@')[0].toLowerCase()}`
  });

  // If registering as author, also create Author profile if not exists
  if (userRole === 'author') {
    const existingAuthor = await Author.findOne({ userId: user._id });
    if (!existingAuthor) {
      await Author.create({
        name: user.name,
        userId: user._id,
        bio: user.bio || 'BookVerse Studio Author',
        handle: user.handle,
        role: 'Verified Studio Author'
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

  const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');

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
