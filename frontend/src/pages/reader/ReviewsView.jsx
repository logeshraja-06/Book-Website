import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Edit3, Trash2, ArrowUpRight } from 'lucide-react';
import { INITIAL_REVIEWS } from '../../data/mockReaderData';

export default function ReviewsView() {
  const [reviews, setReviews] = useState(INITIAL_REVIEWS);

  const deleteReview = (id) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-[#D3968C] fill-[#D3968C]' : 'text-[#E7D9D3]'}`}
      />
    ));
  };

  return (
    <div className="space-y-12 max-w-4xl">
      
      {/* Header */}
      <div className="flex items-end justify-between border-b border-[#E7D9D3] pb-6">
        <div>
          <h2 className="font-editorial-serif text-3xl text-[#2B2B2B] font-normal">
            Written Critiques & Reviews
          </h2>
          <p className="text-xs text-[#6E6A67] mt-1">
            Your published contributions to the BookVerse Studio community
          </p>
        </div>
        <span className="text-xs font-mono text-[#6E6A67]">
          {reviews.length} Reviews Written
        </span>
      </div>

      {/* Editorial List Style Reviews */}
      <AnimatePresence mode="popLayout">
        {reviews.map((rev) => (
          <motion.div
            key={rev.id}
            layout
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="bg-[#FFFFFF] rounded-2xl p-8 border border-[#E7D9D3] shadow-sm space-y-5 hover:border-[#D3968C] transition-all duration-300 group"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={rev.coverUrl}
                  alt={rev.bookTitle}
                  className="w-12 h-16 object-cover rounded-md border border-[#E7D9D3]"
                />
                <div>
                  <Link
                    to={`/books/${rev.bookId}`}
                    className="font-editorial-serif text-xl font-bold text-[#2B2B2B] hover:text-[#C98579] transition-colors inline-flex items-center gap-1.5"
                  >
                    {rev.bookTitle}
                    <ArrowUpRight className="w-4 h-4 text-[#D3968C]" />
                  </Link>
                  <p className="text-xs text-[#6E6A67]">By {rev.author} · Published {rev.dateWritten}</p>
                </div>
              </div>

              {/* Hover Edit / Delete Actions */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                <button
                  className="p-2 rounded-full text-[#6E6A67] hover:text-[#2B2B2B] hover:bg-[#F4EEEA] transition-colors"
                  title="Edit Review"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteReview(rev.id)}
                  className="p-2 rounded-full text-[#6E6A67] hover:text-[#C98579] hover:bg-[#F4EEEA] transition-colors"
                  title="Delete Review"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Rating Stars */}
            <div className="flex items-center gap-1 pt-1">
              {renderStars(rev.rating)}
            </div>

            {/* Written Body */}
            <p className="text-base text-[#2B2B2B] leading-[1.8] font-normal">
              "{rev.reviewText}"
            </p>
          </motion.div>
        ))}
      </AnimatePresence>

    </div>
  );
}
