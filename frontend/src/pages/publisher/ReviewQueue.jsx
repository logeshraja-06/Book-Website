import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Clock } from 'lucide-react';
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
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E7D9D3] pb-4">
        <div>
          <h2 className="font-editorial-serif text-2xl text-[#2B2B2B] font-normal">
            Manuscript Review Queue
          </h2>
          <p className="text-xs text-[#6E6A67]">
            {filtered.length} manuscript(s) indexed in queue
          </p>
        </div>
      </div>

      {/* Simple Text-Link Filters with Active Underline */}
      <div className="flex items-center gap-8 border-b border-[#E7D9D3]/60 pb-3 overflow-x-auto">
        {filterTabs.map((tab) => {
          const isActive = filter === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={`relative text-xs font-mono uppercase tracking-wider transition-colors py-2 whitespace-nowrap ${
                isActive ? 'text-[#2B2B2B] font-semibold' : 'text-[#6E6A67] hover:text-[#2B2B2B]'
              }`}
            >
              {tab.label}
              {isActive && (
                <motion.div
                  layoutId="queueTabUnderline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D3968C]"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Editorial List */}
      <div className="space-y-4">
        {filtered.map((book, idx) => {
          const bookId = book.id || book._id;
          return (
            <motion.div
              key={bookId}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: idx * 0.05 }}
            >
              <Link
                to={`/publisher/review/${bookId}`}
              className="bg-[#FFFFFF] rounded-2xl p-5 border border-[#E7D9D3] flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#D3968C] transition-all duration-300 shadow-sm group block"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-16 aspect-[2/3] rounded-lg overflow-hidden bg-[#F4EEEA] shrink-0 border border-[#E7D9D3] shadow-sm">
                  <img
                    src={book.coverUrl}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#D3968C] font-semibold">
                      {book.genre}
                    </span>
                    <span className="text-[#E7D9D3]">·</span>
                    <span className="text-xs font-mono text-[#6E6A67]">
                      Submitted {book.submittedDate || 'Recent'}
                    </span>
                  </div>

                  <h3 className="font-editorial-serif text-lg font-bold text-[#2B2B2B] group-hover:text-[#C98579] transition-colors">
                    {book.title}
                  </h3>

                  <p className="text-xs text-[#6E6A67]">By {book.author}</p>
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#E7D9D3]">
                {/* Quiet Status Label */}
                <span
                  className={`text-xs font-mono uppercase tracking-wider font-semibold ${
                    book.status === 'Published'
                      ? 'text-[#D3968C]'
                      : book.status === 'In Review'
                      ? 'text-[#6E6A67]'
                      : 'text-[#2B2B2B]'
                  }`}
                >
                  {book.status}
                </span>

                <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-[#2B2B2B] group-hover:text-[#D3968C] transition-colors">
                  Review <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          </motion.div>
        );
      })}
      </div>

    </div>
  );
}
