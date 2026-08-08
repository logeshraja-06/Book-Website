import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark, Trash2, ArrowRight } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { formatPrice } from '../../utils/format';
import EmptyState from '../../components/common/EmptyState';
import BookCover from '../../components/book/BookCover';

export default function WishlistView() {
  const { wishlistBooks, toggleWishlist } = useData();

  return (
    <div className="space-y-12">
      
      {/* Header */}
      <div className="flex items-end justify-between border-b border-[#E9E5C8] pb-6">
        <div>
          <h2 className="font-editorial-serif text-3xl text-[#211D1D] font-normal">
            Wishlist & Someday Shelf
          </h2>
          <p className="text-xs text-[#6B5E5E] mt-1 font-sans">
            Curated titles earmarked for future contemplation
          </p>
        </div>
        <span className="text-xs font-mono text-[#7B021D] font-bold">
          {wishlistBooks.length} Items Saved
        </span>
      </div>

      {/* Wishlist Grid */}
      <AnimatePresence mode="popLayout">
        {wishlistBooks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {wishlistBooks.map((book) => {
              const bookSlug = book.slug || book.id || book._id;
              return (
                <motion.div
                  key={book.id || book._id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.25 }}
                  className="bg-[#FFFDF3] rounded-2xl p-6 border border-[#E9E5C8] hover:border-[#7B021D] shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between h-full group"
                >
                  <div>
                    <Link to={`/books/${bookSlug}`} className="block mb-4">
                      <BookCover book={book} imageClassName="group-hover:scale-105" />
                    </Link>

                    <span className="text-[10px] uppercase font-mono tracking-widest text-[#7B021D] font-bold">
                      {book.genre || book.category}
                    </span>
                    
                    <Link to={`/books/${bookSlug}`}>
                      <h3 className="font-editorial-serif text-xl font-bold text-[#211D1D] mt-1 line-clamp-1 group-hover:text-[#7B021D] transition-colors">
                        {book.title}
                      </h3>
                    </Link>
                    <p className="text-xs text-[#6B5E5E] mt-0.5">{book.author}</p>
                  </div>

                  <div className="pt-4 mt-6 border-t border-[#E9E5C8] flex items-center justify-between">
                    <div>
                      <span className="font-editorial-sans font-tabular text-[16px] font-bold tracking-tight text-[#211D1D]">
                        {formatPrice(book.price)}
                      </span>
                      <span className="text-[11px] text-[#6B5E5E] block">Saved in Wishlist</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => toggleWishlist(book.id || book._id)}
                        className="p-2 rounded-full border border-[#E9E5C8] text-[#6B5E5E] hover:text-red-700 hover:border-red-300 transition-colors"
                        title="Remove from wishlist"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <Link
                        to={`/books/${bookSlug}`}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#7B021D] text-[#F5F5DA] text-xs font-bold uppercase tracking-wider hover:bg-[#520014] transition-colors"
                      >
                        <span>View</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            icon={Bookmark}
            title="Your Someday Shelf is Empty"
            description="Explore our curated catalog and bookmark titles you wish to contemplate later."
            actionText="Explore Books"
            actionLink="/books"
          />
        )}
      </AnimatePresence>
    </div>
  );
}
