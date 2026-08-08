import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ArrowRight, BookOpen, Download, BookmarkCheck } from 'lucide-react';
import { useData } from '../../context/DataContext';
import EmptyState from '../../components/common/EmptyState';
import DigitalReaderModal from '../../components/book/DigitalReaderModal';

export default function MyLibraryView() {
  const { libraryBookState } = useData();
  const [selectedBookForReading, setSelectedBookForReading] = useState(null);

  return (
    <div className="space-y-10">
      
      {/* ── 1. SECTION HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E7D9D3] pb-6">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#7B021D] font-bold block flex items-center gap-1.5 mb-1">
            <BookmarkCheck className="w-3.5 h-3.5 text-[#7B021D]" />
            Personal Collection & My Shelf
          </span>
          <h2 className="font-editorial-serif text-3xl sm:text-4xl text-[#2B2B2B] font-bold">
            Personal Bookshelf & Active Library
          </h2>
          <p className="text-xs text-[#6B5E5E] mt-1 font-sans">
            {libraryBookState.length} title(s) in active reading shelf with persistent progress tracking
          </p>
        </div>
      </div>

      {/* ── 2. BOOKSHELF GRID ── */}
      {libraryBookState.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {libraryBookState.map((book, idx) => (
            <motion.div
              key={`${book.id || book._id || 'lib'}-${idx}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex flex-col sm:flex-row gap-6 items-start group bg-gradient-to-br from-[#FFFDF3] via-[#FAF8F6] to-[#F4EEEA] border border-[#E7D9D3] p-6 rounded-3xl shadow-md hover:shadow-xl hover:shadow-[#7B021D]/10 hover:border-[#7B021D] transition-all duration-300">
                {/* Book Cover */}
                <div className="w-full sm:w-36 aspect-[3/4] rounded-2xl overflow-hidden bg-[#F4EEEA] shrink-0 shadow-md border border-[#E7D9D3]">
                  <img
                    src={book.coverImage || book.coverUrl}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Book Info & Reading Progress */}
                <div className="flex-1 space-y-4 w-full flex flex-col justify-between h-full">
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-widest text-[#7B021D] font-bold block">
                      {book.genre}
                    </span>
                    <h3 className="font-editorial-serif text-xl font-bold text-[#2B2B2B] mt-1 leading-snug group-hover:text-[#7B021D] transition-colors">
                      {book.title}
                    </h3>
                    <p className="text-xs text-[#6B5E5E] mt-1 font-sans">By {book.author}</p>
                  </div>

                  {/* Reading Progress Bar */}
                  <div className="space-y-2 pt-2 border-t border-[#E7D9D3]">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-[#6B5E5E]">
                        Page {book.currentPage || 1} of {book.totalPages || 350}
                      </span>
                      <span className="font-bold text-[#7B021D]">
                        {book.progress || 0}%
                      </span>
                    </div>

                    <div className="w-full h-2.5 bg-[#F4EEEA] rounded-full overflow-hidden border border-[#E7D9D3] p-0.5">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${book.progress || 0}%` }}
                        transition={{ duration: 0.8, delay: 0.2 + idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                        className="h-full bg-[#7B021D] rounded-full shadow-2xs"
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between gap-2 pt-2">
                    <span className="text-[11px] text-[#6B5E5E] flex items-center gap-1 font-mono">
                      <Clock className="w-3.5 h-3.5 text-[#7B021D]" />
                      {book.lastRead || 'Recently'}
                    </span>

                    <div className="flex items-center gap-2">
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setSelectedBookForReading(book)}
                        className="px-5 py-2.5 rounded-full bg-[#7B021D] text-[#F5F5DA] text-xs font-mono font-bold uppercase tracking-wider hover:bg-[#520014] transition-colors shadow-md flex items-center gap-1.5"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>{book.progress === 100 ? 'Re-read' : 'Read Now'}</span>
                      </motion.button>

                      {book.pdfPath && (
                        <motion.a
                          whileHover={{ scale: 1.08 }}
                          whileTap={{ scale: 0.92 }}
                          href={book.pdfPath}
                          download
                          target="_blank"
                          rel="noreferrer"
                          className="p-2.5 rounded-full border border-[#E7D9D3] bg-[#FFFDF3] text-[#2B2B2B] hover:border-[#7B021D] hover:text-[#7B021D] transition-colors shadow-2xs"
                          title="Download PDF Edition"
                        >
                          <Download className="w-4 h-4" />
                        </motion.a>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <EmptyState
            icon={BookOpen}
            title="Your Bookshelf is Empty"
            description="You currently have no books in your personal reading library. Explore our catalog to add or purchase titles."
            actionLabel="Browse Catalog"
            actionTo="/books"
          />
        </motion.div>
      )}

      {/* Digital Reader Modal */}
      {selectedBookForReading && (
        <DigitalReaderModal
          isOpen={Boolean(selectedBookForReading)}
          onClose={() => setSelectedBookForReading(null)}
          book={selectedBookForReading}
          initialPage={selectedBookForReading.currentPage || 1}
        />
      )}

    </div>
  );
}
