const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, default: '' },
    avatarUrl: { type: String, default: '' },
    bio: { type: String, default: '' },
    fullBio: { type: String, default: '' },
    books: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }],
    joinDate: { type: String, default: 'Since 2024' },
    joinedYear: { type: Number, default: 2024 },
    followers: { type: String, default: '0' },
    publications: { type: Number, default: 0 },
    avgRating: { type: String, default: '0.0 ★' },
    handle: { type: String, default: '' },
    stats: {
      totalReads: { type: String, default: '0' },
      avgRating: { type: String, default: '0.0 ★' },
      wishlistAdds: { type: String, default: '0' },
      totalReviews: { type: String, default: '0' }
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    legacyId: { type: String, default: '' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Author', authorSchema);
