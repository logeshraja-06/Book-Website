const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, sparse: true, index: true },
    bookCode: { type: String, default: '' },
    subtitle: { type: String, default: '' },
    author: { type: String, required: true, trim: true },
    authorId: { type: mongoose.Schema.Types.Mixed, required: true },
    publisherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    genre: { type: String, default: 'General' },
    language: { type: String, default: 'English' },
    price: { type: Number, default: 0 },
    isbn: { type: String, default: '' },
    rating: { type: Number, default: 0 },
    reviewsCount: { type: String, default: '0' },
    publishYear: { type: Number, default: () => new Date().getFullYear() },
    pages: { type: Number, default: 200 },
    editorPick: { type: Boolean, default: false },
    tagline: { type: String, default: '' },
    synopsis: { type: String, default: '' },
    coverUrl: { type: String, default: '' },
    coverPath: { type: String, default: '' },
    pdfPath: { type: String, default: '' },
    badge: { type: String, default: '' },
    publisher: { type: String, default: 'BookVerse Studio Imprint' },
    sampleFile: { type: String, default: '' },
    status: {
      type: String,
      enum: ['Draft', 'Submitted', 'In Review', 'Pending Review', 'Approved', 'Published', 'Rejected', 'Needs Revision'],
      default: 'Draft'
    },
    lastEdited: { type: String, default: '' },
    submittedDate: { type: String, default: '' },
    editorialNotes: { type: String, default: '' },
    rejectionReason: { type: String, default: '' },
    revisionNotes: { type: String, default: '' },
    viewCount: { type: Number, default: 0 },
    reviewedAt: { type: Date },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    manuscriptFileName: { type: String, default: '' },
    manuscriptFileType: { type: String, default: '' },
    manuscriptFileSize: { type: String, default: '' },
    manuscriptUrl: { type: String, default: '' },
    draftProgress: { type: String, default: '' },
    legacyId: { type: String, default: '' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Book', bookSchema);
