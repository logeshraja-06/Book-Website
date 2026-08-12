import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark as BookmarkIcon, Trash2, ArrowRight, BookOpen, Star, Eye, Quote, Clock, Sparkles } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { apiFetch } from '../../context/AuthContext';
import BookCover from '../../components/book/BookCover';
import DigitalReaderModal from '../../components/book/DigitalReaderModal';
import { useTranslation } from 'react-i18next';

export default function BookmarksView() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { bookmarks, deleteBookmark, activeReaderBook, setActiveReaderBook, isBookPurchased, fetchModuleData } = useData();

  const [readerInitialPage, setReaderInitialPage] = useState(1);

  const handleDeleteBookmark = async (id, bookObj) => {
    if (deleteBookmark) {
      await deleteBookmark(id);
    }
  };

  const handleOpenBookmark = (book, pageNumber) => {
    const targetPage = Number(pageNumber) || 1;
    setReaderInitialPage(targetPage);
    setActiveReaderBook(book);
  };

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
        <span className="text-xs font-mono text-[#212842] font-bold bg-[#FFFDF3] px-4 py-2 rounded-full border border-[#D8CFAE] shadow-2xs">
          {bookmarks.length} {t('reader.bookmarks.volumeCount', { count: bookmarks.length })}
        </span>
      </div>

      {/* ── 2. BOOKMARKS GRID ── */}
      <AnimatePresence mode="popLayout">
        {bookmarks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {bookmarks.map((bm, idx) => {
              const rawBook = bm.bookId;
              const bObj = rawBook && typeof rawBook === 'object' ? rawBook : {};
              const bmId = bm._id || bm.id;
              const bookTitle = (bObj.title && bObj.title !== 'Literature') ? bObj.title : (bm.bookTitle || 'Untitled Book');
              const bookId = bObj._id || bObj.id || bm.bookId;
              const bookSlug = bObj.slug || bookId;
              const authorName = bObj.author || bm.author || 'BookVerse Author';
              const category = bObj.genre || bObj.category || 'Literature';
              const pageNumber = bm.pageNumber || 1;
              const chapterTitle = bm.chapterTitle || bm.pageRef || `Page ${pageNumber}`;
              const dateSaved = bm.dateSaved || (bm.createdAt ? new Date(bm.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently');
              const isOwned = isBookPurchased(bObj);

              const fullBookObj = {
                ...bObj,
                _id: bObj._id || bookId,
                id: bObj.id || bookSlug,
                slug: bookSlug,
                title: bookTitle,
                author: authorName,
                genre: category,
                coverUrl: bObj.coverUrl || bObj.coverImage || '',
                currentPage: pageNumber
              };

              return (
                <motion.div
                  key={bmId || idx}
                  layout
                  initial={{ opacity: 0, scale: 0.96, y: 14 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.35, delay: idx * 0.04, ease: [0.16, 1, 0.3, 1] }}
                  className="bg-[#FFFDF3] rounded-3xl p-6 border border-[#D8CFAE] hover:border-[#212842] shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group relative"
                >
                  <div>
                    {/* Cover Artwork with Page Marker Badge */}
                    <div className="relative mb-5 block overflow-hidden rounded-2xl border border-[#D8CFAE] bg-[#F8F6E5] shadow-inner">
                      <Link to={`/books/${bookSlug}`} className="block">
                        <BookCover book={fullBookObj} imageClassName="group-hover:scale-105 transition-transform duration-500" />
                      </Link>

                      {/* Top-Left Page Marker Badge */}
                      <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#212842] text-[#F5F5DA] text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md">
                        <BookmarkIcon className="w-3 h-3 fill-current" />
                        <span>Page {pageNumber}</span>
                      </div>

                      {/* Top-Right Saved Date */}
                      <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-[#F5F5DA]/95 backdrop-blur-xs text-[9px] font-mono text-[#5F594F] font-bold border border-[#D8CFAE] flex items-center gap-1 shadow-xs">
                        <Clock className="w-2.5 h-2.5" />
                        <span>{dateSaved}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono text-[#212842] font-bold mb-1">
                      <span className="uppercase tracking-widest">{category}</span>
                      <span className="text-[#5F594F] truncate max-w-[140px]">{chapterTitle}</span>
                    </div>

                    <Link to={`/books/${bookSlug}`}>
                      <h3 className="font-editorial-serif text-xl sm:text-2xl font-bold text-[#181616] line-clamp-1 group-hover:text-[#212842] transition-colors leading-snug">
                        {bookTitle}
                      </h3>
                    </Link>
                    <p className="text-xs text-[#5F594F] mt-1 font-sans font-medium">By {authorName}</p>

                    {/* Pull Quote / Note */}
                    {(bm.quote || bm.note) && (
                      <div className="mt-3.5 p-3.5 rounded-2xl bg-[#F8F6E5] border border-[#D8CFAE] text-xs italic font-editorial-serif text-[#181616] leading-relaxed line-clamp-3 relative">
                        <Quote className="w-3.5 h-3.5 text-[#212842] mb-1 opacity-70" />
                        <span>"{bm.quote || bm.note}"</span>
                      </div>
                    )}
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-4 mt-6 border-t border-[#DED7BD] flex items-center justify-between gap-2">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.92 }}
                      onClick={() => handleDeleteBookmark(bmId, fullBookObj)}
                      className="p-2.5 rounded-full border border-[#D8CFAE] bg-[#F8F6E5] text-[#5F594F] hover:text-rose-600 hover:border-rose-300 transition-colors shadow-2xs"
                      title="Remove Bookmark"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>

                    <div className="flex items-center gap-2">
                      <Link
                        to={`/books/${bookSlug}`}
                        className="px-3.5 py-2.5 rounded-full border border-[#D8CFAE] bg-[#F8F6E5] text-[#181616] text-xs font-mono font-bold uppercase tracking-wider hover:border-[#212842] hover:text-[#212842] transition-colors flex items-center gap-1"
                        title="View Book Details"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#212842]" />
                        <span className="hidden sm:inline">{t('reader.bookmarks.details')}</span>
                      </Link>

                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handleOpenBookmark(fullBookObj, pageNumber)}
                        className="px-4 py-2.5 rounded-full bg-[#212842] text-[#F5F5DA] text-xs font-mono font-bold uppercase tracking-wider hover:bg-[#181E33] transition-colors shadow-md flex items-center gap-1.5"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>{t('reader.bookmarks.openBook')}</span>
                      </motion.button>
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
          onClose={() => {
            setActiveReaderBook(null);
            if (fetchModuleData) fetchModuleData();
          }}
          book={activeReaderBook}
          initialPage={readerInitialPage || activeReaderBook.currentPage || 1}
        />
      )}
    </div>
  );
}
