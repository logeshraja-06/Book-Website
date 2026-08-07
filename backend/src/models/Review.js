const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    reviewerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reviewer: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    date: { type: String, default: () => new Date().toISOString().split('T')[0] },
    text: { type: String, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Review', reviewSchema);
