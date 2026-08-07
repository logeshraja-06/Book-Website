const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
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

module.exports = mongoose.model('Bookmark', bookmarkSchema);
