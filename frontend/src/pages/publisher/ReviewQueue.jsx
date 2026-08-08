import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, FileText, Sparkles } from 'lucide-react';
import { useData } from '../../context/DataContext';

export default function ReviewQueue() {
  const { books, editorialBooks } = useData();
  const [filter, setFilter] = useState('All'); // 'All' | 'Pending' | 'Approved' | 'Rejected'

  const catalogSource = editorialBooks.length > 0 ? editorialBooks : books;

  const filtered = catalogSource.filter((b) => {
    if (filter === 'Pending') return b.status === 'In Review';
    if (filter === 'Approved') return b.status === 'Published';
    if (filter === 'Rejected') return b.status === 'Rejected';
    return true;
  });

  const filterTabs = [
    { label: 'All Submissions', value: 'All' },
    { label: 'Pending Review', value: 'Pending' },
    { label: 'Approved', value: 'Approved' },
    { label: 'Rejected', value: 'Rejected' },
  ];

  return (
    <div className="space-y-8">
      
      {/* ── 1. HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E9E5C8] pb-6">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#7B021D] font-bold block flex items-center gap-1.5 mb-1">
            <Clock className="w-3.5 h-3.5 text-[#7B021D]" />
            Editorial Evaluation Desk
          </span>
          <h2 className="font-editorial-serif text-3xl text-[#211D1D] font-bold">
            Manuscript Review Queue
          </h2>
          <p className="text-xs text-[#6B5E5E] mt-1 font-sans">
            {filtered.length} manuscript(s) currently indexed in evaluation queue
          </p>
        </div>
      </div>

      {/* ── 2. FILTER TABS WITH SPRING UNDERLINE ── */}
      <div className="flex items-center gap-8 border-b border-[#E9E5C8]/70 pb-3 overflow-x-auto scrollbar-none">
        {filterTabs.map((tab) => {
          const isActive = filter === tab.value;
          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => setFilter(tab.value)}
              className={`relative text-xs font-mono uppercase tracking-wider transition-colors py-2 whitespace-nowrap ${
                isActive ? 'text-[#211D1D] font-bold' : 'text-[#6B5E5E] hover:text-[#211D1D]'
              }`}
            >
              {tab.label}
              {isActive && (
                <motion.div
                  layoutId="queueTabUnderline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7B021D]"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* ── 3. EDITORIAL QUEUE LIST ── */}
      <div className="space-y-4">
        {filtered.length > 0 ? (
          filtered.map((book, idx) => {
            const bookId = book.id || book._id;
            return (
              <motion.div
                key={bookId}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: idx * 0.05 }}
              >
                <Link
                  to={`/publisher/review/${bookId}`}
                  className="bg-gradient-to-r from-[#FFFDF3] to-[#F5F5DA] rounded-2xl p-5 border border-[#E9E5C8] flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#7B021D] transition-all duration-300 shadow-2xs hover:shadow-lg hover:shadow-[#7B021D]/10 group block"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-16 aspect-[2/3] rounded-lg overflow-hidden bg-[#F5F5DA] shrink-0 border border-[#E9E5C8] shadow-2xs">
                      <img
                        src={book.coverImage || book.coverUrl}
                        alt={book.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-[#7B021D] font-bold">
                          {book.genre}
                        </span>
                        <span className="text-[#E9E5C8]">·</span>
                        <span className="text-xs font-mono text-[#6B5E5E]">
                          Submitted {book.submittedDate || 'Recent'}
                        </span>
                      </div>

                      <h3 className="font-editorial-serif text-lg font-bold text-[#211D1D] group-hover:text-[#7B021D] transition-colors">
                        {book.title}
                      </h3>

                      <p className="text-xs text-[#6B5E5E] font-sans">By {book.author}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#E9E5C8]">
                    <span
                      className={`text-xs font-mono uppercase tracking-wider font-bold px-3 py-1 rounded-full border ${
                        book.status === 'Published'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : book.status === 'In Review'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-rose-50 text-rose-800 border-rose-200'
                      }`}
                    >
                      {book.status}
                    </span>

                    <span className="inline-flex items-center gap-1 text-xs font-mono font-bold uppercase tracking-wider text-[#211D1D] group-hover:text-[#7B021D] transition-colors">
                      <span>Evaluate</span> <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })
        ) : (
          <div className="text-center py-20 bg-gradient-to-br from-[#FFFDF3] to-[#F5F5DA] rounded-3xl border border-[#E9E5C8] space-y-3">
            <FileText className="w-8 h-8 text-[#7B021D] mx-auto opacity-60" />
            <h3 className="font-editorial-serif text-xl font-bold text-[#211D1D]">
              No Manuscripts Found
            </h3>
            <p className="text-xs text-[#6B5E5E] font-sans">
              There are currently no manuscripts matching the selected filter criteria.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
