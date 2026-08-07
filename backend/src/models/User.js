const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ['reader', 'author', 'publisher', 'admin'],
      default: 'reader'
    },
    country: { type: String, default: 'India' },
    penName: { type: String, default: '' },
    profileImage: { type: String, default: '' },
    avatarUrl: { type: String, default: '' },
    bio: { type: String, default: '' },
    handle: { type: String, default: '' },
    wishlistBookIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }],
    library: [
      {
        bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
        progress: { type: Number, default: 0 },
        currentPage: { type: Number, default: 1 },
        totalPages: { type: Number, default: 100 },
        status: { type: String, default: 'Currently Reading' },
        lastRead: { type: String, default: '' }
      }
    ],
    bookmarks: [
      {
        bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
        pageRef: { type: String, default: '' },
        quote: { type: String, default: '' },
        note: { type: String, default: '' },
        dateSaved: { type: String, default: '' }
      }
    ]
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
