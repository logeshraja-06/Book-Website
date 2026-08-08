import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, ArrowRight, BookOpen, Download } from 'lucide-react';
import { useData } from '../../context/DataContext';
import EmptyState from '../../components/common/EmptyState';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import DigitalReaderModal from '../../components/book/DigitalReaderModal';

export default function MyLibraryView() {
  const { libraryBookState } = useData();
  const [selectedBookForReading, setSelectedBookForReading] = useState(null);

  return (
    <div className="space-y-12">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E9E5C8] pb-6">
        <div>
          <span className="text-xs uppercase tracking-widest font-mono text-[#7B021D] font-bold block mb-1">
            Personal Collection & My Shelf
          </span>
          <h2 className="font-editorial-serif text-3xl text-[#211D1D] font-normal">
            Personal Bookshelf & Digital Reading Shelf
          </h2>
          <p className="text-xs text-[#6B5E5E] mt-1">
            {libraryBookState.length} titles in active reading shelf with persistent reading progress
          </p>
        </div>
      </div>

      {/* Bookshelf Layout */}
      {libraryBookState.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {libraryBookState.map((book, idx) => (
            <motion.div
              key={book.id || book._id || idx}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
            >
              <Card className="flex flex-col sm:flex-row gap-6 items-start group bg-[#FFFDF3] border border-[#E9E5C8] p-6 rounded-3xl shadow-2xs hover:border-[#7B021D] transition-colors">
                {/* Book Cover */}
                <div className="w-full sm:w-36 aspect-[3/4] rounded-2xl overflow-hidden bg-[#F5F5DA] shrink-0 shadow-md border border-[#E9E5C8]">
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
                    <h3 className="font-editorial-serif text-xl font-bold text-[#211D1D] mt-1 leading-snug group-hover:text-[#7B021D] transition-colors">
                      {book.title}
                    </h3>
                    <p className="text-xs text-[#6B5E5E] mt-1 font-sans">By {book.author}</p>
                  </div>

                  {/* Reading Progress */}
                  <div className="space-y-2 pt-2 border-t border-[#E9E5C8]">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-[#6B5E5E]">
                        Page {book.currentPage || 1} of {book.totalPages || 350}
                      </span>
                      <span className="font-bold text-[#211D1D]">
                        {book.progress || 0}%
                      </span>
                    </div>

                    <div className="w-full h-2 bg-[#F5F5DA] rounded-full overflow-hidden border border-[#E9E5C8]">
                      <div
                        className="h-full bg-[#7B021D] transition-all duration-700 rounded-full"
                        style={{ width: `${book.progress || 0}%` }}
                      />
                    </div>
                  </div>

                  {/* Action Buttons: Read Now & Download PDF */}
                  <div className="flex items-center justify-between gap-2 pt-2">
                    <span className="text-[11px] text-[#6B5E5E] flex items-center gap-1 font-mono">
                      <Clock className="w-3.5 h-3.5 text-[#7B021D]" />
                      {book.lastRead || 'Recently'}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedBookForReading(book)}
                        className="px-4 py-2 rounded-full bg-[#7B021D] text-[#F5F5DA] text-xs font-bold uppercase tracking-wider hover:bg-[#520014] transition-colors shadow-2xs flex items-center gap-1.5"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>{book.progress === 100 ? 'Re-read' : 'Read Now'}</span>
                      </button>

                      {book.pdfPath && (
                        <a
                          href={book.pdfPath}
                          download
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 rounded-full border border-[#E9E5C8] text-[#211D1D] hover:border-[#7B021D] hover:text-[#7B021D] transition-colors"
                          title="Download PDF Edition"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>

                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={BookOpen}
          title="Your Bookshelf is Empty"
          description="You currently have no books in your personal reading library. Explore our catalog to add or purchase titles."
          actionLabel="Browse Catalog"
          actionTo="/books"
        />
      )}

      {/* Full-Screen Digital Reader Modal */}
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
