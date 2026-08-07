import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark, Trash2, ArrowRight } from 'lucide-react';
import { useData } from '../../context/DataContext';
import EmptyState from '../../components/common/EmptyState';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

export default function WishlistView() {
  const { wishlistBooks, toggleWishlist } = useData();

  return (
    <div className="space-y-12">
      
      {/* Header */}
      <div className="flex items-end justify-between border-b border-[#E7D9D3] pb-6">
        <div>
          <h2 className="font-editorial-serif text-3xl text-[#2B2B2B] font-normal">
            Wishlist & Someday Shelf
          </h2>
          <p className="text-xs text-[#6E6A67] mt-1">
            Curated titles earmarked for future contemplation
          </p>
        </div>
        <span className="text-xs font-mono text-[#6E6A67]">
          {wishlistBooks.length} Items Saved
        </span>
      </div>

      {/* Wishlist Grid */}
      <AnimatePresence mode="popLayout">
        {wishlistBooks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {wishlistBooks.map((book) => (
              <motion.div
                key={book.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.25 }}
              >
                <Card className="flex flex-col justify-between h-full group">
                  <div>
                    <div className="aspect-[4/3] rounded-xl overflow-hidden bg-[#F4EEEA] mb-5 border border-[#E7D9D3]">
                      <img
                        src={book.coverUrl}
                        alt={book.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    <span className="text-[10px] uppercase font-mono tracking-widest text-[#D3968C] font-semibold">
                      {book.genre}
                    </span>
                    
                    <h3 className="font-editorial-serif text-lg font-bold text-[#2B2B2B] mt-1 line-clamp-1 group-hover:text-[#C98579] transition-colors">
                      {book.title}
                    </h3>
                    <p className="text-xs text-[#6E6A67] mt-0.5">{book.author}</p>
                  </div>

                  <div className="pt-4 mt-6 border-t border-[#E7D9D3] flex items-center justify-between">
                    <div>
                      <span className="font-editorial-serif text-base font-bold text-[#2B2B2B]">
                        ₹{book.price}
                      </span>
                      <span className="text-[11px] text-[#6E6A67] block">Saved in Wishlist</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleWishlist(book.id)}
                        className="p-2 rounded-full text-[#6E6A67] hover:text-[#C98579] hover:bg-[#F4EEEA] transition-colors"
                        title="Remove from Wishlist"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <Button to={`/books/${book.id}`} size="sm">
                        View Title
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Bookmark}
            title="Your Wishlist is Empty"
            description="Explore our full catalog and bookmark titles to save them to your personal someday shelf."
            actionLabel="Explore Catalog"
            actionTo="/books"
          />
        )}
      </AnimatePresence>

    </div>
  );
}
