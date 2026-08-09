import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, FileText } from 'lucide-react';
import { useData } from '../../context/DataContext';

export default function ReviewQueue() {
  const { books, editorialBooks, editorialQueue } = useData();
  const [filter, setFilter] = useState('All'); // 'All' | 'Pending' | 'Approved' | 'Rejected' | 'Published'

  const rawCatalog = editorialQueue.length > 0 ? editorialQueue : (editorialBooks.length > 0 ? editorialBooks : books);

  const filtered = rawCatalog.filter((b) => {
    if (filter === 'Pending') return b.status === 'Submitted' || b.status === 'submitted' || b.status === 'In Review' || b.status === 'Pending Review';
    if (filter === 'Approved') return b.status === 'Approved';
    if (filter === 'Rejected') return b.status === 'Rejected';
    if (filter === 'Published') return b.status === 'Published';
    return true;
  });

  const filterTabs = [
    { label: 'All Submissions', value: 'All' },
    { label: 'Pending Review', value: 'Pending' },
    { label: 'Approved', value: 'Approved' },
    { label: 'Published', value: 'Published' },
    { label: 'Rejected', value: 'Rejected' },
  ];

  return (
    <div className="space-y-8 bg-[#F5F5DA] p-4 sm:p-6 rounded-3xl min-h-screen">
      
      {/* ── 1. HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#D8CFAE] pb-6">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#7B021D] font-bold block flex items-center gap-1.5 mb-1">
            <Clock className="w-3.5 h-3.5 text-[#7B021D]" />
            Editorial Evaluation Control Desk
          </span>
          <h2 className="font-editorial-serif text-3xl text-[#181616] font-bold">
            Publisher Review Queue
          </h2>
          <p className="text-xs text-[#5F594F] mt-1 font-sans">
            {filtered.length} manuscript submission(s) in review queue
          </p>
        </div>
      </div>

      {/* ── 2. FILTER TABS ── */}
      <div className="flex items-center gap-6 border-b border-[#D8CFAE] pb-3 overflow-x-auto">
        {filterTabs.map((tab) => {
          const isActive = filter === tab.value;
          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => setFilter(tab.value)}
              className={`relative text-xs font-mono uppercase tracking-wider transition-colors py-2 whitespace-nowrap ${
                isActive ? 'text-[#181616] font-bold' : 'text-[#5F594F] hover:text-[#181616]'
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
                  className="bg-[#FFFDF3] rounded-2xl p-5 border border-[#D8CFAE] flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#7B021D] transition-all duration-300 shadow-2xs hover:shadow-lg group block"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-16 aspect-[2/3] rounded-lg overflow-hidden bg-[#F8F6E5] shrink-0 border border-[#D8CFAE] shadow-2xs">
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
                        <span className="text-[#D8CFAE]">·</span>
                        <span className="text-xs font-mono text-[#5F594F]">
                          Submitted {book.submittedDate || 'Recent'}
                        </span>
                      </div>

                      <h3 className="font-editorial-serif text-lg font-bold text-[#181616] group-hover:text-[#7B021D] transition-colors">
                        {book.title}
                      </h3>

                      <p className="text-xs text-[#5F594F] font-sans">By {book.author}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#DED7BD]">
                    <span
                      className={`text-xs font-mono uppercase tracking-wider font-bold px-3 py-1 rounded-full border ${
                        book.status === 'Published'
                          ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                          : book.status === 'Approved'
                          ? 'bg-blue-100 text-blue-900 border-blue-300'
                          : book.status === 'In Review' || book.status === 'Pending Review'
                          ? 'bg-purple-100 text-purple-900 border-purple-300'
                          : 'bg-rose-100 text-rose-900 border-rose-300'
                      }`}
                    >
                      {book.status}
                    </span>

                    <span className="inline-flex items-center gap-1 text-xs font-mono font-bold uppercase tracking-wider text-[#181616] group-hover:text-[#7B021D] transition-colors">
                      <span>Review</span> <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })
        ) : (
          <div className="text-center py-20 bg-[#FFFDF3] rounded-3xl border border-[#D8CFAE] space-y-3">
            <FileText className="w-8 h-8 text-[#7B021D] mx-auto opacity-60" />
            <h3 className="font-editorial-serif text-xl font-bold text-[#181616]">
              No Manuscripts Found
            </h3>
            <p className="text-xs text-[#5F594F] font-sans">
              There are currently no manuscripts matching the selected filter criteria.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
