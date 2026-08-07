const Category = require('../models/Category');
const Book = require('../models/Book');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ count: -1, name: 1 });

  // Update real live counts for each category
  const categoriesWithCounts = await Promise.all(
    categories.map(async (cat) => {
      const keywords = cat.name.split(/[\s&/]+/).filter((w) => w.length > 2);
      const regexPatterns = keywords.map((w) => ({ genre: { $regex: w, $options: 'i' } }));

      const liveCount = await Book.countDocuments({
        status: { $in: ['Published', 'Approved'] },
        $or: [{ genre: { $regex: cat.name, $options: 'i' } }, ...regexPatterns]
      });

      const catObj = cat.toObject();
      catObj.count = liveCount || catObj.count || 0;
      return catObj;
    })
  );

  return ApiResponse.success(res, 'Categories fetched successfully', categoriesWithCounts);
});

// @desc    Get books in a specific category by slug
// @route   GET /api/categories/:slug/books
// @access  Public
const getCategoryBooksBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  let category = await Category.findOne({ id: slug });
  if (!category) {
    const rawName = slug.replace(/-/g, ' ');
    category = await Category.findOne({ name: { $regex: `^${rawName}$`, $options: 'i' } });
  }

  const categoryName = category ? category.name : slug.replace(/-/g, ' ');
  const keywords = categoryName.split(/[\s&/]+/).filter((w) => w.length > 2);
  const regexPatterns = keywords.map((w) => ({ genre: { $regex: w, $options: 'i' } }));

  const books = await Book.find({
    status: { $in: ['Published', 'Approved'] },
    $or: [{ genre: { $regex: categoryName, $options: 'i' } }, ...regexPatterns]
  }).sort({ rating: -1, createdAt: -1 });

  return ApiResponse.success(res, `Books in category ${categoryName} fetched successfully`, {
    category: category || { id: slug, name: categoryName, desc: `Curated ${categoryName} titles from BookVerse Studio.` },
    books
  });
});

module.exports = {
  getCategories,
  getCategoryBooksBySlug
};
