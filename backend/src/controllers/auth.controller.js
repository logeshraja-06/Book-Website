const User = require('../models/User');
const Author = require('../models/Author');
const generateToken = require('../utils/generateToken');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../middleware/asyncHandler');
const env = require('../config/env');

const getCookieOptions = () => ({
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
});

const getClearCookieOptions = () => ({
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'lax'
});

// @desc    Register a Reader
// @route   POST /api/auth/register/reader
// @access  Public
const registerReader = asyncHandler(async (req, res) => {
  const { name, email, password, country } = req.body;

  if (!name || !email || !password) {
    return ApiResponse.error(res, 'Full name, email, and password are required', 400);
  }

  if (password.length < 8) {
    return ApiResponse.error(res, 'Password must be at least 8 characters long', 400);
  }

  const cleanEmail = String(email).trim().toLowerCase();
  const existingUser = await User.findOne({ email: cleanEmail });
  if (existingUser) {
    return ApiResponse.error(res, 'An account with this email already exists.', 409);
  }

  const user = await User.create({
    name: String(name).trim(),
    email: cleanEmail,
    password,
    role: 'reader',
    country: country || 'India',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    handle: `@${cleanEmail.split('@')[0]}`
  });

  const token = generateToken(user._id, user.role);
  res.cookie('bookverse_token', token, getCookieOptions());

  const userResponse = user.toObject();
  delete userResponse.password;

  return ApiResponse.success(
    res,
    'Reader account created successfully',
    { token, user: userResponse },
    201
  );
});

// @desc    Register an Author
// @route   POST /api/auth/register/author
// @access  Public
const registerAuthor = asyncHandler(async (req, res) => {
  const { name, email, password, penName, bio, country } = req.body;

  if (!name || !email || !password) {
    return ApiResponse.error(res, 'Full name, email, and password are required', 400);
  }

  if (password.length < 8) {
    return ApiResponse.error(res, 'Password must be at least 8 characters long', 400);
  }

  const cleanEmail = String(email).trim().toLowerCase();
  const existingUser = await User.findOne({ email: cleanEmail });
  if (existingUser) {
    return ApiResponse.error(res, 'An account with this email already exists.', 409);
  }

  const user = await User.create({
    name: String(name).trim(),
    email: cleanEmail,
    password,
    role: 'author',
    country: country || 'India',
    penName: penName ? String(penName).trim() : '',
    bio: bio ? String(bio).trim() : '',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    handle: penName ? `@${String(penName).trim().toLowerCase().replace(/\s+/g, '')}` : `@${cleanEmail.split('@')[0]}`
  });

  // Create linked Author profile
  await Author.create({
    name: penName ? String(penName).trim() : user.name,
    userId: user._id,
    bio: user.bio || 'BookVerse Studio Author',
    handle: user.handle,
    role: 'Verified Studio Author'
  });

  const token = generateToken(user._id, user.role);
  res.cookie('bookverse_token', token, getCookieOptions());

  const userResponse = user.toObject();
  delete userResponse.password;

  return ApiResponse.success(
    res,
    'Author account created successfully',
    { token, user: userResponse },
    201
  );
});

// @desc    Register a Publisher
// @route   POST /api/auth/register/publisher
// @access  Public
const registerPublisher = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return ApiResponse.error(res, 'Full name, email, and password are required', 400);
  }

  if (password.length < 8) {
    return ApiResponse.error(res, 'Password must be at least 8 characters long', 400);
  }

  const cleanEmail = String(email).trim().toLowerCase();
  const existingUser = await User.findOne({ email: cleanEmail });
  if (existingUser) {
    return ApiResponse.error(res, 'An account with this email already exists.', 409);
  }

  const user = await User.create({
    name: String(name).trim(),
    email: cleanEmail,
    password,
    role: 'publisher',
    country: 'India',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
    handle: `@${cleanEmail.split('@')[0]}`
  });

  const token = generateToken(user._id, user.role);
  res.cookie('bookverse_token', token, getCookieOptions());

  const userResponse = user.toObject();
  delete userResponse.password;

  return ApiResponse.success(
    res,
    'Publisher account created successfully',
    { token, user: userResponse },
    201
  );
});

// @desc    General Register Endpoint
// @route   POST /api/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
  const { role } = req.body;
  if (role === 'author') {
    return registerAuthor(req, res);
  } else if (role === 'publisher' || role === 'admin') {
    return registerPublisher(req, res);
  }
  return registerReader(req, res);
});

// @desc    Login user — role auto-detected from MongoDB
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return ApiResponse.error(res, 'Email and password are required', 400);
  }

  const cleanEmail = String(email).trim().toLowerCase();
  const user = await User.findOne({ email: cleanEmail }).select('+password');

  if (!user || !(await user.matchPassword(password))) {
    return ApiResponse.error(res, 'Invalid email or password', 401);
  }

  const token = generateToken(user._id, user.role);

  // Set HTTP-Only cookie
  res.cookie('bookverse_token', token, getCookieOptions());

  const userResponse = user.toObject();
  delete userResponse.password;

  return ApiResponse.success(res, `Login successful as ${user.role}`, {
    token,
    user: userResponse
  });
});

// @desc    Logout user — clears HTTP-Only cookie
// @route   POST /api/auth/logout
// @access  Public
const logout = asyncHandler(async (req, res) => {
  res.clearCookie('bookverse_token', getClearCookieOptions());
  return ApiResponse.success(res, 'Logged out successfully');
});

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('wishlistBookIds');
  if (!user) {
    return ApiResponse.error(res, 'User profile not found', 404);
  }
  const userResponse = user.toObject();
  delete userResponse.password;
  return ApiResponse.success(res, 'Current user profile fetched successfully', { user: userResponse });
});

module.exports = {
  register,
  registerReader,
  registerAuthor,
  login,
  logout,
  getMe
};
