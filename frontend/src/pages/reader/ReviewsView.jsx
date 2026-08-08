import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Trash2, ArrowUpRight } from 'lucide-react';
import { apiFetch } from '../../context/AuthContext';

export default function ReviewsView() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUserReviews = async () => {
    try {
      const res = await apiFetch('/reader/reviews');
      if (res.success && res.data) {
        setReviews(res.data);
      }
    } catch (err) {
      console.warn('Fetch reviews notice:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserReviews();
  }, []);

  const handleDeleteReview = async (id) => {
    try {
      await apiFetch(`/reader/reviews/${id}`, { method: 'DELETE' });
      setReviews((prev) => prev.filter((r) => r._id !== id && r.id !== id));
    } catch (err) {
      console.error('Delete review error:', err);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-[#7B021D] fill-[#7B021D]' : 'text-[#E9E5C8]'}`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="py-12 text-center text-xs font-mono text-[#6B5E5E]">
        Loading your reviews…
      </div>
    );
  }

  return (
    <div className="space-y-12 max-w-4xl">
      {/* Header */}
      <div className="flex items-end justify-between border-b border-[#E9E5C8] pb-6">
        <div>
          <h2 className="font-editorial-serif text-3xl text-[#211D1D] font-normal">
            Written Critiques & Reviews
          </h2>
          <p className="text-xs text-[#6B5E5E] mt-1">
            Your published contributions to the BookVerse Studio community
          </p>
        </div>
        <span className="text-xs font-mono text-[#6B5E5E]">
          {reviews.length} Reviews Written
        </span>
      </div>

      {reviews.length === 0 ? (
        <div className="p-12 text-center bg-[#FFFDF3] rounded-3xl border border-[#E9E5C8] text-xs font-mono text-[#6B5E5E] shadow-2xs">
          You haven't written any book reviews yet. Browse the catalog to share your thoughts!
        </div>
      ) : (
        <AnimatePresence mode="popLayout">
          {reviews.map((rev) => {
            const book = rev.bookId || {};
            const revId = rev._id || rev.id;
            const bookTitle = book.title || rev.bookTitle || 'Book';
            const bookId = book._id || book.id || rev.bookId;
            const author = book.author || rev.author || 'Author';
            const coverUrl = book.coverImage || book.coverUrl || rev.coverUrl || '/books/ponniyin-selvan.jpg';

            return (
              <motion.div
                key={revId}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="bg-[#FFFDF3] rounded-3xl p-8 border border-[#E9E5C8] shadow-2xs space-y-5 hover:border-[#7B021D] transition-all duration-300 group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={coverUrl}
                      alt={bookTitle}
                      className="w-12 h-16 object-cover rounded-md border border-[#E9E5C8]"
                    />
                    <div>
                      <Link
                        to={`/books/${bookId}`}
                        className="font-editorial-serif text-xl font-bold text-[#211D1D] hover:text-[#7B021D] transition-colors inline-flex items-center gap-1.5"
                      >
                        {bookTitle}
                        <ArrowUpRight className="w-4 h-4 text-[#7B021D]" />
                      </Link>
                      <p className="text-xs text-[#6B5E5E]">
                        By {author} · Published {rev.date || rev.dateWritten || 'Recently'}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteReview(revId)}
                    className="p-2 rounded-full text-[#6B5E5E] hover:text-[#7B021D] hover:bg-[#F5F5DA] transition-colors"
                    title="Delete Review"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-1 pt-1">
                  {renderStars(rev.rating)}
                </div>

                <p className="text-base text-[#211D1D] leading-[1.8] font-normal">
                  "{rev.text || rev.reviewText}"
                </p>
              </motion.div>
            );
          })}
        </AnimatePresence>
      )}
    </div>
  );
}
