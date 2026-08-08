const mongoose = require('mongoose');

const readingProgressSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    currentPage: { type: Number, default: 1 },
    totalPages: { type: Number, default: 100 },
    progressPercent: { type: Number, default: 0 },
    status: { type: String, enum: ['Currently Reading', 'Completed', 'Unread'], default: 'Currently Reading' },
    lastReadAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

readingProgressSchema.index({ userId: 1, bookId: 1 }, { unique: true });

module.exports = mongoose.model('ReadingProgress', readingProgressSchema);
