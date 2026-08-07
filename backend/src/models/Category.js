const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    count: { type: Number, default: 0 },
    desc: { type: String, default: '' },
    coverUrl: { type: String, default: '' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Category', categorySchema);
