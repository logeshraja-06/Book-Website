const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const cookieParser = require('cookie-parser');
const env = require('./config/env');
const errorHandler = require('./middleware/errorHandler');
const ApiResponse = require('./utils/apiResponse');

// Routes Imports
const authRoutes = require('./routes/auth.routes');
const bookRoutes = require('./routes/book.routes');
const authorRoutes = require('./routes/author.routes');
const categoryRoutes = require('./routes/category.routes');
const reviewRoutes = require('./routes/review.routes');
const readerRoutes = require('./routes/reader.routes');
const studioRoutes = require('./routes/studio.routes');
const publisherRoutes = require('./routes/publisher.routes');
const adminRoutes = require('./routes/admin.routes');
const fileRoutes = require('./routes/file.routes');
const wishlistRoutes = require('./routes/wishlist.routes');

const app = express();

// CORS Configuration
const normalizeOrigin = (url) => (url ? url.replace(/\/+$/, '') : '');

const rawAllowedOrigins = [
  env.FRONTEND_URL,
  env.CLIENT_ORIGIN,
  'https://book-website-theta-one.vercel.app',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175'
];

const allowedOrigins = Array.from(
  new Set(rawAllowedOrigins.map(normalizeOrigin).filter(Boolean))
);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser requests (Postman, curl, etc.) with no origin header
    if (!origin) return callback(null, true);

    const cleanOrigin = normalizeOrigin(origin);
    if (allowedOrigins.includes(cleanOrigin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  optionsSuccessStatus: 200
};

// Enable CORS Pre-Flight for all routes
app.options('*', cors(corsOptions));
// Register CORS Middleware before routes
app.use(cors(corsOptions));

// Logging
if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body & Cookie Parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve Uploads Directory Statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Healthcheck Route
const handleHealthCheck = (req, res) => {
  return ApiResponse.success(res, 'BookVerse Studio API is running smoothly', {
    status: 'ONLINE',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
};
app.get('/api/health', handleHealthCheck);
app.get('/health', handleHealthCheck);

// API Routes Registration (Supports both /api prefix and direct endpoint routes)
app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes);

app.use('/api/books', bookRoutes);
app.use('/books', bookRoutes);

app.use('/api/authors', authorRoutes);
app.use('/authors', authorRoutes);

app.use('/api/categories', categoryRoutes);
app.use('/categories', categoryRoutes);

app.use('/api/reviews', reviewRoutes);
app.use('/reviews', reviewRoutes);

app.use('/api/reader', readerRoutes);
app.use('/reader', readerRoutes);

app.use('/api/studio', studioRoutes);
app.use('/studio', studioRoutes);

app.use('/api/editorial', publisherRoutes);
app.use('/editorial', publisherRoutes);

app.use('/api/publisher', publisherRoutes);
app.use('/publisher', publisherRoutes);

app.use('/api/admin', adminRoutes);
app.use('/admin', adminRoutes);

app.use('/api/files', fileRoutes);
app.use('/files', fileRoutes);

app.use('/api/wishlist', wishlistRoutes);
app.use('/wishlist', wishlistRoutes);

// Fallback 404 Route
app.use((req, res) => {
  return ApiResponse.error(res, `Route '${req.originalUrl}' not found on server`, 404);
});

// Centralized Error Handler
app.use(errorHandler);

module.exports = app;
