import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark as BookmarkIcon, Trash2, ArrowRight, BookOpen, Star, Eye } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { apiFetch } from '../../context/AuthContext';
import BookCover from '../../components/book/BookCover';
import DigitalReaderModal from '../../components/book/DigitalReaderModal';
import { useTranslation } from 'react-i18next';

export default function BookmarksView() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toggleBookmark, activeReaderBook, setActiveReaderBook, isBookPurchased } = useData();

  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookmarks = async () => {
    try {
      const res = await apiFetch('/reader/bookmarks');
      if (res.success && res.data) {
        setBookmarks(res.data);
      }
    } catch (err) {
      console.warn('Fetch bookmarks notice:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const handleDeleteBookmark = async (id, bookObj) => {
    try {
      await apiFetch(`/reader/bookmarks/${id}`, { method: 'DELETE' });
      setBookmarks((prev) => prev.filter((b) => b._id !== id && b.id !== id));
      toggleBookmark(bookObj || id);
    } catch (err) {
      console.error('Delete bookmark error:', err);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-xs font-mono text-[#5F594F] bg-[#F5F5DA] rounded-3xl">
        {t('reader.bookmarks.loading')}
      </div>
    );
  }

  return (
    <div className="space-y-10 bg-[#F5F5DA] p-4 sm:p-6 rounded-3xl min-h-screen">
      
      {/* ── 1. HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#D8CFAE] pb-6">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#212842] font-bold block flex items-center gap-1.5 mb-1">
            <BookmarkIcon className="w-3.5 h-3.5 text-[#212842] fill-[#212842]" />
            {t('reader.bookmarks.eyebrow')}
          </span>
          <h2 className="font-editorial-serif text-3xl sm:text-4xl text-[#181616] font-bold">
            {t('reader.bookmarks.title')}
          </h2>
          <p className="text-xs text-[#5F594F] mt-1 font-sans">
            {t('reader.bookmarks.subtitle')}
          </p>
        </div>
        <span className="text-xs font-mono text-[#212842] font-bold bg-[#FFFDF3] px-3.5 py-1.5 rounded-full border border-[#D8CFAE] shadow-2xs">
          {bookmarks.length} {t('reader.bookmarks.volumeCount', { count: bookmarks.length })}
        </span>
      </div>

      {/* ── 2. BOOKMARKS GRID / LIST ── */}
      <AnimatePresence mode="popLayout">
        {bookmarks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {bookmarks.map((bm, idx) => {
              const book = bm.bookId || {};
              const bmId = bm._id || bm.id;
              const bookTitle = book.title || bm.bookTitle || 'Untitled Book';
              const bookId = book._id || book.id || bm.bookId;
              const bookSlug = book.slug || bookId;
              const authorName = book.author || 'BookVerse Author';
              const category = book.genre || book.category || 'Literature';
              const dateSaved = bm.dateSaved || bm.createdAt ? new Date(bm.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently';
              const isOwned = isBookPurchased(book);

              return (
                <motion.div
                  key={bmId || idx}
                  layout
                  initial={{ opacity: 0, scale: 0.95, y: 16 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.35, delay: idx * 0.05, ease: [0.16, 1, 0.3, 1] }}
                  className="bg-[#FFFDF3] rounded-3xl p-6 border border-[#D8CFAE] hover:border-[#212842] shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    {/* Cover Artwork */}
                    <div className="relative mb-4 block">
                      <Link to={`/books/${bookSlug}`} className="block">
                        <BookCover book={book} imageClassName="group-hover:scale-105 transition-transform duration-500" />
                      </Link>

                      <div className="absolute top-3.5 left-3.5 px-2.5 py-1 rounded-full bg-[#F5F5DA]/95 text-[10px] uppercase tracking-[0.14em] font-mono text-[#212842] font-bold border border-[#D8CFAE]">
                        {t('reader.bookmarks.bookmarked')}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono text-[#212842] font-bold mb-1">
                      <span className="uppercase tracking-widest">{category}</span>
                      <span className="text-[#5F594F]">{dateSaved}</span>
                    </div>

                    <Link to={`/books/${bookSlug}`}>
                      <h3 className="font-editorial-serif text-xl font-bold text-[#181616] line-clamp-1 group-hover:text-[#212842] transition-colors leading-snug">
                        {bookTitle}
                      </h3>
                    </Link>
                    <p className="text-xs text-[#5F594F] mt-1 font-sans">By {authorName}</p>

                    {bm.quote && (
                      <blockquote className="mt-3 p-3 rounded-2xl bg-[#F8F6E5] border border-[#D8CFAE] text-xs italic font-serif text-[#181616] leading-relaxed line-clamp-2">
                        "{bm.quote}"
                      </blockquote>
                    )}
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-4 mt-6 border-t border-[#DED7BD] flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => handleDeleteBookmark(bmId, book)}
                      className="p-2.5 rounded-full border border-[#D8CFAE] bg-[#F8F6E5] text-[#5F594F] hover:text-rose-600 hover:border-rose-300 transition-colors shadow-2xs"
                      title="Remove Bookmark"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="flex items-center gap-2">
                      <Link
                        to={`/books/${bookSlug}`}
                        className="px-4 py-2.5 rounded-full border border-[#D8CFAE] bg-[#F8F6E5] text-[#181616] text-xs font-mono font-bold uppercase tracking-wider hover:border-[#212842] transition-colors flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#212842]" />
                        <span>{t('reader.bookmarks.details')}</span>
                      </Link>

                      <button
                        type="button"
                        onClick={() => {
                          if (isOwned) {
                            setActiveReaderBook(book);
                          } else {
                            navigate(`/books/${bookSlug}`);
                          }
                        }}
                        className="px-4 py-2.5 rounded-full bg-[#212842] text-[#F5F5DA] text-xs font-mono font-bold uppercase tracking-wider hover:bg-[#181E33] transition-colors shadow-md flex items-center gap-1.5"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>{t('reader.bookmarks.openBook')}</span>
                      </button>
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
              <BookmarkIcon className="w-7 h-7 text-[#212842]" />
            </div>

            <div className="space-y-1 max-w-md">
              <h3 className="font-editorial-serif text-2xl font-bold text-[#181616]">
                {t('reader.bookmarks.emptyTitle')}
              </h3>
              <p className="text-xs text-[#5F594F] font-sans leading-relaxed">
                {t('reader.bookmarks.emptyDesc')}
              </p>
            </div>

            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/books"
                className="px-6 py-3 rounded-full bg-[#212842] text-[#F5F5DA] text-xs font-mono font-bold uppercase tracking-wider hover:bg-[#181E33] transition-colors shadow-md inline-flex items-center gap-2"
              >
                <span>{t('reader.bookmarks.exploreBooks')}</span>
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
