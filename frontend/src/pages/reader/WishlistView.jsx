import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark, Trash2, ArrowRight, BookOpen, Star, ShoppingBag, Eye } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { formatPrice } from '../../utils/format';
import BookCover from '../../components/book/BookCover';
import DigitalReaderModal from '../../components/book/DigitalReaderModal';
import { useTranslation } from 'react-i18next';

export default function WishlistView() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { wishlistBooks, toggleWishlist, isBookPurchased, purchaseBook, activeReaderBook, setActiveReaderBook } = useData();

  return (
    <div className="space-y-10 bg-[#F5F5DA] p-4 sm:p-6 rounded-3xl min-h-screen">
      
      {/* ── 1. HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#D8CFAE] pb-6">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#212842] font-bold block flex items-center gap-1.5 mb-1">
            <Bookmark className="w-3.5 h-3.5 text-[#212842] fill-[#212842]" />
            {t('reader.wishlist.eyebrow')}
          </span>
          <h2 className="font-editorial-serif text-3xl sm:text-4xl text-[#181616] font-bold">
            {t('reader.wishlist.title')}
          </h2>
          <p className="text-xs text-[#5F594F] mt-1 font-sans">
            {t('reader.wishlist.subtitle')}
          </p>
        </div>
        <span className="text-xs font-mono text-[#212842] font-bold bg-[#FFFDF3] px-3.5 py-1.5 rounded-full border border-[#D8CFAE] shadow-2xs">
          {wishlistBooks.length} {t('reader.wishlist.titleCount', { count: wishlistBooks.length })}
        </span>
      </div>

      {/* ── 2. WISHLIST GRID ── */}
      <AnimatePresence mode="popLayout">
        {wishlistBooks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {wishlistBooks.map((book, idx) => {
              const bookSlug = book.slug || book.id || book._id;
              const categoryName = book.genre || book.category || 'General';
              const rating = book.rating || 4.8;
              const price = book.price || 499;
              const isOwned = isBookPurchased(book);

              return (
                <motion.div
                  key={`${bookSlug}-${idx}`}
                  layout
                  initial={{ opacity: 0, scale: 0.95, y: 16 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.35, delay: idx * 0.05, ease: [0.16, 1, 0.3, 1] }}
                  className="bg-[#FFFDF3] rounded-3xl p-6 border border-[#D8CFAE] hover:border-[#212842] shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-full group"
                >
                  <div>
                    {/* Cover & Rating Badge */}
                    <div className="relative mb-4 block">
                      <Link to={`/books/${bookSlug}`} className="block">
                        <BookCover book={book} imageClassName="group-hover:scale-105 transition-transform duration-500" />
                      </Link>

                      <div className="absolute top-3.5 left-3.5 px-2.5 py-1 rounded-full bg-[#F5F5DA]/95 text-[10px] uppercase tracking-[0.14em] font-editorial-sans text-[#212842] font-bold border border-[#D8CFAE] flex items-center gap-1">
                        <Star className="w-3 h-3 text-[#212842] fill-[#212842]" />
                        <span>{rating}</span>
                      </div>
                    </div>

                    <span className="text-[10px] uppercase font-mono tracking-widest text-[#212842] font-bold">
                      {categoryName}
                    </span>
                    
                    <Link to={`/books/${bookSlug}`}>
                      <h3 className="font-editorial-serif text-xl font-bold text-[#181616] mt-1 line-clamp-1 group-hover:text-[#212842] transition-colors leading-snug">
                        {book.title}
                      </h3>
                    </Link>
                    <p className="text-xs text-[#5F594F] mt-1 font-sans">By {book.author}</p>
                  </div>

                  {/* Pricing & Actions */}
                  <div className="pt-4 mt-6 border-t border-[#DED7BD] flex items-center justify-between">
                    <div>
                      <span className="font-editorial-sans font-tabular text-[17px] font-bold tracking-tight text-[#181616]">
                        {formatPrice(price)}
                      </span>
                      <span className="text-[10px] text-[#212842] block font-mono font-bold uppercase tracking-wider">
                        {isOwned ? t('reader.wishlist.owned') : t('reader.wishlist.availableForPurchase')}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Remove Button */}
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.92 }}
                        onClick={() => toggleWishlist(book)}
                        className="p-2.5 rounded-full border border-[#D8CFAE] bg-[#F8F6E5] text-[#5F594F] hover:text-rose-600 hover:border-rose-300 transition-colors shadow-2xs"
                        title="Remove from wishlist"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                      
                      {/* Read Now if Owned, else Purchase */}
                      {isOwned ? (
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => setActiveReaderBook(book)}
                          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#212842] text-[#F5F5DA] text-xs font-mono font-bold uppercase tracking-wider hover:bg-[#181E33] transition-colors shadow-md"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>{t('reader.wishlist.readNow')}</span>
                        </motion.button>
                      ) : (
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => purchaseBook(book, price)}
                          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#212842] text-[#F5F5DA] text-xs font-mono font-bold uppercase tracking-wider hover:bg-[#181E33] transition-colors shadow-md"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>{t('reader.wishlist.purchase')}</span>
                        </motion.button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          /* EDITORIAL EMPTY STATE */
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center justify-center py-20 text-center bg-[#FFFDF3] rounded-3xl border border-[#D8CFAE] p-8 space-y-4 shadow-sm"
          >
            <div className="w-16 h-16 rounded-2xl bg-[#F8F6E5] border border-[#D8CFAE] flex items-center justify-center text-[#212842] shadow-xs">
              <Bookmark className="w-7 h-7 text-[#212842]" />
            </div>

            <div className="space-y-1 max-w-md">
              <h3 className="font-editorial-serif text-2xl font-bold text-[#181616]">
                {t('reader.wishlist.emptyTitle')}
              </h3>
              <p className="text-xs text-[#5F594F] font-sans leading-relaxed">
                {t('reader.wishlist.emptyDesc')}
              </p>
            </div>

            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/books"
                className="px-6 py-3 rounded-full bg-[#212842] text-[#F5F5DA] text-xs font-mono font-bold uppercase tracking-wider hover:bg-[#181E33] transition-colors shadow-md inline-flex items-center gap-2"
              >
                <span>{t('reader.wishlist.exploreBooks')}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Digital Reader Modal */}
      {activeReaderBook && (
        <DigitalReaderModal
          isOpen={Boolean(activeReaderBook)}
          onClose={() => setActiveReaderBook(null)}
          book={activeReaderBook}
          initialPage={activeReaderBook.currentPage || 1}
        />
      )}
    </div>
  );
}
