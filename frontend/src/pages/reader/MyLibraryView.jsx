import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ArrowRight, BookOpen, Download, BookmarkCheck, Trash2, Star, Bookmark, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { formatPrice } from '../../utils/format';
import DigitalReaderModal from '../../components/book/DigitalReaderModal';

export default function MyLibraryView() {
  const { libraryBookState, wishlistBooks, isBookPurchased, isBookInWishlist, toggleWishlist, toggleLibrary, activeReaderBook, setActiveReaderBook, fetchModuleData } = useData();

  const [activeTab, setActiveTab] = useState('currently_reading'); // 'currently_reading' | 'purchased' | 'completed' | 'wishlist'

  const currentlyReading = libraryBookState
    .filter((b) => (b.progress || 0) < 100 && (b.status === 'Currently Reading' || !b.status))
    .slice()
    .sort((a, b) => new Date(b.lastReadAt || 0) - new Date(a.lastReadAt || 0));

  const completed = libraryBookState.filter((b) => (b.progress || 0) >= 100 || b.status === 'Completed');
  const purchased = libraryBookState.filter((b) => isBookPurchased(b));

  const getActiveList = () => {
    switch (activeTab) {
      case 'currently_reading':
        return currentlyReading;
      case 'purchased':
        return purchased.length > 0 ? purchased : libraryBookState;
      case 'completed':
        return completed;
      case 'wishlist':
        return wishlistBooks;
      default:
        return currentlyReading;
    }
  };

  const currentList = getActiveList();

  const handleDownloadPdf = async (book) => {
    const bookId = book._id || book.id || book.slug;
    const token = localStorage.getItem('token') || '';
    try {
      const res = await fetch(`http://localhost:5001/api/files/books/${bookId}/download`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (!res.ok) {
        throw new Error('Download not available');
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const safeTitle = (book.title || 'book').replace(/[^a-zA-Z0-9_-]/g, '_');
      link.download = `BookVerse-${safeTitle}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      window.open(`http://localhost:5001/api/reader/books/${bookId}/pdf`, '_blank');
    }
  };

  return (
    <div className="space-y-8 bg-[#F5F5DA] p-4 sm:p-6 rounded-3xl min-h-screen">
      
      {/* ── 1. SECTION HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#D8CFAE] pb-6">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#212842] font-bold block flex items-center gap-1.5 mb-1">
            <BookmarkCheck className="w-3.5 h-3.5 text-[#212842]" />
            Personal Reader Sanctuary & Digital Shelf
          </span>
          <h2 className="font-editorial-serif text-3xl sm:text-4xl text-[#181616] font-bold">
            My Shelf
          </h2>
          <p className="text-xs text-[#5F594F] mt-1 font-sans">
            Your personal digital library with active reading progress and owned editions
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 bg-[#F1EED2] p-1.5 rounded-2xl border border-[#D8CFAE] overflow-x-auto self-start sm:self-auto">
          {[
            { id: 'currently_reading', label: `Currently Reading (${currentlyReading.length})` },
            { id: 'purchased', label: `Purchased (${purchased.length || libraryBookState.length})` },
            { id: 'completed', label: `Completed (${completed.length})` },
            { id: 'wishlist', label: `Saved Wishlist (${wishlistBooks.length})` }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-[#212842] text-[#F5F5DA] shadow-xs'
                  : 'text-[#5F594F] hover:text-[#181616] hover:bg-[#F8F6E5]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── 2. BOOKSHELF GRID ── */}
      <AnimatePresence mode="popLayout">
        {currentList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {currentList.map((book, idx) => {
              const bookSlug = book.slug || book.id || book._id;
              const isWishlisted = isBookInWishlist(book);
              const rating = book.rating || 4.8;
              const price = book.price || 499;
              const isCompleted = (book.progress || 0) >= 100 || book.status === 'Completed';
              const hasBookmarks = (book.bookmarksCount || 0) > 0;

              return (
                <motion.div
                  key={`${book.id || book._id || 'lib'}-${idx}`}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.45, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="flex flex-col sm:flex-row gap-6 items-start group bg-[#FFFDF3] border border-[#D8CFAE] p-6 rounded-3xl shadow-md hover:shadow-xl hover:border-[#212842] transition-all duration-300 relative overflow-hidden">
                    
                    {/* Book Cover */}
                    <div className="w-full sm:w-36 aspect-[3/4] rounded-2xl overflow-hidden bg-[#F8F6E5] shrink-0 shadow-md border border-[#D8CFAE] relative">
                      <img
                        src={book.coverImage || book.coverUrl}
                        alt={book.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.85 }}
                        onClick={() => toggleWishlist(book)}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-[#F5F5DA]/95 border border-[#D8CFAE] text-[#5F594F]"
                        title={isWishlisted ? 'Saved in Wishlist' : 'Add to Wishlist'}
                      >
                        <Bookmark className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-[#212842] text-[#212842]' : ''}`} />
                      </motion.button>

                      {/* Bookmark Indicator Count Badge */}
                      {hasBookmarks && (
                        <div className="absolute bottom-2 left-2 right-2 bg-[#181616]/90 backdrop-blur-xs px-2 py-1 rounded-lg border border-[#E9E5C8]/30 flex items-center justify-center gap-1 text-[10px] font-mono text-[#F5F5DA] font-bold shadow-xs">
                          <Bookmark className="w-3 h-3 text-[#212842] fill-[#212842]" />
                          <span>{book.bookmarksCount} Bookmark{book.bookmarksCount > 1 ? 's' : ''}</span>
                        </div>
                      )}
                    </div>

                    {/* Book Info & Reading Progress */}
                    <div className="flex-1 space-y-4 w-full flex flex-col justify-between h-full">
                      <div>
                        <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
                          <span className="text-[10px] uppercase font-mono tracking-widest text-[#212842] font-bold block">
                            {book.genre || 'Literature'}
                          </span>

                          {/* Status Badge: COMPLETED or CONTINUE FROM PAGE X */}
                          {isCompleted ? (
                            <span className="px-2 py-0.5 rounded-full bg-[#212842] text-[#F5F5DA] text-[9px] font-mono font-bold uppercase tracking-wider">
                              COMPLETED
                            </span>
                          ) : (book.currentPage || 1) > 1 ? (
                            <span className="px-2 py-0.5 rounded-full bg-[#F1EED2] border border-[#D8CFAE] text-[#212842] text-[9px] font-mono font-bold uppercase tracking-wider">
                              Continue from p. {book.currentPage}
                            </span>
                          ) : null}
                        </div>

                        <h3 className="font-editorial-serif text-xl font-bold text-[#181616] mt-1 leading-snug group-hover:text-[#212842] transition-colors">
                          {book.title}
                        </h3>
                        <p className="text-xs text-[#5F594F] mt-1 font-sans">By {book.author}</p>
                      </div>

                      {/* Reading Progress Bar */}
                      <div className="space-y-2 pt-2 border-t border-[#DED7BD]">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="text-[#5F594F]">
                            Page {book.currentPage || 1} of {book.totalPages || 20}
                          </span>
                          <span className="font-bold text-[#212842]">
                            {book.progress || 0}% read
                          </span>
                        </div>

                        <div className="w-full h-2.5 bg-[#F8F6E5] rounded-full overflow-hidden border border-[#D8CFAE] p-0.5">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${book.progress || 0}%` }}
                            transition={{ duration: 0.8, delay: 0.2 + idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                            className="h-full bg-[#212842] rounded-full shadow-2xs"
                          />
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center justify-between gap-2 pt-2">
                        <span className="font-editorial-sans font-tabular text-sm font-bold text-[#181616]">
                          {formatPrice(price)}
                        </span>

                        <div className="flex items-center gap-2">
                          <motion.button
                            type="button"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleDownloadPdf(book)}
                            className="p-2.5 rounded-full border border-[#D8CFAE] bg-[#F8F6E5] text-[#181616] hover:text-[#212842] hover:border-[#212842] transition-colors shadow-2xs"
                            title="Download PDF Edition"
                          >
                            <Download className="w-4 h-4" />
                          </motion.button>

                          <motion.button
                            type="button"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => setActiveReaderBook(book)}
                            className="px-4 py-2.5 rounded-full bg-[#212842] text-[#F5F5DA] text-xs font-mono font-bold uppercase tracking-wider hover:bg-[#181E33] transition-colors shadow-md flex items-center gap-1.5"
                          >
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>
                              {isCompleted ? 'Re-read' : (book.progress || 0) > 0 ? 'Continue Reading' : 'Read Now'}
                            </span>
                          </motion.button>
                        </div>
                      </div>

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
            className="flex flex-col items-center justify-center py-20 text-center bg-[#FFFDF3] rounded-3xl border border-[#D8CFAE] p-8 space-y-4 shadow-sm"
          >
            <div className="w-16 h-16 rounded-2xl bg-[#F8F6E5] border border-[#D8CFAE] flex items-center justify-center text-[#212842] shadow-xs">
              <BookOpen className="w-7 h-7 text-[#212842]" />
            </div>

            <div className="space-y-1 max-w-md">
              <h3 className="font-editorial-serif text-2xl font-bold text-[#181616]">
                Your library is waiting.
              </h3>
              <p className="text-xs text-[#5F594F] font-sans leading-relaxed">
                Explore our published catalog to add books to your personal shelf and start reading.
              </p>
            </div>

            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/books"
                className="px-6 py-3 rounded-full bg-[#212842] text-[#F5F5DA] text-xs font-mono font-bold uppercase tracking-wider hover:bg-[#181E33] transition-colors shadow-md inline-flex items-center gap-2"
              >
                <span>Explore Books</span>
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
          initialPage={activeReaderBook.currentPage || 1}
        />
      )}

    </div>
  );
}
