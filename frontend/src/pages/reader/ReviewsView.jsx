import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Trash2, ArrowUpRight, MessageSquareText, BookOpen } from 'lucide-react';
import { apiFetch } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';

export default function ReviewsView() {
  const { t } = useTranslation();
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
        className={`w-4 h-4 ${i < rating ? 'text-[#212842] fill-[#212842]' : 'text-[#E7D9D3]'}`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="py-16 text-center text-xs font-mono text-[#6B5E5E]">
        {t('reader.reviews.loading')}
      </div>
    );
  }

  return (
    <div className="space-y-10 max-w-4xl">
      
      {/* ── 1. HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E7D9D3] pb-6">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#212842] font-bold block flex items-center gap-1.5 mb-1">
            <MessageSquareText className="w-3.5 h-3.5 text-[#212842]" />
            {t('reader.reviews.eyebrow')}
          </span>
          <h2 className="font-editorial-serif text-3xl sm:text-4xl text-[#2B2B2B] font-bold">
            {t('reader.reviews.title')}
          </h2>
          <p className="text-xs text-[#6B5E5E] mt-1 font-sans">
            {t('reader.reviews.subtitle')}
          </p>
        </div>
        <span className="text-xs font-mono text-[#212842] font-bold bg-[#FFFDF3] px-3.5 py-1.5 rounded-full border border-[#E7D9D3]">
          {reviews.length} {t('reader.reviews.publishedCount', { count: reviews.length })}
        </span>
      </div>

      {/* ── 2. REVIEWS LIST ── */}
      {reviews.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-12 text-center bg-gradient-to-br from-[#FFFDF3] to-[#FAF8F6] rounded-3xl border border-[#E7D9D3] text-xs font-mono text-[#6B5E5E] shadow-sm space-y-3"
        >
          <BookOpen className="w-8 h-8 text-[#212842] mx-auto opacity-60" />
          <h3 className="font-editorial-serif text-xl font-bold text-[#2B2B2B]">
            {t('reader.reviews.emptyTitle')}
          </h3>
          <p className="max-w-md mx-auto text-[#6B5E5E] font-sans">
            {t('reader.reviews.emptyDesc')}
          </p>
        </motion.div>
      ) : (
        <div className="space-y-6">
          <AnimatePresence mode="popLayout">
            {reviews.map((rev, idx) => {
              const book = rev.bookId || {};
              const revId = rev._id || rev.id;
              const bookTitle = book.title || rev.bookTitle || 'Book';
              const bookId = book._id || book.id || rev.bookId;
              const author = book.author || rev.author || 'Author';
              const coverUrl = book.coverImage || book.coverUrl || rev.coverUrl || '/assets/books/ponniyin-selvan.webp';

              return (
                <motion.div
                  key={revId}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35, delay: idx * 0.05, ease: [0.16, 1, 0.3, 1] }}
                  className="bg-gradient-to-br from-[#FFFDF3] via-[#FAF8F6] to-[#F4EEEA] rounded-3xl p-8 border border-[#E7D9D3] shadow-md space-y-5 hover:border-[#212842] hover:shadow-xl hover:shadow-[#212842]/10 transition-all duration-300 group"
                >
                  <div className="flex items-start justify-between gap-4 border-b border-[#E7D9D3]/80 pb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-16 rounded-xl overflow-hidden bg-[#F4EEEA] shrink-0 border border-[#E7D9D3] shadow-2xs">
                        <img
                          src={coverUrl}
                          alt={bookTitle}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div>
                        <Link
                          to={`/books/${bookId}`}
                          className="font-editorial-serif text-xl font-bold text-[#2B2B2B] hover:text-[#212842] transition-colors inline-flex items-center gap-1.5"
                        >
                          <span>{bookTitle}</span>
                          <ArrowUpRight className="w-4 h-4 text-[#212842]" />
                        </Link>
                        <p className="text-xs text-[#6B5E5E] font-sans">
                          By {author} · {t('reader.reviews.publishedOn')} {rev.date || rev.dateWritten || 'Recently'}
                        </p>
                      </div>
                    </div>

                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDeleteReview(revId)}
                      className="p-2 rounded-full text-[#6B5E5E] hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete Review"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>

                  <div className="flex items-center gap-1 pt-1">
                    {renderStars(rev.rating)}
                  </div>

                  <p className="text-base text-[#2B2B2B] leading-[1.8] font-sans italic pl-3 border-l-2 border-[#212842]">
                    "{rev.text || rev.reviewText}"
                  </p>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
