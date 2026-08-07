import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, ArrowRight, BookOpen } from 'lucide-react';
import { useData } from '../../context/DataContext';
import EmptyState from '../../components/common/EmptyState';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

export default function MyLibraryView() {
  const { libraryBookState } = useData();

  return (
    <div className="space-y-12">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E7D9D3] pb-6">
        <div>
          <h2 className="font-editorial-serif text-3xl text-[#2B2B2B] font-normal">
            Personal Bookshelf
          </h2>
          <p className="text-xs text-[#6E6A67] mt-1">
            {libraryBookState.length} titles in active reading shelf
          </p>
        </div>
      </div>

      {/* Bookshelf Layout */}
      {libraryBookState.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {libraryBookState.map((book, idx) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
            >
              <Card className="flex flex-col sm:flex-row gap-6 items-start group">
                {/* Book Cover */}
                <div className="w-full sm:w-36 aspect-[3/4] rounded-xl overflow-hidden bg-[#F4EEEA] shrink-0 shadow-md">
                  <img
                    src={book.coverUrl}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Book Info & Reading Progress */}
                <div className="flex-1 space-y-4 w-full flex flex-col justify-between h-full">
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-widest text-[#D3968C] font-semibold block">
                      {book.genre}
                    </span>
                    <h3 className="font-editorial-serif text-xl font-bold text-[#2B2B2B] mt-1 leading-snug group-hover:text-[#C98579] transition-colors">
                      {book.title}
                    </h3>
                    <p className="text-xs text-[#6E6A67] mt-1">By {book.author}</p>
                  </div>

                  {/* Reading Progress */}
                  <div className="space-y-2 pt-2 border-t border-[#E7D9D3]/60">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#6E6A67] font-mono">
                        Page {book.currentPage} of {book.totalPages}
                      </span>
                      <span className="font-semibold text-[#2B2B2B] font-mono">
                        {book.progress}%
                      </span>
                    </div>

                    <div className="w-full h-1.5 bg-[#F4EEEA] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#D3968C] transition-all duration-700 rounded-full"
                        style={{ width: `${book.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[11px] text-[#6E6A67] flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3 text-[#D3968C]" />
                      {book.lastRead}
                    </span>

                    <Button to={`/books/${book.id}`} size="sm" icon={ArrowRight}>
                      {book.progress === 100 ? 'Re-read' : 'Continue'}
                    </Button>
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
          description="You currently have no books in your personal reading library."
          actionLabel="Browse Catalog"
          actionTo="/books"
        />
      )}

    </div>
  );
}
