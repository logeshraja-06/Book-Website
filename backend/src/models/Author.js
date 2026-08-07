const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, sparse: true, index: true },
    role: { type: String, default: 'Author' },
    avatarUrl: { type: String, default: '' },
    bio: { type: String, default: '' },
    fullBio: { type: String, default: '' },
    books: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }],
    genres: [{ type: String }],
    joinDate: { type: String, default: 'Since 2024' },
    joinedYear: { type: Number, default: 2024 },
    followers: { type: String, default: '1.2k' },
    publications: { type: Number, default: 0 },
    avgRating: { type: String, default: '4.8 ★' },
    handle: { type: String, default: '' },
    socialLinks: {
      twitter: { type: String, default: '' },
      website: { type: String, default: '' }
    },
    stats: {
      totalReads: { type: String, default: '0' },
      avgRating: { type: String, default: '4.8 ★' },
      wishlistAdds: { type: String, default: '0' },
      totalReviews: { type: String, default: '0' }
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    legacyId: { type: String, default: '' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Author', authorSchema);
