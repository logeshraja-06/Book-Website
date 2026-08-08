const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    price: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    status: { type: String, enum: ['completed', 'pending', 'refunded'], default: 'completed' },
    purchasedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

purchaseSchema.index({ userId: 1, bookId: 1 }, { unique: true });

module.exports = mongoose.model('Purchase', purchaseSchema);
