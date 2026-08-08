import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark, Trash2, ArrowRight, Sparkles } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { formatPrice } from '../../utils/format';
import EmptyState from '../../components/common/EmptyState';
import BookCover from '../../components/book/BookCover';

export default function WishlistView() {
  const { wishlistBooks, toggleWishlist } = useData();

  return (
    <div className="space-y-10">
      
      {/* ── 1. HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E7D9D3] pb-6">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#7B021D] font-bold block flex items-center gap-1.5 mb-1">
            <Bookmark className="w-3.5 h-3.5 text-[#7B021D]" />
            Earmarked Titles & Wishlist
          </span>
          <h2 className="font-editorial-serif text-3xl sm:text-4xl text-[#2B2B2B] font-bold">
            Wishlist & Someday Shelf
          </h2>
          <p className="text-xs text-[#6B5E5E] mt-1 font-sans">
            Curated manuscripts saved for future reading and contemplation
          </p>
        </div>
        <span className="text-xs font-mono text-[#7B021D] font-bold bg-[#FFFDF3] px-3.5 py-1.5 rounded-full border border-[#E7D9D3]">
          {wishlistBooks.length} Saved Volume(s)
        </span>
      </div>

      {/* ── 2. WISHLIST GRID ── */}
      <AnimatePresence mode="popLayout">
        {wishlistBooks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {wishlistBooks.map((book, idx) => {
              const bookSlug = book.slug || book.id || book._id;
              return (
                <motion.div
                  key={`${bookSlug}-${idx}`}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="bg-gradient-to-br from-[#FFFDF3] via-[#FAF8F6] to-[#F4EEEA] rounded-3xl p-6 border border-[#E7D9D3] hover:border-[#7B021D] shadow-md hover:shadow-xl hover:shadow-[#7B021D]/10 transition-all duration-300 flex flex-col justify-between h-full group"
                >
                  <div>
                    <Link to={`/books/${bookSlug}`} className="block mb-4">
                      <BookCover book={book} imageClassName="group-hover:scale-105 transition-transform duration-500" />
                    </Link>

                    <span className="text-[10px] uppercase font-mono tracking-widest text-[#7B021D] font-bold">
                      {book.genre || book.category}
                    </span>
                    
                    <Link to={`/books/${bookSlug}`}>
                      <h3 className="font-editorial-serif text-xl font-bold text-[#2B2B2B] mt-1 line-clamp-1 group-hover:text-[#7B021D] transition-colors leading-snug">
                        {book.title}
                      </h3>
                    </Link>
                    <p className="text-xs text-[#6B5E5E] mt-1 font-sans">By {book.author}</p>
                  </div>

                  <div className="pt-4 mt-6 border-t border-[#E7D9D3] flex items-center justify-between">
                    <div>
                      <span className="font-editorial-sans font-tabular text-[16px] font-bold tracking-tight text-[#2B2B2B]">
                        {formatPrice(book.price)}
                      </span>
                      <span className="text-[11px] text-[#6B5E5E] block font-mono">Saved Title</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.92 }}
                        onClick={() => toggleWishlist(book.id || book._id)}
                        className="p-2.5 rounded-full border border-[#E7D9D3] bg-[#FFFDF3] text-[#6B5E5E] hover:text-rose-600 hover:border-rose-300 transition-colors shadow-2xs"
                        title="Remove from wishlist"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                      
                      <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                        <Link
                          to={`/books/${bookSlug}`}
                          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#7B021D] text-[#F5F5DA] text-xs font-mono font-bold uppercase tracking-wider hover:bg-[#520014] transition-colors shadow-md"
                        >
                          <span>View Details</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <EmptyState
              icon={Bookmark}
              title="Your Someday Shelf is Empty"
              description="Explore our curated catalog and bookmark titles you wish to contemplate later."
              actionText="Explore Books"
              actionLink="/books"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
