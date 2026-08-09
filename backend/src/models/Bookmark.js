const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    pageNumber: { type: Number, default: 1 },
    chapterTitle: { type: String, default: '' },
    pageRef: { type: String, default: 'Page 1' },
    quote: { type: String, default: '' },
    note: { type: String, default: '' },
    dateSaved: {
      type: String,
      default: () => new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    }
  },
  { timestamps: true }
);

bookmarkSchema.index({ userId: 1, bookId: 1, pageNumber: 1 }, { unique: true });

module.exports = mongoose.model('Bookmark', bookmarkSchema);
